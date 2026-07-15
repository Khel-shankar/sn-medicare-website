"use client";

import Link from "next/link";
import { Tag } from "lucide-react";

const messages = [
  "Get 50% OFF on Kivo Pro with promo code KIVO50",
  "Get 40% OFF on Kivo Plus with promo code KIVO40",
  "Limited offer — use KIVO50 or KIVO40 at checkout",
  "Shop now & save big on kinesiology tape",
];

export default function PromoStrip() {
  const loop = [...messages, ...messages, ...messages];

  return (
    <Link
      href="/products"
      className="fixed top-0 left-0 right-0 z-[60] block h-9 overflow-hidden bg-gradient-to-r from-kivo-cyan via-[#00d4ff] to-kivo-plus text-black hover:brightness-110 transition-[filter]"
      aria-label="Shop with promo codes KIVO50 and KIVO40"
    >
      <div className="promo-marquee flex h-full w-max items-center gap-10 whitespace-nowrap text-xs sm:text-sm font-bold tracking-wide">
        {loop.map((msg, i) => (
          <span key={`${msg}-${i}`} className="inline-flex items-center gap-2 px-2">
            <Tag className="h-3.5 w-3.5 shrink-0" />
            {msg}
            <span className="opacity-60">•</span>
            <span className="underline underline-offset-2">Shop Now</span>
          </span>
        ))}
      </div>
    </Link>
  );
}
