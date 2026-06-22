export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: "Kivo Pro" | "Kivo Plus";
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  size: string;
  images: string[];
  accentColor: string;
  badge?: string;
  features: string[];
  applications: string[];
  benefits: { title: string; description: string }[];
  composition: { label: string; percentage: number }[];
  precautions: string[];
  instructions: string[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "kivo-pro",
    slug: "kivo-pro",
    name: "Kivo Pro Sweatproof Kinesiology Tape",
    brand: "Kivo Pro",
    tagline: "Engineered for Motion",
    description:
      "Premium sweatproof kinesiology tape built for Indian athletes. Designed by physiotherapists for maximum adhesion through sweat, water & intense motion.",
    longDescription:
      "Kivo Pro is our flagship sweatproof kinesiology tape — engineered specifically for Indian climate and athletic demands. With superior acrylic adhesive and 97% cotton fabric, it stays strong through every workout, match, and training session. Trusted by athletes, recommended by physiotherapists.",
    price: 599,
    originalPrice: 749,
    size: "5cm × 5m Roll",
    images: [
      "/images/kivo-pro-hero.png",
      "/images/kivo-pro-flyer.png",
      "/images/kivo-pro-specs.png",
    ],
    accentColor: "#00b4f5",
    badge: "Bestseller",
    features: [
      "Water Resistant",
      "Breathable & Comfortable",
      "Flexible & Elastic",
      "Latex Free",
      "Skin Friendly",
      "Sweatproof Adhesion",
    ],
    applications: [
      "Shoulder Support",
      "Knee Stability",
      "Back Support",
      "Ankle Protection",
      "Wrist Support",
    ],
    benefits: [
      {
        title: "Sweatproof",
        description: "Stays strong through every workout in Indian heat & humidity",
      },
      {
        title: "Strong Adhesion",
        description: "Built to last through sweat, water & motion for 3–5 days",
      },
      {
        title: "Muscle Support",
        description: "Enhances performance, reduces fatigue & risk of injury",
      },
      {
        title: "Pain Relief",
        description: "Supports joints, improves stability & aids recovery",
      },
    ],
    composition: [
      { label: "Cotton Fabric", percentage: 97 },
      { label: "Elastane (Spandex)", percentage: 3 },
      { label: "Acrylic Adhesive", percentage: 100 },
    ],
    precautions: [
      "Do not apply on broken, irritated, or infected skin",
      "Discontinue use if redness, rash, or itching occurs",
      "Keep out of reach of children",
      "For external use only. Single-use only",
      "Store below 30°C away from direct sunlight",
    ],
    instructions: [
      "Consult a kinesiology taping expert for correct application",
      "Ensure skin is clean, dry and oil-free for better adhesion",
      "Slowly remove tape in the direction of hair growth",
      "Do not stretch the tape anchor when applying to skin",
      "Avoid lotions, oils or creams before use",
      "Store in a cool, dry place away from heat and sunlight",
    ],
    inStock: true,
  },
  {
    id: "kivo-plus",
    slug: "kivo-plus",
    name: "Kivo Plus Kinesiology Tape",
    brand: "Kivo Plus",
    tagline: "Everyday Support, Pro Results",
    description:
      "Reliable kinesiology tape for everyday fitness, rehab & recovery. Skin-friendly, breathable and designed for comfortable all-day wear.",
    longDescription:
      "Kivo Plus delivers professional-grade kinesiology taping at an accessible price. Perfect for fitness enthusiasts, rehab patients, and everyday support needs. Latex-free, breathable cotton tape that moves with your body while providing reliable muscle and joint support.",
    price: 449,
    originalPrice: 549,
    size: "5cm × 5m Roll",
    images: [
      "/images/kivo-pro-hero.png",
      "/images/kivo-pro-flyer.png",
    ],
    accentColor: "#00d4aa",
    badge: "Value Pick",
    features: [
      "Water Resistant",
      "Breathable & Comfortable",
      "Flexible & Elastic",
      "Latex Free",
      "Skin Friendly",
      "All-Day Comfort",
    ],
    applications: [
      "Shoulder Support",
      "Knee Stability",
      "Back Support",
      "Ankle Protection",
      "Wrist Support",
    ],
    benefits: [
      {
        title: "Everyday Support",
        description: "Ideal for gym, yoga, running & daily activities",
      },
      {
        title: "Skin Safe",
        description: "Hypoallergenic adhesive gentle on sensitive skin",
      },
      {
        title: "Easy Application",
        description: "Pre-cut friendly roll for quick self-application",
      },
      {
        title: "Rehab Ready",
        description: "Supports recovery from strains, sprains & overuse",
      },
    ],
    composition: [
      { label: "Cotton Fabric", percentage: 95 },
      { label: "Elastane (Spandex)", percentage: 5 },
      { label: "Acrylic Adhesive", percentage: 100 },
    ],
    precautions: [
      "Do not apply on broken, irritated, or infected skin",
      "Discontinue use if redness, rash, or itching occurs",
      "Keep out of reach of children",
      "For external use only. Single-use only",
      "Store below 30°C away from direct sunlight",
    ],
    instructions: [
      "Ensure skin is clean, dry and oil-free",
      "Apply with 10–15% stretch on muscle, no stretch on anchors",
      "Round the corners of tape for better adhesion",
      "Remove slowly in direction of hair growth",
      "Store in a cool, dry place",
    ],
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
