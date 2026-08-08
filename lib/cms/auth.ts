import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { CmsRole, CmsUser } from "./types";
import { readStore } from "./store";

export const CMS_SESSION_COOKIE = "ttw_cms_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const s =
    process.env.CMS_SECRET ||
    process.env.PAYLOAD_SECRET ||
    "dev-only-change-me-true-word-cms-secret-32b";
  return new TextEncoder().encode(s);
}

/**
 * Secure cookies only work on HTTPS. On plain-HTTP Coolify (sslip), set
 * CMS_COOKIE_SECURE=false so the browser will store the session cookie.
 * Default: secure in production, off in development.
 */
export function cookieSecure(): boolean {
  const override = process.env.CMS_COOKIE_SECURE?.trim().toLowerCase();
  if (override === "true" || override === "1") return true;
  if (override === "false" || override === "0") return false;
  return process.env.NODE_ENV === "production";
}

export function sessionCookieOptions(token: string) {
  return {
    name: CMS_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
    maxAge: MAX_AGE,
  };
}

export type SessionPayload = {
  sub: string;
  email: string;
  role: CmsRole;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: CmsUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    role: user.role,
  } satisfies Omit<SessionPayload, "sub">)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      role: (payload.role as CmsRole) || "editor",
    };
  } catch {
    return null;
  }
}

/** Prefer applying the cookie on the Route Handler response (see applySessionCookie). */
export async function setSessionCookie(token: string) {
  const jar = await cookies();
  const opts = sessionCookieOptions(token);
  jar.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    sameSite: opts.sameSite,
    secure: opts.secure,
    path: opts.path,
    maxAge: opts.maxAge,
  });
}

/** Attach session cookie to the login response (reliable behind reverse proxies). */
export function applySessionCookie(res: NextResponse, token: string) {
  const opts = sessionCookieOptions(token);
  res.cookies.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    sameSite: opts.sameSite,
    secure: opts.secure,
    path: opts.path,
    maxAge: opts.maxAge,
  });
  return res;
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(CMS_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 0,
  });
}

export function applyClearSessionCookie(res: NextResponse) {
  res.cookies.set(CMS_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(CMS_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export function findUserByEmail(email: string): CmsUser | undefined {
  const store = readStore();
  return store.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
}
