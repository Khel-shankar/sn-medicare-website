"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      accentColor: product.accentColor,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block rounded-2xl bg-surface border border-border overflow-hidden card-glow transition-all duration-300 hover:border-kivo-cyan/40"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-black">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-black"
              style={{ backgroundColor: product.accentColor }}
            >
              {product.badge}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p
              className="text-xs font-bold tracking-wider uppercase mb-1"
              style={{ color: product.accentColor }}
            >
              {product.brand}
            </p>
            <p className="text-white font-semibold text-sm line-clamp-2">
              {product.name}
            </p>
          </div>
        </div>

        <div className="p-4">
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-gray-400 border border-border"
              >
                {f}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-kivo-cyan">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="p-2.5 rounded-lg bg-kivo-cyan/10 border border-kivo-cyan/30 text-kivo-cyan hover:bg-kivo-cyan hover:text-black transition-all"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              <span className="p-2.5 rounded-lg btn-primary text-black">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
