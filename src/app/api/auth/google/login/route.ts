import { NextResponse } from "next/server";

import { createGoogleOAuthState } from "@/lib/auth/google-state";
import { googleClient } from "@/lib/auth/google";
import { enforceRateLimit, isRateLimitError } from "@/lib/security/rate-limit";
import { getRequestIp } from "@/lib/security/request-context";

export async function GET() {
  try {
    const ip = await getRequestIp();
    enforceRateLimit(`google-login:${ip}`, 20, 1000 * 60 * 10);

    const state = await createGoogleOAuthState();
    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
      state,
    });

    return NextResponse.redirect(url);
  } catch (error) {
    if (isRateLimitError(error)) {
      return NextResponse.redirect(new URL("/login?error=TooManyAttempts", process.env.APP_URL ?? "http://localhost:3000"));
    }

    throw error;
  }
}
