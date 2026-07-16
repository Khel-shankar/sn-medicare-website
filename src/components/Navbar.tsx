"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <>
      <header className="fixed top-9 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/kivo-header-logo.png"
              alt="KIVO — Engineered for Motion"
              width={280}
              height={120}
              sizes="180px"
              quality={90}
              className="h-12 w-auto sm:h-14 md:h-16"
              style={{ background: "transparent" }}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-kivo-cyan transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-surface-elevated transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-gray-300" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-kivo-cyan text-[10px] font-bold text-black">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            <Link
              href="/products"
              className="hidden sm:inline-flex btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-black"
            >
              Shop Now
            </Link>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface-elevated"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-gray-300 hover:bg-surface-elevated hover:text-kivo-cyan transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 btn-primary text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-black"
            >
              Shop Now
            </Link>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
