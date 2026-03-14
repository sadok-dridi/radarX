"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { verifyPassword } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";

type LoginActionState = {
  status: "idle" | "error";
  message?: string;
};

const loginSchema = z.object({
  email: z.string().email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8),
});

export async function loginAction(_: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter a valid email and password.",
    };
  }

  const db = getDb();

  if (!db) {
    return {
      status: "error",
      message: "Database access is not configured yet. Add DATABASE_URL before using real authentication.",
    };
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user?.passwordHash) {
    return {
      status: "error",
      message: "Invalid email or password.",
    };
  }

  const isPasswordValid = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!isPasswordValid) {
    return {
      status: "error",
      message: "Invalid email or password.",
    };
  }

  if (user.accessStatus === "pending") {
    return {
      status: "error",
      message: "Your account is waiting for owner approval.",
    };
  }

  if (user.accessStatus === "suspended") {
    return {
      status: "error",
      message: "Your account is suspended. Contact the owner if you need access restored.",
    };
  }

  if (user.accessStatus === "rejected") {
    return {
      status: "error",
      message: "Your access request was rejected. You can submit a new request if needed.",
    };
  }

  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createUserSession({
    sub: user.id,
    email: user.email,
    name: user.displayName ?? user.email,
    role: user.role,
  });

  redirect("/app");
}
