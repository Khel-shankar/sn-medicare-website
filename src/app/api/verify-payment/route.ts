import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { saveVerifiedOrder } from "@/lib/orders";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      totalPrice,
      promoCode,
      discount,
      subtotal,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const orderItems = Array.isArray(items)
      ? items.map(
          (item: {
            productId?: string;
            id?: string;
            name?: string;
            brand?: string;
            quantity?: number;
            price?: number;
          }) => ({
            productId: String(item.productId || item.id || ""),
            name: String(item.name || "Product"),
            brand: String(item.brand || ""),
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
          })
        )
      : [];

    let savedId: string | null = null;
    try {
      const saved = await saveVerifiedOrder({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        customer: {
          name: customer?.name || "",
          email: customer?.email || "",
          phone: customer?.phone || "",
          address: customer?.address || "",
          city: customer?.city || "",
          state: customer?.state || "",
          pincode: customer?.pincode || "",
        },
        items: orderItems,
        total: Number(totalPrice) || 0,
        subtotal: Number(subtotal) || Number(totalPrice) || 0,
        discount: Number(discount) || 0,
        promoCode: promoCode || null,
      });
      savedId = saved?.id ?? null;
    } catch (persistError) {
      // Payment is already valid — don't fail the customer checkout
      console.error("Order persist error:", persistError);
    }

    console.log("✅ Order verified:", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      savedId,
      customer,
      totalPrice,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      savedId,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
