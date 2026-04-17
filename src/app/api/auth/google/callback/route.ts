import { NextResponse } from "next/server";

import { googleClient } from "@/lib/auth/google";
import { getDb } from "@/lib/db";
import { consumeGoogleOAuthState } from "@/lib/auth/google-state";
import { createUserSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = await consumeGoogleOAuthState();

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=GoogleAuthFailed", req.url));
  }

  try {
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Verify the ID token to get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("No payload from Google");
    }

    const { email, sub: googleId, name } = payload;
    const db = getDb();
    if (!db) throw new Error("Database not configured");
    
    let user = await db.user.findUnique({ where: { email } });
    
    if (user) {
      // Update existing user to include Google ID if not set
      if (!user.googleId) {
        user = await db.user.update({
          where: { email },
          data: { googleId, provider: "google" }
        });
      }
    } else {
      // Create a new user
      user = await db.user.create({
        data: {
          email,
          displayName: name || null,
          googleId,
          provider: "google",
          role: "member",
          accessStatus: "pending"
        }
      });
    }

    if (user.accessStatus !== "active") {
      return NextResponse.redirect(new URL("/login?error=AccountPending", req.url));
    }

    await createUserSession({
      sub: user.id,
      email: user.email,
      name: user.displayName || user.email,
      role: user.role,
    });

    return NextResponse.redirect(new URL("/app", req.url));
  } catch (err) {
    console.error("Google Auth Error:", err);
    return NextResponse.redirect(new URL("/login?error=GoogleAuthFailed", req.url));
  }
}
