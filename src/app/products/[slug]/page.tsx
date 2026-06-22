"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
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
} from "lucide-react";
import { getProductBySlug } from "@/data/products";
import { useCart } from "@/context/CartContext";

const featureIcons: Record<string, React.ElementType> = {
  "Water Resistant": Droplets,
  "Breathable & Comfortable": Wind,
  "Flexible & Elastic": Move,
  "Latex Free": Leaf,
  "Skin Friendly": Hand,
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!product) notFound();

  const handleAddToCart = () => {
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
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-kivo-cyan mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-border">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? "border-kivo-cyan"
                        : "border-border hover:border-gray-600"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
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

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-kivo-cyan">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-sm text-gray-500">/ {product.size}</span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-surface-elevated transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 py-3 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
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
                Add to Cart — ₹{product.price * quantity}
              </button>
            </div>

            {/* Features */}
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

        {/* Benefits */}
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

        {/* Applications */}
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

        {/* Composition */}
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

        {/* Instructions & Precautions */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <h3 className="font-semibold text-lg mb-4 text-kivo-cyan">
              How to Use
            </h3>
            <ul className="space-y-2">
              {product.instructions.map((inst) => (
                <li
                  key={inst}
                  className="flex gap-2 text-sm text-gray-400"
                >
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
                <li
                  key={prec}
                  className="flex gap-2 text-sm text-gray-400"
                >
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
