import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products | S.N. Medicare — Kivo Pro & Kivo Plus",
  description:
    "Shop sweatproof kinesiology tape — Kivo Pro & Kivo Plus. 5cm x 5m rolls, latex free, designed for Indian athletes.",
};

export default function ProductsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Our <span className="gradient-text">Products</span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Medical-grade kinesiology tape engineered for Indian athletes.
            Sweatproof, breathable, and designed by physiotherapists.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-surface border border-border text-center max-w-3xl mx-auto">
          <p className="text-gray-400 text-sm">
            More products coming soon! S.N. Medicare is expanding its range of
            medical-grade sports therapy products. Stay tuned.
          </p>
        </div>
      </div>
    </div>
  );
}
