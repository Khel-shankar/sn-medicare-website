"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Package,
  Phone,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import type { OrderRow, OrderStatus } from "@/lib/order-types";
import { formatInr } from "@/lib/format";

const STATUSES: OrderStatus[] = [
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order not found");
        setOrder(null);
        return;
      }
      setOrder(data.order);
    } catch {
      setError("Could not load order");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (status: OrderStatus) => {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const copyAddress = async () => {
    if (!order) return;
    const text = [
      order.customer_name,
      order.address,
      [order.city, order.state, order.pincode].filter(Boolean).join(", "),
      order.customer_phone,
    ]
      .filter(Boolean)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center gap-2 text-gray-400 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-red-400 mb-4">{error || "Order not found"}</p>
        <Link href="/admin" className="text-kivo-cyan text-sm">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-kivo-cyan mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All orders
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {order.customer_name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {formatDate(order.created_at)} · {formatInr(order.total)}
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <label className="text-xs text-gray-500">Fulfillment status</label>
          <select
            value={order.status}
            disabled={saving}
            onChange={(e) => updateStatus(e.target.value as OrderStatus)}
            className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-kivo-cyan min-w-[180px]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}

      <div className="grid lg:grid-cols-5 gap-4 sm:gap-5">
        <section className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-surface/80 p-5">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-kivo-cyan" />
              Items
            </h2>
            <ul className="space-y-3">
              {(order.order_items || []).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.brand} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">
                    {formatInr(item.unit_price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-1.5 text-sm border-t border-border pt-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatInr(order.subtotal)}</span>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between text-kivo-plus">
                  <span>Discount {order.promo_code ? `(${order.promo_code})` : ""}</span>
                  <span>-{formatInr(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between font-semibold text-base pt-1">
                <span>Total paid</span>
                <span className="text-kivo-cyan">{formatInr(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/80 p-5">
            <h2 className="font-semibold mb-3">Payment IDs</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-gray-500">Razorpay order</dt>
                <dd className="font-mono text-gray-300 break-all">
                  {order.razorpay_order_id}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Payment</dt>
                <dd className="font-mono text-gray-300 break-all">
                  {order.razorpay_payment_id}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-surface/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-kivo-cyan" />
                Ship to
              </h2>
              <button
                type="button"
                onClick={copyAddress}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-kivo-cyan"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-sm text-gray-300 mt-2 whitespace-pre-line">
              {order.address || "—"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {[order.city, order.state, order.pincode].filter(Boolean).join(", ") ||
                "—"}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <a
                href={`tel:${order.customer_phone}`}
                className="flex items-center gap-2 text-gray-300 hover:text-kivo-cyan"
              >
                <Phone className="h-4 w-4" />
                {order.customer_phone}
              </a>
              <a
                href={`mailto:${order.customer_email}`}
                className="flex items-center gap-2 text-gray-300 hover:text-kivo-cyan break-all"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {order.customer_email}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
