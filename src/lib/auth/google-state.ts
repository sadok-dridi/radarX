import "server-only";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";

const GOOGLE_STATE_COOKIE = "opportunity_radar_google_oauth_state";
const GOOGLE_STATE_TTL_SECONDS = 60 * 10;

export async function createGoogleOAuthState() {
  const state = randomBytes(32).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GOOGLE_STATE_TTL_SECONDS,
  });

  return state;
}

export async function consumeGoogleOAuthState() {
  const cookieStore = await cookies();
  const state = cookieStore.get(GOOGLE_STATE_COOKIE)?.value ?? null;

  cookieStore.delete(GOOGLE_STATE_COOKIE);

  return state;
}
