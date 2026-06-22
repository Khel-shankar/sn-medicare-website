import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "S.N. Medicare | Kivo Pro & Kivo Plus — Sweatproof Kinesiology Tape",
  description:
    "Premium sweatproof kinesiology tape built for Indian athletes. Designed by physiotherapists. Shop Kivo Pro & Kivo Plus — water resistant, latex free, 5cm x 5m roll.",
  keywords: [
    "kinesiology tape",
    "Kivo Pro",
    "Kivo Plus",
    "S.N. Medicare",
    "sweatproof tape",
    "Indian athletes",
    "physiotherapy tape",
    "sports tape India",
  ],
  openGraph: {
    title: "S.N. Medicare | Sweatproof Kinesiology Tape for Indian Athletes",
    description:
      "Medical grade sports therapy. Kivo Pro & Kivo Plus — engineered for motion.",
    images: ["/images/kivo-pro-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
