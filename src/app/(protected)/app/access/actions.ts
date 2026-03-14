"use server";

import { revalidatePath } from "next/cache";

import { requireOwnerSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";

async function requireOwnerAccess() {
  const session = await requireOwnerSession();
  const db = getDb();

  if (!session || !db) {
    return null;
  }

  return { session, db };
}

export async function approveAccessRequestAction(formData: FormData) {
  const access = await requireOwnerAccess();
  const requestId = formData.get("requestId");

  if (!access || typeof requestId !== "string") {
    return;
  }

  await access.db.$transaction(async (tx) => {
    const request = await tx.accessRequest.findUnique({ where: { id: requestId } });

    if (!request || request.status !== "pending") {
      return;
    }

    let linkedUserId = request.linkedUserId;

    if (!linkedUserId) {
      const existingUser = await tx.user.findUnique({ where: { email: request.email } });

      if (existingUser) {
        linkedUserId = existingUser.id;
      } else {
        const createdUser = await tx.user.create({
          data: {
            email: request.email,
            displayName: request.displayName,
            role: "member",
            accessStatus: "active",
            approvedAt: new Date(),
            approvedByUserId: access.session.user.id,
          },
        });

        linkedUserId = createdUser.id;
      }
    }

    await tx.user.update({
      where: { id: linkedUserId },
      data: {
        displayName: request.displayName ?? undefined,
        accessStatus: "active",
        approvedAt: new Date(),
        approvedByUserId: access.session.user.id,
      },
    });

    await tx.accessRequest.update({
      where: { id: request.id },
      data: {
        status: "approved",
        reviewedAt: new Date(),
        reviewerUserId: access.session.user.id,
        linkedUserId,
      },
    });
  });

  revalidatePath("/app/access");
}

export async function rejectAccessRequestAction(formData: FormData) {
  const access = await requireOwnerAccess();
  const requestId = formData.get("requestId");

  if (!access || typeof requestId !== "string") {
    return;
  }

  await access.db.$transaction(async (tx) => {
    const request = await tx.accessRequest.findUnique({ where: { id: requestId } });

    if (!request || request.status !== "pending") {
      return;
    }

    if (request.linkedUserId) {
      await tx.user.update({
        where: { id: request.linkedUserId },
        data: {
          accessStatus: "rejected",
        },
      });
    }

    await tx.accessRequest.update({
      where: { id: request.id },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
        reviewerUserId: access.session.user.id,
      },
    });
  });

  revalidatePath("/app/access");
}
