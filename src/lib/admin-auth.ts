import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "sn_admin_session";
const SESSION_DAYS = 7;

export type AdminSession = {
  sub: string;
  channel: "email" | "phone";
  name: string;
};

function getSecret(): Uint8Array {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    "dev-only-change-me-sn-medicare-admin";
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(session: AdminSession): Promise<string> {
  return new SignJWT({
    channel: session.channel,
    name: session.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifyAdminToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      channel: (payload.channel as "email" | "phone") || "email",
      name: (payload.name as string) || "Admin",
    };
  } catch {
    return null;
  }
}

export function adminCookieOptions(
  maxAgeSeconds = SESSION_DAYS * 24 * 60 * 60,
  host?: string | null
) {
  const isSnMedicare = host
    ? host.includes("snmedicare.in")
    : Boolean(
        process.env.NEXT_PUBLIC_SITE_URL?.includes("snmedicare.in") &&
          process.env.NODE_ENV === "production"
      );
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    domain: isSnMedicare ? ".snmedicare.in" : undefined,
    maxAge: maxAgeSeconds,
  };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function getAdminSessionFromRequest(
  req: NextRequest
): Promise<AdminSession | null> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminCookie(
  res: NextResponse,
  token: string,
  host?: string | null
) {
  res.cookies.set(ADMIN_COOKIE, token, adminCookieOptions(undefined, host));
}

export function clearAdminCookie(res: NextResponse, host?: string | null) {
  res.cookies.set(ADMIN_COOKIE, "", adminCookieOptions(0, host));
}
