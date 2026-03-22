import "server-only";

import { cookies } from "next/headers";

import { SignJWT, jwtVerify } from "jose";

import { getDb, isDatabaseConfigured } from "@/lib/db";

export type AppRole = "owner" | "member";

export type AppSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: AppRole;
  };
} | null;

const SESSION_COOKIE = "opportunity_radar_session";

type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: AppRole;
};

function isDevBypassEnabled() {
  return process.env.DEV_AUTH_BYPASS === "true";
}

function getAuthSecret() {
  if (!process.env.AUTH_SECRET) {
    return null;
  }

  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

export async function createUserSession(input: SessionPayload) {
  const secret = getAuthSecret();

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  const token = await new SignJWT({
    email: input.email,
    name: input.name,
    role: input.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentSession(options?: { allowDevBypass?: boolean }): Promise<AppSession> {
  const allowDevBypass = options?.allowDevBypass ?? true;

  if (allowDevBypass && isDevBypassEnabled()) {
    return {
      user: {
        id: "local-owner-preview",
        name: "Owner Preview",
        email: "owner@opportunity-radar.local",
        role: "owner",
      },
    };
  }

  const secret = getAuthSecret();
  if (!secret) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.sub;

    if (typeof userId !== "string") {
      return null;
    }

    if (!isDatabaseConfigured()) {
      return null;
    }

    const db = getDb();
    if (!db) {
      return null;
    }

    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user || user.accessStatus !== "active") {
      return null;
    }

    return {
      user: {
        id: user.id,
        name: user.displayName ?? user.email,
        email: user.email,
        role: user.role,
      },
    };
  } catch {
    return null;
  }
}

export async function requireOwnerSession() {
  const session = await getCurrentSession();

  if (!session || session.user.role !== "owner") {
    return null;
  }

  return session;
}
