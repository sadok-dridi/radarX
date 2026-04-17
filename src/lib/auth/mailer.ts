import "server-only";

import nodemailer from "nodemailer";

type MailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

function getMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!host || !user || !pass || !from || Number.isNaN(port)) {
    return null;
  }

  return { host, port, user, pass, from };
}

export function isMailerConfigured() {
  return getMailConfig() !== null;
}

export async function sendPasswordResetEmail(input: { to: string; resetLink: string }) {
  const config = getMailConfig();

  if (!config) {
    throw new Error("MAILER_NOT_CONFIGURED");
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to: input.to,
    subject: "Reset your password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #020617; color: #f8fafc; border-radius: 16px;">
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #ffffff;">Reset your password</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 16px;">You recently requested to reset your password for your RadarX account.</p>
        <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 32px;">Click the button below to reset it. This link is only valid for 1 hour.</p>
        <a href="${input.resetLink}" style="display: inline-block; padding: 14px 28px; background-color: #ffffff; color: #020617; text-decoration: none; border-radius: 9999px; font-weight: 500; font-size: 16px; text-align: center;">Reset Password</a>
        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="font-size: 14px; color: #64748b; margin: 0;">If you did not request a password reset, please ignore this email.</p>
        </div>
      </div>
    `,
  });
}
