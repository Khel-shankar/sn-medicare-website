export type PromoType = "percent" | "flat" | "by_brand";

export interface PromoCode {
  code: string;
  type: PromoType;
  /** Used for percent/flat global discounts */
  value?: number;
  /** Brand-specific percent discounts (by_brand) */
  brandPercents?: Partial<{
    "Kivo Pro": number;
    "Kivo Plus": number;
  }>;
  description: string;
  minOrder?: number;
}

export interface PromoCartItem {
  productId: string;
  brand?: string;
  price: number;
  quantity: number;
}

/** Server + client shared promo definitions */
export const promoCodes: PromoCode[] = [
  {
    code: "KIVO50",
    type: "by_brand",
    brandPercents: {
      "Kivo Pro": 50,
    },
    description: "50% off Kivo Pro",
  },
  {
    code: "KIVO40",
    type: "by_brand",
    brandPercents: {
      "Kivo Plus": 40,
    },
    description: "40% off Kivo Plus",
  },
];

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function findPromo(code: string): PromoCode | undefined {
  const normalized = normalizePromoCode(code);
  return promoCodes.find((p) => p.code === normalized);
}

function brandOf(item: PromoCartItem): "Kivo Pro" | "Kivo Plus" | null {
  const brand = (item.brand || "").trim();
  if (brand === "Kivo Pro" || brand.toLowerCase() === "kivo pro") return "Kivo Pro";
  if (brand === "Kivo Plus" || brand.toLowerCase() === "kivo plus") return "Kivo Plus";

  const id = (item.productId || "").toLowerCase();
  // check plus before pro (ids are kivo-plus / kivo-pro)
  if (id.includes("plus")) return "Kivo Plus";
  if (id.includes("pro")) return "Kivo Pro";
  return null;
}

export function applyPromo(
  subtotal: number,
  code?: string | null,
  items?: PromoCartItem[]
): {
  valid: boolean;
  discount: number;
  finalTotal: number;
  promo?: PromoCode;
  error?: string;
} {
  if (!code || !code.trim()) {
    return { valid: false, discount: 0, finalTotal: subtotal };
  }

  const promo = findPromo(code);
  if (!promo) {
    return {
      valid: false,
      discount: 0,
      finalTotal: subtotal,
      error: "Invalid promo code",
    };
  }

  if (promo.minOrder && subtotal < promo.minOrder) {
    return {
      valid: false,
      discount: 0,
      finalTotal: subtotal,
      promo,
      error: `Minimum order ₹${promo.minOrder} required for this code`,
    };
  }

  let discount = 0;

  if (promo.type === "by_brand") {
    if (!items || items.length === 0) {
      return {
        valid: false,
        discount: 0,
        finalTotal: subtotal,
        promo,
        error: "Add items to cart to apply this promo",
      };
    }

    const rates = promo.brandPercents || {};
    for (const item of items) {
      const brand = brandOf(item);
      const line = item.price * item.quantity;
      if (brand && rates[brand] != null) {
        discount += Math.round((line * rates[brand]!) / 100);
      }
    }

    if (discount < 1) {
      const brands = Object.keys(rates).join(" / ");
      return {
        valid: false,
        discount: 0,
        finalTotal: subtotal,
        promo,
        error: `Code ${promo.code} only works on ${brands}`,
      };
    }
  } else if (promo.type === "percent") {
    discount = Math.round((subtotal * (promo.value || 0)) / 100);
  } else {
    discount = Math.min(promo.value || 0, subtotal);
  }

  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    discount,
    finalTotal: Math.max(1, subtotal - discount),
    promo,
  };
}
