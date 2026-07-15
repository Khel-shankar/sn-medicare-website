"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-20 h-20 text-gray-600 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">
          Add some products to get started
        </p>
        <Link
          href="/products"
          className="btn-primary px-8 py-3 rounded-xl font-semibold text-black"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">
          Shopping <span className="gradient-text">Cart</span>
        </h1>
        <p className="text-gray-400 mb-8">{totalItems} item(s)</p>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 sm:p-6 rounded-2xl bg-surface border border-border"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-black"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="128px"
                  quality={65}
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium"
                  style={{ color: item.accentColor }}
                >
                  {item.brand}
                </p>
                <Link
                  href={`/products/${item.slug}`}
                  className="font-semibold hover:text-kivo-cyan transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-kivo-cyan font-bold text-lg mt-1">
                  ₹{item.price}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-surface-elevated disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-2 hover:bg-surface-elevated"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-bold text-lg">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-surface border border-border">
          <div className="flex justify-between items-center text-xl font-bold mb-6">
            <span>Order Total</span>
            <span className="text-kivo-cyan text-2xl">₹{totalPrice}</span>
          </div>
          <Link
            href="/checkout"
            className="btn-primary flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-black text-lg"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
