import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { AdminChannel } from "@/lib/admin-allowlist";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function generateOtpCode(): string {
  return String(crypto.randomInt(100000, 999999));
}

export function hashOtp(code: string, identifier: string): string {
  return crypto
    .createHash("sha256")
    .update(`${identifier}:${code}:${process.env.ADMIN_SESSION_SECRET || "salt"}`)
    .digest("hex");
}

export async function saveOtp(
  identifier: string,
  channel: AdminChannel,
  code: string
): Promise<void> {
  const db = getSupabaseAdmin();
  const code_hash = hashOtp(code, identifier);
  const expires_at = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await db.from("admin_otps").delete().eq("identifier", identifier);

  const { error } = await db.from("admin_otps").insert({
    identifier,
    channel,
    code_hash,
    expires_at,
    attempts: 0,
  });

  if (error) throw new Error(error.message);
}

export const OTP_COOKIE = "sn_admin_otp";
const OTP_COOKIE_TTL_SECONDS = 10 * 60;

function hmac(value: string): string {
  return crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "salt")
    .update(value)
    .digest("hex");
}

/** Short-lived signed cookie so OTP still works if Supabase is unreachable. */
export function createOtpCookie(identifier: string, code: string): string {
  const exp = Date.now() + OTP_TTL_MS;
  const payload = `${identifier}.${hashOtp(code, identifier)}.${exp}`;
  return `${payload}.${hmac(payload)}`;
}

export function otpCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: OTP_COOKIE_TTL_SECONDS,
  };
}

export function verifyOtpCookie(
  cookie: string | undefined,
  identifier: string,
  code: string
): boolean {
  if (!cookie) return false;
  const parts = cookie.split(".");
  if (parts.length < 4) return false;
  const sig = parts.pop() as string;
  const exp = parts.pop() as string;
  const hash = parts.pop() as string;
  const id = parts.join(".");
  const payload = `${id}.${hash}.${exp}`;
  if (hmac(payload) !== sig) return false;
  if (id !== identifier) return false;
  if (Number(exp) < Date.now()) return false;
  return hash === hashOtp(code, identifier);
}

export function shouldShowOtpOnScreen(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.ADMIN_OTP_DEBUG === "true"
  );
}

export async function verifyOtp(
  identifier: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("admin_otps")
    .select("*")
    .eq("identifier", identifier)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { ok: false, error: "Could not verify OTP" };
  if (!data) return { ok: false, error: "No OTP found. Request a new code." };

  if (new Date(data.expires_at).getTime() < Date.now()) {
    await db.from("admin_otps").delete().eq("id", data.id);
    return { ok: false, error: "OTP expired. Request a new code." };
  }

  if (data.attempts >= MAX_ATTEMPTS) {
    await db.from("admin_otps").delete().eq("id", data.id);
    return { ok: false, error: "Too many attempts. Request a new code." };
  }

  const expected = hashOtp(code.trim(), identifier);
  if (expected !== data.code_hash) {
    await db
      .from("admin_otps")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id);
    return { ok: false, error: "Incorrect OTP" };
  }

  await db.from("admin_otps").delete().eq("identifier", identifier);
  return { ok: true };
}

async function sendEmailOtp(email: string, code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL || "S.N. Medicare <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[admin-otp] Email OTP for ${email}: ${code}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `${code} — S.N. Medicare admin login`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0f1117;color:#f5f5f5;border-radius:12px;">
          <h2 style="color:#00b4f5;margin:0 0 12px;">S.N. Medicare Admin</h2>
          <p style="margin:0 0 16px;color:#ccc;">Your one-time login code:</p>
          <p style="font-size:32px;letter-spacing:8px;font-weight:700;margin:0 0 16px;color:#fff;">${code}</p>
          <p style="margin:0;color:#888;font-size:13px;">Valid for 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send email OTP: ${body}`);
  }
}

async function sendSmsOtp(phone: string, code: string): Promise<void> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  const sender = process.env.MSG91_SENDER_ID || "SNMEDI";

  if (!authKey || !templateId) {
    console.log(`[admin-otp] SMS OTP for +${phone}: ${code}`);
    return;
  }

  const res = await fetch("https://control.msg91.com/api/v5/flow/", {
    method: "POST",
    headers: {
      authkey: authKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template_id: templateId,
      short_url: "0",
      recipients: [
        {
          mobiles: phone,
          otp: code,
          VAR1: code,
        },
      ],
      sender,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to send SMS OTP: ${body}`);
  }
}

export async function deliverOtp(
  channel: AdminChannel,
  identifier: string,
  code: string
): Promise<void> {
  if (channel === "email") {
    await sendEmailOtp(identifier, code);
  } else {
    await sendSmsOtp(identifier, code);
  }
}
