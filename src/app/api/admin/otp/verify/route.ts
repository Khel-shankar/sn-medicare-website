import { NextRequest, NextResponse } from "next/server";
import {
  resolveAdminIdentifier,
  type AdminChannel,
} from "@/lib/admin-allowlist";
import { createAdminToken, setAdminCookie } from "@/lib/admin-auth";
import {
  OTP_COOKIE,
  otpCookieOptions,
  verifyOtp,
  verifyOtpCookie,
} from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const channel = (body.channel === "phone" ? "phone" : "email") as AdminChannel;
    const code = String(body.code || "").trim();
    const resolved = resolveAdminIdentifier(
      channel,
      String(body.identifier || "")
    );

    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 403 });
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Enter the 6-digit OTP" },
        { status: 400 }
      );
    }

    let ok = false;
    try {
      const result = await verifyOtp(resolved.identifier, code);
      ok = result.ok;
    } catch (error) {
      console.error("OTP DB verify error:", error);
    }

    if (!ok) {
      ok = verifyOtpCookie(
        req.cookies.get(OTP_COOKIE)?.value,
        resolved.identifier,
        code
      );
    }

    if (!ok) {
      return NextResponse.json({ error: "Incorrect or expired OTP" }, { status: 401 });
    }

    const token = await createAdminToken({
      sub: resolved.identifier,
      channel,
      name: "Satvik Nandwani",
    });

    const res = NextResponse.json({ success: true });
    setAdminCookie(res, token, req.headers.get("host"));
    res.cookies.set(OTP_COOKIE, "", { ...otpCookieOptions(), maxAge: 0 });
    return res;
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "Login failed. Try again." },
      { status: 500 }
    );
  }
}
