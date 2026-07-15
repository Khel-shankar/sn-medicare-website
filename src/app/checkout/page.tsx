"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  Loader2,
  CheckCircle,
  Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const PROMO_STORAGE_KEY = "sn-medicare-promo";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    discount: number;
    description?: string;
  } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const payable = useMemo(() => {
    if (!promoApplied) return totalPrice;
    return Math.max(1, totalPrice - promoApplied.discount);
  }, [totalPrice, promoApplied]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROMO_STORAGE_KEY);
      if (saved) setPromoInput(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const applyPromoCode = async (codeOverride?: string) => {
    const code = String(
      typeof codeOverride === "string" ? codeOverride : promoInput
    )
      .trim()
      .toUpperCase();
    if (!code) return;
    setPromoError("");
    setPromoLoading(true);
    try {
      const res = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          subtotal: totalPrice,
          items: items.map((i) => ({
            productId: i.productId,
            brand: i.brand,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setPromoApplied(null);
        setPromoError(data.error || "Invalid promo code");
      } else {
        setPromoApplied({
          code: data.code,
          discount: data.discount,
          description: data.description,
        });
        setPromoInput(data.code);
        try {
          localStorage.setItem(PROMO_STORAGE_KEY, data.code);
        } catch {
          /* ignore */
        }
      }
    } catch {
      setPromoError("Could not validate promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0 || totalPrice < 1) return;
    try {
      const saved = localStorage.getItem(PROMO_STORAGE_KEY);
      if (saved) {
        setPromoInput(saved);
        void applyPromoCode(saved);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, totalPrice]);

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="pt-32 pb-20 min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-gray-400 mb-6">No items to checkout</p>
        <Link
          href="/products"
          className="btn-primary px-8 py-3 rounded-xl font-semibold text-black"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="pt-32 pb-20 min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle className="w-20 h-20 text-kivo-plus mb-6" />
        <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Thank you for your order. We&apos;ll send a confirmation to{" "}
          {form.email}. Your products will be shipped soon.
        </p>
        <Link
          href="/products"
          className="btn-primary px-8 py-3 rounded-xl font-semibold text-black"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          customer: form,
          promoCode: promoApplied?.code || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create order");
        setLoading(false);
        return;
      }

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "S.N. Medicare",
        description: "Kivo Pro & Kivo Plus — Kinesiology Tape",
        order_id: data.orderId,
        handler: async (response) => {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              customer: form,
              items,
              totalPrice: data.finalTotal,
              promoCode: data.promoCode,
              discount: data.discount,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            setOrderPlaced(true);
          } else {
            setError("Payment verification failed. Contact support.");
          }
          setLoading(false);
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#00b4f5" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">
          <span className="gradient-text">Checkout</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-kivo-cyan" />
                Contact Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none transition-colors"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none transition-colors"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone (+91)"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none transition-colors sm:col-span-2"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-kivo-cyan" />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <textarea
                  required
                  placeholder="Full Address"
                  rows={3}
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none transition-colors resize-none"
                />
                <div className="grid sm:grid-cols-3 gap-4">
                  <input
                    required
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none transition-colors"
                  />
                  <input
                    required
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none transition-colors"
                  />
                  <input
                    required
                    placeholder="PIN Code"
                    pattern="[0-9]{6}"
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-surface border border-border sticky top-32">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        quality={65}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="section-divider mb-4" />

              <div className="mb-4">
                <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-kivo-cyan" />
                  Promo Code
                </h3>
                <div className="flex gap-2">
                  <input
                    placeholder="e.g. KIVO50"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:border-kivo-cyan focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => applyPromoCode()}
                    disabled={promoLoading || !promoInput.trim()}
                    className="px-4 py-2 rounded-lg border border-kivo-cyan/40 text-kivo-cyan text-sm font-medium hover:bg-kivo-cyan/10 disabled:opacity-50"
                  >
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </div>
                {promoError && (
                  <p className="text-xs text-red-400 mt-2">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="text-xs text-kivo-plus mt-2">
                    {promoApplied.code} applied — {promoApplied.description} (−₹
                    {promoApplied.discount})
                  </p>
                )}
                <p className="text-[10px] text-gray-600 mt-2">
                  Try: KIVO50 (Pro 50%) · KIVO40 (Plus 40%)
                </p>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-kivo-plus">
                    <span>Discount</span>
                    <span>−₹{promoApplied.discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-kivo-cyan">₹{payable}</span>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-black disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                {loading ? "Processing..." : `Pay ₹${payable}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                <Mail className="w-3 h-3" />
                Secured by Razorpay
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
