"use server";

import { z } from "zod";

import { getDb } from "@/lib/db";
import { hash } from "bcryptjs";
import { hashPasswordResetToken } from "@/lib/auth/reset-tokens";
import { enforceRateLimit, isRateLimitError } from "@/lib/security/rate-limit";
import { getRequestIp } from "@/lib/security/request-context";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function resetPasswordAction(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const result = resetPasswordSchema.safeParse(rawData);
    const ip = await getRequestIp();

    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    const { token, password } = result.data;
    const tokenHash = hashPasswordResetToken(token);

    enforceRateLimit(`reset-password:${ip}`, 10, 1000 * 60 * 15);
    enforceRateLimit(`reset-password-token:${tokenHash}`, 5, 1000 * 60 * 15);

    const db = getDb();
    if (!db) return { error: "Database not configured" };

    const resetToken = await db.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return { error: "Invalid or expired reset token" };
    }

    const passwordHash = await hash(password, 10);

    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      db.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } }),
    ]);

    return { success: true };
  } catch (error) {
    if (isRateLimitError(error)) {
      return { error: "Too many reset attempts. Please wait a few minutes and try again." };
    }

    console.error("Reset password error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
