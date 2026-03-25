"use server";

import { z } from "zod";
import { getDb } from "@/lib/db";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function forgotPasswordAction(formData: FormData) {
  try {
    const email = formData.get("email");
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    const db = getDb();
    if (!db) return { error: "Database not configured" };

    const user = await db.user.findUnique({ where: { email: result.data.email } });

    if (!user) {
      // Don't leak whether the user exists
      return { success: true };
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "sadok.dridi.engineer@gmail.com",
        pass: "REMOVED_FROM_HISTORY",
      },
    });

    await transporter.sendMail({
      from: '"RadarX App" <sadok.dridi.engineer@gmail.com>',
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #020617; color: #f8fafc; border-radius: 16px;">
          <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #ffffff;">Reset your password</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 16px;">You recently requested to reset your password for your RadarX account.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 32px;">Click the button below to reset it. This link is only valid for 1 hour.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background-color: #ffffff; color: #020617; text-decoration: none; border-radius: 9999px; font-weight: 500; font-size: 16px; text-align: center;">Reset Password</a>
          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="font-size: 14px; color: #64748b; margin: 0;">If you did not request a password reset, please ignore this email.</p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
