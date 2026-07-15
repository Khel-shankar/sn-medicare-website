"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Check,
  ChevronLeft,
  Droplets,
  Wind,
  Move,
  Leaf,
  Hand,
  Minus,
  Plus,
  Play,
  Tag,
} from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const PROMO_STORAGE_KEY = "sn-medicare-promo";

const featureIcons: Record<string, React.ElementType> = {
  "Water Resistant": Droplets,
  "Breathable & Comfortable": Wind,
  "Flexible & Elastic": Move,
  "Latex Free": Leaf,
  "Skin Friendly": Hand,
  "Sweatproof Adhesion": Droplets,
  "All-Day Comfort": Hand,
  "Strong Adhesion": Check,
};

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [promoInput, setPromoInput] = useState(
    product.brand === "Kivo Plus" ? "KIVO40" : "KIVO50"
  );
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    discount: number;
    description?: string;
  } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const { addItem } = useCart();

  const media = useMemo<MediaItem[]>(
    () => [
      ...product.images.map((src) => ({ type: "image" as const, src })),
      ...(product.videos ?? []).map((src) => ({ type: "video" as const, src })),
    ],
    [product]
  );

  const lineTotal = product.price * quantity;
  const displayTotal = promoApplied
    ? Math.max(1, lineTotal - promoApplied.discount)
    : lineTotal;
  const active = media[selectedMedia] ?? media[0];

  const applyPromo = async () => {
    setPromoError("");
    setPromoLoading(true);
    try {
      const res = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoInput,
          subtotal: product.price * quantity,
          items: [
            {
              productId: product.id,
              brand: product.brand,
              price: product.price,
              quantity,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setPromoApplied(null);
        setPromoError(data.error || "Invalid promo code");
      } else {
        const applied = {
          code: data.code as string,
          discount: data.discount as number,
          description: data.description as string | undefined,
        };
        setPromoApplied(applied);
        try {
          localStorage.setItem(PROMO_STORAGE_KEY, applied.code);
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

  const handleAddToCart = () => {
    if (promoApplied?.code) {
      try {
        localStorage.setItem(PROMO_STORAGE_KEY, promoApplied.code);
      } catch {
        /* ignore */
      }
    }
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.images[0],
        accentColor: product.accentColor,
      },
      quantity
    );
  };

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-kivo-cyan mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-border">
              {active?.type === "video" ? (
                <video
                  key={active.src}
                  src={active.src}
                  controls
                  playsInline
                  autoPlay
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                />
              ) : (
                <Image
                  src={active.src}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              )}
            </div>

            <div className="flex gap-3 mt-4 flex-wrap">
              {media.map((item, i) => (
                <button
                  key={`${item.type}-${item.src}`}
                  onClick={() => setSelectedMedia(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors bg-black ${
                    selectedMedia === i
                      ? "border-kivo-cyan"
                      : "border-border hover:border-gray-600"
                  }`}
                  aria-label={
                    item.type === "video" ? "Play product video" : "View image"
                  }
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <video
                        src={item.src}
                        muted
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/45">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {product.images.length} photos
              {product.videos?.length
                ? ` · ${product.videos.length} video${product.videos.length > 1 ? "s" : ""}`
                : ""}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {product.badge && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-black mb-3"
                style={{ backgroundColor: product.accentColor }}
              >
                {product.badge}
              </span>
            )}
            <p
              className="text-sm font-bold tracking-wider uppercase"
              style={{ color: product.accentColor }}
            >
              {product.brand} — {product.tagline}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              {product.name}
            </h1>
            <p className="mt-4 text-gray-400 leading-relaxed">
              {product.longDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-kivo-cyan">
                ₹{displayTotal}
              </span>
              {(promoApplied || product.originalPrice) && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{(product.originalPrice || product.price) * quantity}
                </span>
              )}
              {promoApplied && (
                <span className="text-sm text-kivo-plus font-medium">
                  After promo
                </span>
              )}
              <span className="text-sm text-gray-500">/ {product.size}</span>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Tag className="w-4 h-4 text-kivo-cyan" />
                Apply promo code before adding to cart
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Enter code e.g. KIVO50"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:border-kivo-cyan focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={promoLoading || !promoInput.trim()}
                  className="px-4 py-2.5 rounded-lg border border-kivo-cyan/40 text-kivo-cyan text-sm font-medium hover:bg-kivo-cyan/10 disabled:opacity-50"
                >
                  {promoLoading ? "..." : "Apply"}
                </button>
              </div>
              {promoError && (
                <p className="text-xs text-red-400">{promoError}</p>
              )}
              {promoApplied ? (
                <p className="text-xs text-kivo-plus">
                  {promoApplied.code} applied — {promoApplied.description} (−₹
                  {promoApplied.discount})
                </p>
              ) : (
                <p className="text-[11px] text-gray-500">
                  Tip: use{" "}
                  <span className="text-kivo-cyan font-semibold">
                    {product.brand === "Kivo Pro" ? "KIVO50" : "KIVO40"}
                  </span>{" "}
                  for {product.brand === "Kivo Pro" ? "50%" : "40%"} off this
                  product
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => {
                    setQuantity(Math.max(1, quantity - 1));
                    setPromoApplied(null);
                  }}
                  className="p-3 hover:bg-surface-elevated transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 py-3 font-semibold">{quantity}</span>
                <button
                  onClick={() => {
                    setQuantity(quantity + 1);
                    setPromoApplied(null);
                  }}
                  className="p-3 hover:bg-surface-elevated transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-black"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ₹{displayTotal}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.features.map((f) => {
                const Icon = featureIcons[f] || Check;
                return (
                  <div
                    key={f}
                    className="flex items-center gap-2 p-3 rounded-xl bg-surface border border-border text-sm"
                  >
                    <Icon className="w-4 h-4 text-kivo-cyan flex-shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-6">
            Full <span className="gradient-text">Gallery</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => {
                  setSelectedMedia(i);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-black group"
              >
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>

          {product.videos && product.videos.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">Videos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {product.videos.map((src, i) => (
                  <video
                    key={src}
                    src={src}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full rounded-2xl border border-border bg-black aspect-video object-contain"
                    onPlay={() => setSelectedMedia(product.images.length + i)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-8">
            Key <span className="gradient-text">Benefits</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-surface border border-border card-glow"
              >
                <h3 className="font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-gray-400">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Ideal <span className="gradient-text">For</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {product.applications.map((app) => (
              <span
                key={app}
                className="px-4 py-2 rounded-full bg-kivo-cyan/10 border border-kivo-cyan/20 text-sm text-kivo-cyan"
              >
                {app}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Composition</h2>
          <div className="space-y-4 max-w-lg">
            {product.composition.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{c.label}</span>
                  <span className="text-kivo-cyan font-medium">
                    {c.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-kivo-cyan to-kivo-cyan-dark transition-all duration-700"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <h3 className="font-semibold text-lg mb-4 text-kivo-cyan">
              How to Use
            </h3>
            <ul className="space-y-2">
              {product.instructions.map((inst) => (
                <li key={inst} className="flex gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-kivo-cyan flex-shrink-0 mt-0.5" />
                  {inst}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <h3 className="font-semibold text-lg mb-4 text-kivo-orange">
              Precautions
            </h3>
            <ul className="space-y-2">
              {product.precautions.map((prec) => (
                <li key={prec} className="flex gap-2 text-sm text-gray-400">
                  <span className="text-kivo-orange">•</span>
                  {prec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
