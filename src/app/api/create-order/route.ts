import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getProductById } from "@/data/products";
import { applyPromo } from "@/data/promos";

interface OrderItem {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items, customer, promoCode } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    let subtotal = 0;
    const validatedItems: {
      productId: string;
      name: string;
      brand: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of items as OrderItem[]) {
      const product = getProductById(item.productId);
      if (!product || !product.inStock) {
        return NextResponse.json(
          { error: `Invalid product: ${item.productId}` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      subtotal += product.price * qty;
      validatedItems.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        quantity: qty,
        price: product.price,
      });
    }

    const promoResult = applyPromo(subtotal, promoCode, validatedItems);
    if (promoCode && promoCode.trim() && !promoResult.valid) {
      return NextResponse.json(
        { error: promoResult.error || "Invalid promo code" },
        { status: 400 }
      );
    }

    const amount =
      promoCode && promoCode.trim() && promoResult.valid
        ? promoResult.finalTotal
        : subtotal;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `sn_medicare_${Date.now()}`,
      notes: {
        customer_name: customer?.name || "",
        customer_email: customer?.email || "",
        items: JSON.stringify(validatedItems),
        subtotal: String(subtotal),
        discount: String(promoResult.discount),
        promo: promoResult.promo?.code || "",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      key: keyId,
      subtotal,
      discount: promoResult.discount,
      finalTotal: amount,
      promoCode: promoResult.promo?.code || null,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
