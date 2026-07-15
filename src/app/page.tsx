import HeroSection, {
  FeaturesBar,
  ApplicationsSection,
  WhyChooseSection,
  CTASection,
} from "@/components/HomeSections";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Our <span className="gradient-text">Products</span>
            </h2>
            <p className="mt-3 text-gray-400 max-w-xl mx-auto">
              Professional kinesiology tape for every athlete and fitness level
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
      <ApplicationsSection />
      <WhyChooseSection />
      <CTASection />
    </>
  );
}
