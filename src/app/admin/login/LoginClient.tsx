"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Phone, ShieldCheck, ArrowLeft } from "lucide-react";

type Channel = "email" | "phone";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [channel, setChannel] = useState<Channel>("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"identify" | "otp">("identify");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [info, setInfo] = useState("");
  const [password, setPassword] = useState("");

  const placeholder = useMemo(
    () => (channel === "email" ? "info@snmedicare.in" : "70149 49153"),
    [channel]
  );

  const sendOtp = async (e?: FormEvent) => {
    e?.preventDefault();
    setError("");
    setInfo("");
    setDevOtp(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }
      setStep("otp");
      setInfo(data.message || "OTP sent");
      if (data.devOtp) setDevOtp(String(data.devOtp));
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Incorrect password");
        return;
      }
      router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, identifier, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }
      router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/images/kivo-header-logo.png"
            alt="KIVO"
            width={200}
            height={80}
            className="mx-auto h-14 w-auto mb-4"
            priority
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-kivo-cyan mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Founder dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, Satvik
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Login with email or phone. We&apos;ll send a one-time code.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-surface/80 backdrop-blur-xl p-5 sm:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-background/70 border border-border mb-6">
            <button
              type="button"
              onClick={() => {
                setChannel("email");
                setStep("identify");
                setOtp("");
                setError("");
                setDevOtp(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
                channel === "email"
                  ? "bg-kivo-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setChannel("phone");
                setStep("identify");
                setOtp("");
                setError("");
                setDevOtp(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
                channel === "phone"
                  ? "bg-kivo-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
          </div>

          {step === "identify" ? (
            <div className="space-y-5">
              <form onSubmit={sendOtp} className="space-y-4">
                <label className="block text-sm text-gray-300">
                  {channel === "email" ? "Admin email" : "Admin phone"}
                  <input
                    required
                    autoFocus
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={placeholder}
                    type={channel === "email" ? "email" : "tel"}
                    inputMode={channel === "email" ? "email" : "tel"}
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-kivo-cyan"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full rounded-xl py-3 font-semibold text-black disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Send OTP
                </button>
              </form>

              <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-gray-500">
                <span className="h-px flex-1 bg-border" />
                or password
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={loginWithPassword} className="space-y-4">
                <label className="block text-sm text-gray-300">
                  Dashboard password
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter admin password"
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-kivo-cyan"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading || !identifier.trim()}
                  className="btn-outline w-full rounded-xl py-3 font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Sign in with password
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setStep("identify");
                  setOtp("");
                  setError("");
                }}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-kivo-cyan"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change {channel}
              </button>
              <p className="text-sm text-gray-400">
                Code sent to{" "}
                <span className="text-white font-medium">{identifier}</span>
              </p>
              <label className="block text-sm text-gray-300">
                6-digit OTP
                <input
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="••••••"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-2xl tracking-[0.4em] font-semibold outline-none focus:border-kivo-cyan"
                />
              </label>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full rounded-xl py-3 font-semibold text-black disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Verify & enter dashboard
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => sendOtp()}
                className="w-full text-sm text-gray-400 hover:text-kivo-cyan"
              >
                Resend OTP
              </button>
            </form>
          )}

          {info ? <p className="mt-4 text-sm text-kivo-plus">{info}</p> : null}
          {devOtp ? (
            <p className="mt-3 rounded-xl border border-kivo-cyan/30 bg-kivo-cyan/10 px-3 py-2 text-xs text-kivo-cyan">
              Dev OTP: <span className="font-mono font-bold">{devOtp}</span>
            </p>
          ) : null}
          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Only authorized S.N. Medicare admins can access this area.
        </p>
      </div>
    </div>
  );
}
