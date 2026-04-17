"use server";

import { z } from "zod";

import { getDb } from "@/lib/db";
import { isMailerConfigured, sendPasswordResetEmail } from "@/lib/auth/mailer";
import { createPasswordResetToken } from "@/lib/auth/reset-tokens";
import { enforceRateLimit, isRateLimitError } from "@/lib/security/rate-limit";
import { getRequestIp } from "@/lib/security/request-context";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function forgotPasswordAction(formData: FormData) {
  try {
    const email = formData.get("email");
    const result = forgotPasswordSchema.safeParse({ email });
    const ip = await getRequestIp();

    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    enforceRateLimit(`forgot-password:${ip}`, 5, 1000 * 60 * 15);
    enforceRateLimit(`forgot-password-email:${result.data.email}`, 3, 1000 * 60 * 15);

    const db = getDb();
    if (!db) return { error: "Database not configured" };
    if (!isMailerConfigured()) return { error: "Password reset is temporarily unavailable." };

    const user = await db.user.findUnique({ where: { email: result.data.email } });

    if (!user) {
      // Don't leak whether the user exists
      return { success: true };
    }

    const { token, tokenHash } = createPasswordResetToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.$transaction([
      db.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      db.passwordResetToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt,
        },
      }),
    ]);

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

    await sendPasswordResetEmail({
      to: user.email,
      resetLink,
    });

    return { success: true };
  } catch (error) {
    if (isRateLimitError(error)) {
      return { error: "Too many reset attempts. Please wait a few minutes and try again." };
    }

    console.error("Forgot password error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
