import type { Metadata } from "next";
import Image from "next/image";
import { Stethoscope, Target, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | S.N. Medicare",
  description:
    "Learn about S.N. Medicare — medical grade sports therapy products designed by physiotherapists for Indian athletes.",
};

const values = [
  {
    icon: Stethoscope,
    title: "Physio Designed",
    desc: "Every product is developed in collaboration with licensed physiotherapists who understand athletic demands.",
  },
  {
    icon: Target,
    title: "Built for India",
    desc: "Our sweatproof formula is engineered specifically for Indian climate — heat, humidity, and intense training.",
  },
  {
    icon: Award,
    title: "Medical Grade",
    desc: "CE certified, latex-free, skin-friendly materials that meet international quality standards.",
  },
  {
    icon: Heart,
    title: "Athlete First",
    desc: "We exist to help Indian athletes perform better, recover faster, and stay injury-free.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold">
            About <span className="gradient-text">S.N. Medicare</span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Medical grade sports therapy — engineered for motion
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              S.N. Medicare was founded with a simple mission: provide Indian
              athletes with kinesiology tape that actually works in our climate.
              Generic international tapes fail in Indian heat and humidity —
              peeling off mid-workout, losing adhesion during matches, and
              letting athletes down when they need support most.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Working closely with physiotherapists, we developed{" "}
              <span className="text-kivo-cyan font-medium">Kivo Pro</span> —
              our flagship sweatproof kinesiology tape with superior acrylic
              adhesive that stays strong through sweat, water, and intense
              motion for 3–5 days.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Founded by <span className="text-white font-medium">Satvik Nandwani</span>, S.N. Medicare
              continues to expand its range of medical-grade sports therapy products
              for the Indian market.
            </p>
          </div>
          <div className="relative">
            <Image
              src="/images/kivo-pro-specs.png"
              alt="Kivo Pro Product Details"
              width={500}
              height={600}
              className="rounded-2xl border border-border mx-auto"
            />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-10">
            Our <span className="gradient-text">Values</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 rounded-2xl bg-surface border border-border text-center card-glow"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-kivo-cyan/10 flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-kivo-cyan" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-gray-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border text-center">
          <p className="text-kivo-cyan text-sm font-bold tracking-widest uppercase mb-3">
            Our Moat
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Sweatproof Tape Built for{" "}
            <span className="gradient-text-indian">Indian Athletes</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Designed by physiotherapists. Trusted by athletes. Recommended for
            shoulder support, knee stability, back support, ankle protection,
            and wrist support.
          </p>
        </div>
      </div>
    </div>
  );
}
