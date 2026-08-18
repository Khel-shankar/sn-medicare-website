import { NextRequest, NextResponse } from "next/server";
import {
  resolveAdminIdentifier,
  type AdminChannel,
} from "@/lib/admin-allowlist";
import {
  createOtpCookie,
  deliverOtp,
  generateOtpCode,
  OTP_COOKIE,
  otpCookieOptions,
  saveOtp,
  shouldShowOtpOnScreen,
} from "@/lib/otp";
import { formatDbError } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const channel = (body.channel === "phone" ? "phone" : "email") as AdminChannel;
    const resolved = resolveAdminIdentifier(
      channel,
      String(body.identifier || "")
    );

    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 403 });
    }

    const code = generateOtpCode();
    let storedInDb = false;

    try {
      await saveOtp(resolved.identifier, channel, code);
      storedInDb = true;
    } catch (error) {
      console.error("OTP save (DB) error:", formatDbError(error), error);
    }

    try {
      await deliverOtp(channel, resolved.identifier, code);
    } catch (error) {
      console.error("OTP deliver error:", error);
    }

    const payload: Record<string, unknown> = {
      success: true,
      channel,
      message: storedInDb
        ? channel === "email"
          ? "OTP sent to your email"
          : "OTP sent to your phone"
        : "OTP ready. Enter the 6-digit code below.",
      expiresInSeconds: 600,
    };

    if (shouldShowOtpOnScreen()) {
      payload.devOtp = code;
      payload.message = "OTP generated. Use the code shown below.";
    }

    const res = NextResponse.json(payload);
    res.cookies.set(
      OTP_COOKIE,
      createOtpCookie(resolved.identifier, code),
      otpCookieOptions()
    );
    return res;
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: formatDbError(error) || "Failed to send OTP. Try again." },
      { status: 500 }
    );
  }
}
