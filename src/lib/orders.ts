import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type { OrderRow, OrderStatus } from "@/lib/order-types";

export type { OrderRow, OrderStatus } from "@/lib/order-types";

export type OrderItemInput = {
  productId: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
};

export type CustomerInput = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

export type SaveOrderInput = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customer: CustomerInput;
  items: OrderItemInput[];
  total: number;
  subtotal?: number;
  discount?: number;
  promoCode?: string | null;
};

export async function saveVerifiedOrder(
  input: SaveOrderInput
): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured()) {
    console.warn(
      "[orders] Supabase not configured — order verified but not persisted"
    );
    return null;
  }

  const db = getSupabaseAdmin();
  const subtotal = input.subtotal ?? input.total;
  const discount = input.discount ?? 0;

  const { data: order, error } = await db
    .from("orders")
    .upsert(
      {
        razorpay_order_id: input.razorpayOrderId,
        razorpay_payment_id: input.razorpayPaymentId,
        status: "paid",
        customer_name: input.customer.name || "",
        customer_email: input.customer.email || "",
        customer_phone: input.customer.phone || "",
        address: input.customer.address || "",
        city: input.customer.city || "",
        state: input.customer.state || "",
        pincode: input.customer.pincode || "",
        subtotal,
        discount,
        total: input.total,
        promo_code: input.promoCode || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "razorpay_payment_id" }
    )
    .select("id")
    .single();

  if (error || !order) {
    console.error("[orders] Failed to save order:", error?.message);
    throw new Error(error?.message || "Failed to save order");
  }

  await db.from("order_items").delete().eq("order_id", order.id);

  const items = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    name: item.name,
    brand: item.brand,
    quantity: item.quantity,
    unit_price: item.price,
  }));

  if (items.length > 0) {
    const { error: itemsError } = await db.from("order_items").insert(items);
    if (itemsError) {
      console.error("[orders] Failed to save items:", itemsError.message);
      throw new Error(itemsError.message);
    }
  }

  return { id: order.id };
}

export async function listOrders(limit = 100): Promise<OrderRow[]> {
  const db = getSupabaseAdmin();
  const res = await db
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (res.error) {
    console.warn("[orders] select with order_items failed, trying orders only:", res.error.message);
    const fallback = await db
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (fallback.error) {
      throw new Error(fallback.error.message);
    }
    return (fallback.data || []).map((o) => ({ ...o, order_items: [] })) as OrderRow[];
  }
  return (res.data || []) as OrderRow[];
}

export async function getOrderById(id: string): Promise<OrderRow | null> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as OrderRow) || null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
