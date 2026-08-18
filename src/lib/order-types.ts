export type OrderStatus =
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItemRow = {
  id: string;
  product_id: string;
  name: string;
  brand: string;
  quantity: number;
  unit_price: number;
};

export type OrderRow = {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  discount: number;
  total: number;
  promo_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItemRow[];
};
