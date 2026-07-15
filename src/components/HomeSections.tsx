"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Droplets,
  Wind,
  Move,
  Leaf,
  Hand,
  Dumbbell,
  Shield,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: Droplets, label: "Water Resistant" },
  { icon: Wind, label: "Breathable" },
  { icon: Move, label: "Flexible & Elastic" },
  { icon: Leaf, label: "Latex Free" },
  { icon: Hand, label: "Skin Friendly" },
  { icon: Dumbbell, label: "Muscle Support" },
];

const applications = [
  "Shoulder Support",
  "Knee Stability",
  "Back Support",
  "Ankle Protection",
  "Wrist Support",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 overflow-hidden">
      <div className="hero-glow absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-kivo-cyan/15 via-background to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-kivo-cyan/30 bg-kivo-cyan/5 text-kivo-cyan text-xs font-medium mb-6">
              <Stethoscope className="w-3.5 h-3.5" />
              Designed by Physiotherapists
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="text-white">SWEATPROOF</span>
              <br />
              <span className="gradient-text">KINESIOLOGY TAPE</span>
            </h1>

            <div className="mt-4 inline-block px-4 py-2 bg-white/10 rounded-lg border border-white/20">
              <span className="text-sm font-bold">
                BUILT FOR{" "}
                <span className="gradient-text-indian">INDIAN ATHLETES</span>
              </span>
            </div>

            <p className="mt-6 text-gray-400 text-lg leading-relaxed max-w-lg">
              Medical-grade sports therapy tape that stays strong through sweat,
              water & intense motion. Trusted by athletes, recommended by
              physiotherapists.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-black"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products/kivo-pro"
                className="btn-outline inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-gray-300"
              >
                Explore Kivo Pro
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-kivo-cyan" />
                <span className="text-sm text-gray-400">CE Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-kivo-plus" />
                <span className="text-sm text-gray-400">Latex Free</span>
              </div>
              <span className="text-sm text-kivo-cyan font-semibold">
                5cm × 5m Roll
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative animate-float">
              <div className="absolute -inset-4 rounded-3xl bg-kivo-cyan/10 blur-3xl animate-pulse-glow" />
              <Image
                src="/images/kivo-pro-hero.webp"
                alt="Kivo Pro Kinesiology Tape"
                width={600}
                height={540}
                sizes="(max-width: 1024px) 0px, 600px"
                quality={78}
                className="relative w-full h-auto rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesBar() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-2 group"
            >
              <div className="p-3 rounded-full border border-kivo-cyan/20 bg-kivo-cyan/5 group-hover:bg-kivo-cyan/15 transition-colors">
                <f.icon className="w-5 h-5 text-kivo-cyan" />
              </div>
              <span className="text-xs font-medium text-gray-300">
                {f.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApplicationsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ideal <span className="gradient-text">For</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Professional support for every joint and muscle group
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {applications.map((app, i) => (
            <motion.div
              key={app}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-surface border border-border text-center hover:border-kivo-cyan/40 transition-all card-glow"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-kivo-cyan/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-kivo-cyan" />
              </div>
              <p className="text-sm font-semibold text-gray-200">{app}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  const reasons = [
    {
      title: "Sweatproof Formula",
      desc: "Engineered for Indian climate — stays adhesive through heat, humidity & intense workouts",
    },
    {
      title: "Physio Designed",
      desc: "Developed with physiotherapists for optimal muscle support & injury prevention",
    },
    {
      title: "Medical Grade",
      desc: "97% cotton, latex-free, skin-friendly adhesive safe for sensitive skin",
    },
    {
      title: "3–5 Day Wear",
      desc: "Strong adhesion that lasts through sweat, water & daily motion",
    },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Why <span className="gradient-text">S.N. Medicare</span>?
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              We&apos;re not just another tape brand. Our moat is sweatproof
              kinesiology tape built specifically for Indian athletes — designed
              by physiotherapists who understand the demands of training in
              tropical conditions.
            </p>
            <div className="space-y-4">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl border border-border hover:border-kivo-cyan/30 transition-colors"
                >
                  <div className="w-1 rounded-full bg-kivo-cyan flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">{r.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Image
              src="/images/kivo-pro-flyer.webp"
              alt="Kivo Pro Features"
              width={450}
              height={980}
              sizes="(max-width: 768px) 90vw, 450px"
              quality={78}
              className="rounded-2xl border border-border shadow-2xl mx-auto w-full max-w-[450px] h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-kivo-cyan/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-kivo-cyan/20 via-surface to-background" />
          <div className="relative px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Move <span className="gradient-text">Better</span>?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Join thousands of Indian athletes who trust Kivo Pro & Kivo Plus
              for sweatproof support. Order directly from our store.
            </p>
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-black text-lg"
            >
              Shop All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
