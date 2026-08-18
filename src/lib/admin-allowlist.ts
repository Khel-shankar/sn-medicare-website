import { contactInfo } from "@/data/team";

function splitCsv(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Digits only, with India default country code when 10-digit mobile. */
export function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.startsWith("0") && digits.length === 11) {
    digits = `91${digits.slice(1)}`;
  }
  return digits;
}

export function getAdminEmails(): string[] {
  const fromEnv = splitCsv(process.env.ADMIN_EMAILS).map(normalizeEmail);
  const defaults = [contactInfo.email].map(normalizeEmail);
  return [...new Set([...fromEnv, ...defaults])];
}

export function getAdminPhones(): string[] {
  const fromEnv = splitCsv(process.env.ADMIN_PHONES).map(normalizePhone);
  // Default: Satvik only (first contact number)
  const satvik = contactInfo.phones[0]?.tel;
  const defaults = satvik ? [normalizePhone(satvik)] : [];
  return [...new Set([...fromEnv, ...defaults])];
}

export function isAllowedAdminEmail(email: string): boolean {
  return getAdminEmails().includes(normalizeEmail(email));
}

export function isAllowedAdminPhone(phone: string): boolean {
  return getAdminPhones().includes(normalizePhone(phone));
}

export type AdminChannel = "email" | "phone";

export function resolveAdminIdentifier(
  channel: AdminChannel,
  raw: string
): { ok: true; identifier: string } | { ok: false; error: string } {
  const value = raw.trim();
  if (!value) {
    return { ok: false, error: "Enter your email or phone number" };
  }

  if (channel === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return { ok: false, error: "Enter a valid email address" };
    }
    if (!isAllowedAdminEmail(value)) {
      return { ok: false, error: "This email is not authorized for admin access" };
    }
    return { ok: true, identifier: normalizeEmail(value) };
  }

  const phone = normalizePhone(value);
  if (phone.length < 12) {
    return { ok: false, error: "Enter a valid 10-digit Indian mobile number" };
  }
  if (!isAllowedAdminPhone(value)) {
    return { ok: false, error: "This phone number is not authorized for admin access" };
  }
  return { ok: true, identifier: phone };
}
