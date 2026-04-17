"use server";

import { hashPassword } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { enforceRateLimit, isRateLimitError } from "@/lib/security/rate-limit";
import { getRequestIp } from "@/lib/security/request-context";
import { requestAccessSchema, type RequestAccessInput } from "@/lib/validations/auth";

export type RequestAccessActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function requestAccessAction(
  data: RequestAccessInput,
): Promise<RequestAccessActionState> {
  try {
    const parsed = requestAccessSchema.safeParse(data);
    const ip = await getRequestIp();

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues[0]?.message ?? "Please review the form fields and try again.",
      };
    }

    enforceRateLimit(`request-access:${ip}`, 5, 1000 * 60 * 60);
    enforceRateLimit(`request-access-email:${parsed.data.email}`, 3, 1000 * 60 * 60);

    const db = getDb();

    if (!db) {
      return {
        status: "error",
        message: "Database access is not configured yet. Add DATABASE_URL before enabling access requests.",
      };
    }

    const { displayName, email, password } = parsed.data;
    const passwordHash = await hashPassword(password);
    const bootstrapOwnerEmail = process.env.OWNER_BOOTSTRAP_EMAIL?.trim().toLowerCase();

    const result = await db.$transaction(async (tx) => {
      const ownerExists = await tx.user.findFirst({ where: { role: "owner" } });
      const shouldBootstrapOwner = !ownerExists && bootstrapOwnerEmail && email === bootstrapOwnerEmail;

      const existingUser = await tx.user.findUnique({ where: { email } });

      if (existingUser?.accessStatus === "active") {
        return {
          type: "error" as const,
          message: "An active account already exists for this email. You can log in directly.",
        };
      }

      const user = existingUser
        ? await tx.user.update({
            where: { id: existingUser.id },
            data: {
              displayName,
              passwordHash,
              role: shouldBootstrapOwner ? "owner" : existingUser.role,
              accessStatus: shouldBootstrapOwner ? "active" : "pending",
              approvedAt: shouldBootstrapOwner ? new Date() : null,
              approvedByUserId: null,
            },
          })
        : await tx.user.create({
            data: {
              displayName,
              email,
              passwordHash,
              role: shouldBootstrapOwner ? "owner" : "member",
              accessStatus: shouldBootstrapOwner ? "active" : "pending",
              approvedAt: shouldBootstrapOwner ? new Date() : null,
            },
          });

      const pendingRequest = await tx.accessRequest.findFirst({
        where: {
          email,
          status: "pending",
        },
        orderBy: {
          requestedAt: "desc",
        },
      });

      if (shouldBootstrapOwner) {
        if (pendingRequest) {
          await tx.accessRequest.update({
            where: { id: pendingRequest.id },
            data: {
              displayName,
              status: "approved",
              reviewedAt: new Date(),
              linkedUserId: user.id,
              decisionNote: "Bootstrapped as initial owner.",
            },
          });
        } else {
          await tx.accessRequest.create({
            data: {
              email,
              displayName,
              status: "approved",
              reviewedAt: new Date(),
              linkedUserId: user.id,
              decisionNote: "Bootstrapped as initial owner.",
            },
          });
        }

        return {
          type: "owner-bootstrap" as const,
          user,
        };
      }

      if (pendingRequest) {
        await tx.accessRequest.update({
          where: { id: pendingRequest.id },
          data: {
            displayName,
            linkedUserId: user.id,
            reviewedAt: null,
            reviewerUserId: null,
            decisionNote: null,
          },
        });
      } else {
        await tx.accessRequest.create({
          data: {
            email,
            displayName,
            status: "pending",
            linkedUserId: user.id,
          },
        });
      }

      return {
        type: "pending" as const,
      };
    });

    if (result.type === "error") {
      return {
        status: "error",
        message: result.message,
      };
    }

    if (result.type === "owner-bootstrap") {
      await createUserSession({
        sub: result.user.id,
        email: result.user.email,
        name: result.user.displayName ?? result.user.email,
        role: result.user.role,
      });

      return {
        status: "success",
        message: "Owner account created and authenticated. You can now enter the workspace.",
      };
    }

    return {
      status: "success",
      message: "Request submitted. Your account will stay pending until the owner approves it.",
    };
  } catch (error) {
    if (isRateLimitError(error)) {
      return {
        status: "error",
        message: "Too many access requests. Please wait before trying again.",
      };
    }

    throw error;
  }
}
