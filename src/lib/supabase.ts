import dns from "node:dns";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

if (typeof dns?.setDefaultResultOrder === "function" && process.platform === "win32") {
  try {
    dns.setDefaultResultOrder("ipv4first");
  } catch {}
}

let adminClient: SupabaseClient | null = null;

function cleanEnvVal(val: string | undefined): string {
  if (!val) return "";
  let s = val.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function getSupabaseUrl(): string {
  const envUrl = cleanEnvVal(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (envUrl && !envUrl.includes("xxxx.supabase.co")) {
    return envUrl.replace(/\/$/, "");
  }
  return "https://taywtlmjyjjirnkpucfm.supabase.co";
}

function getSupabaseKey(): string {
  const envKey = cleanEnvVal(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (envKey && !envKey.startsWith("eyJhbGciOi...") && !envKey.includes("xxxxx")) {
    return envKey;
  }
  return "";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

/** Server-only client that bypasses RLS. Never expose to the browser. */
export function getSupabaseAdmin(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url || url.includes("xxxx.supabase.co")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. Please add NEXT_PUBLIC_SUPABASE_URL=https://taywtlmjyjjirnkpucfm.supabase.co in Vercel Settings -> Environment Variables."
    );
  }

  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing in Vercel Environment Variables. Please add your Supabase service_role secret key in Vercel Settings."
    );
  }

  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}

export function formatDbError(error: unknown): string {
  if (!error) return "Unknown database error";
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const cause = (error as { cause?: unknown }).cause;
    let causeStr = "";
    if (cause) {
      causeStr =
        cause instanceof Error
          ? cause.message
          : typeof cause === "object"
          ? JSON.stringify(cause)
          : String(cause);
    }
    return causeStr ? `${error.message} [cause: ${causeStr}]` : error.message;
  }
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown database error";
}
