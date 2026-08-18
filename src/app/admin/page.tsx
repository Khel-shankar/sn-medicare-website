"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  IndianRupee,
  Loader2,
  LogOut,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { OrderRow, OrderStatus } from "@/lib/order-types";
import { formatInr } from "@/lib/format";

const STATUS_STYLES: Record<OrderStatus, string> = {
  paid: "bg-kivo-cyan/15 text-kivo-cyan border-kivo-cyan/30",
  processing: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  shipped: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  delivered: "bg-kivo-plus/15 text-kivo-plus border-kivo-plus/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load orders");
        setOrders([]);
        return;
      }
      setOrders(data.orders || []);
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.city,
        o.razorpay_order_id,
        o.razorpay_payment_id,
        o.promo_code || "",
        ...(o.order_items || []).map((i) => i.name),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [orders, query, statusFilter]);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const paid = orders.filter((o) => o.status === "paid").length;
    const shipping = orders.filter(
      (o) => o.status === "processing" || o.status === "shipped"
    ).length;
    return {
      totalOrders: orders.length,
      revenue,
      paid,
      shipping,
    };
  }, [orders]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-kivo-cyan mb-2">
            S.N. Medicare
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold">Order dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Live view of every paid checkout on the store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadOrders()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm hover:border-kivo-cyan/50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-gray-300 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          {
            label: "Orders",
            value: String(stats.totalOrders),
            icon: ShoppingBag,
          },
          {
            label: "Revenue",
            value: formatInr(stats.revenue),
            icon: IndianRupee,
          },
          {
            label: "New / paid",
            value: String(stats.paid),
            icon: Package,
          },
          {
            label: "In transit",
            value: String(stats.shipping),
            icon: Truck,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-surface/80 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">{card.label}</p>
              <card.icon className="h-4 w-4 text-kivo-cyan" />
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tight">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-surface/70 overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 border-b border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, city, payment id…"
              className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:border-kivo-cyan"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | OrderStatus)
            }
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-kivo-cyan"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-gray-400 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading orders…
          </div>
        ) : error ? (
          <div className="px-5 py-16 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Agar Supabase setup pending hai, pehle schema SQL chalao aur env
              vars add karo — phir refresh.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-gray-400 text-sm">
            No orders yet. Jab koi customer payment complete karega, yahan dikhega.
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-4 hover:bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold">{order.customer_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {order.customer_phone}
                    {order.city ? ` · ${order.city}` : ""}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {(order.order_items || [])
                        .map((i) => `${i.name} ×${i.quantity}`)
                        .join(", ") || "—"}
                    </p>
                    <p className="font-semibold text-kivo-cyan">
                      {formatInr(order.total)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-border">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Items</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border/70 hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4 align-top">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.customer_phone}
                        </p>
                        <p className="text-xs text-gray-500">
                          {[order.city, order.state].filter(Boolean).join(", ") ||
                            "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4 align-top text-gray-300 max-w-xs">
                        {(order.order_items || [])
                          .map((i) => `${i.brand || i.name} ×${i.quantity}`)
                          .join(", ") || "—"}
                      </td>
                      <td className="px-5 py-4 align-top font-semibold text-kivo-cyan whitespace-nowrap">
                        {formatInr(order.total)}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide ${STATUS_STYLES[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top text-gray-400 whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-kivo-cyan"
                        >
                          Open
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
