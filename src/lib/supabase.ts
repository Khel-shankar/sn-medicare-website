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

export function isSupabaseConfigured(): boolean {
  return Boolean(
    cleanEnvVal(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      cleanEnvVal(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

/** Server-only client that bypasses RLS. Never expose to the browser. */
export function getSupabaseAdmin(): SupabaseClient {
  const url = cleanEnvVal(process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/$/, "");
  const key = cleanEnvVal(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
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
