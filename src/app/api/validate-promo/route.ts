import { NextRequest, NextResponse } from "next/server";
import { applyPromo, type PromoCartItem } from "@/data/promos";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal, items } = await req.json();
    const amount = Number(subtotal) || 0;
    const cartItems = (items || []) as PromoCartItem[];
    const result = applyPromo(amount, code, cartItems);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error || "Invalid promo code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: result.promo?.code,
      description: result.promo?.description,
      discount: result.discount,
      finalTotal: result.finalTotal,
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Failed to validate promo" },
      { status: 500 }
    );
  }
}
