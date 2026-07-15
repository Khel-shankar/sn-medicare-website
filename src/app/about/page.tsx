import type { Metadata } from "next";
import Image from "next/image";
import { Stethoscope, Target, Award, Heart } from "lucide-react";
import { teamMembers } from "@/data/team";
import TeamAvatar from "@/components/TeamAvatar";

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
  const founder = teamMembers.find((m) => m.featured === "founder")!;
  const cofounder = teamMembers.find((m) => m.featured === "cofounder")!;
  const staff = teamMembers.filter((m) => m.featured === "team");

  return (
    <div className="pt-32 pb-20">
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
              S.N. Medicare was founded with a clear vision—to create
              kinesiology tape that delivers consistent performance in Indian
              conditions. While many international tapes lose adhesion in heat,
              humidity, and prolonged activity, we believed athletes,
              physiotherapists, and fitness enthusiasts deserved a product they
              could rely on.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Founder{" "}
              <span className="text-white font-medium">Satvik Nandwani</span>{" "}
              started S.N. Medicare with a commitment to developing medical-grade
              sports therapy products that combine quality, innovation, and
              affordability. His focus has always been to build products that
              support movement, recovery, and performance without compromising
              on comfort or durability.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              To ensure every product meets the practical needs of athletes and
              rehabilitation professionals, Satvik partnered with{" "}
              <span className="text-white font-medium">Abhinav Soni</span>,
              Co-Founder of S.N. Medicare and founder of PhysioKnowledge. With
              extensive experience in physiotherapy education and sports
              rehabilitation, Abhinav played a key role in product development,
              testing, and application, ensuring Kivo Pro performs in real
              clinical and athletic environments.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              The result is{" "}
              <span className="text-kivo-cyan font-medium">Kivo Pro</span>—a
              premium kinesiology tape featuring breathable cotton fabric,
              superior acrylic adhesive, and sweat-resistant performance that
              provides reliable support for up to 3–5 days.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Today, S.N. Medicare continues to work alongside physiotherapists,
              sports professionals, and athletes to develop innovative recovery
              solutions that help people move confidently and perform at their
              best.
            </p>
          </div>
          <div className="relative">
            <Image
              src="/images/about-clinic.webp"
              alt="Kivo Pro applied in a performance & recovery clinic"
              width={560}
              height={700}
              sizes="(max-width: 768px) 100vw, 560px"
              quality={75}
              className="rounded-2xl border border-border mx-auto object-cover w-full max-h-[640px]"
            />
          </div>
        </div>

        <section className="mb-16 p-6 sm:p-10 rounded-3xl bg-surface border border-border">
          <p className="text-kivo-cyan text-sm font-bold tracking-widest uppercase mb-6 text-center">
            Message from Founder
          </p>
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center max-w-4xl mx-auto">
            <TeamAvatar member={founder} size="lg" />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold">{founder.name}</h3>
              <p className="text-kivo-cyan text-sm font-medium mt-1">
                {founder.designation}
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                {founder.message}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-20 p-6 sm:p-10 rounded-3xl bg-surface border border-border">
          <p className="text-kivo-plus text-sm font-bold tracking-widest uppercase mb-6 text-center">
            Message from Co-Founder
          </p>
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center max-w-4xl mx-auto">
            <TeamAvatar member={cofounder} size="lg" />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold">{cofounder.name}</h3>
              <p className="text-kivo-plus text-sm font-medium mt-1">
                {cofounder.designation}
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                {cofounder.message}
              </p>
              <p className="text-gray-400 leading-relaxed mt-3 text-sm">
                Abhinav Soni is a physiotherapy educator and rehabilitation
                professional dedicated to advancing evidence-based recovery
                practices. As Co-Founder, he brings clinical expertise to product
                development, ensuring every Kivo Pro tape is designed to meet the
                demands of physiotherapists, sports professionals, and active
                individuals.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-3">
            Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">
            The people building Kivo — from product to sales to engineering
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {staff.map((member) => (
              <div
                key={member.name}
                className="p-6 rounded-2xl bg-surface border border-border text-center card-glow"
              >
                <TeamAvatar member={member} />
                <h3 className="font-semibold mt-4">{member.name}</h3>
                <p className="text-sm text-kivo-cyan mt-1">{member.designation}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="p-8 rounded-3xl bg-surface border border-border">
            <p className="text-kivo-cyan text-sm font-bold tracking-widest uppercase mb-3">
              Our Mission
            </p>
            <p className="text-gray-300 leading-relaxed">
              To empower movement through innovative, medical-grade sports
              therapy products that help athletes, physiotherapists, and active
              individuals recover faster, perform better, and move with
              confidence.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-surface border border-border">
            <p className="text-kivo-cyan text-sm font-bold tracking-widest uppercase mb-3">
              Our Vision
            </p>
            <p className="text-gray-300 leading-relaxed">
              To become India&apos;s most trusted sports therapy brand by
              delivering clinically inspired products that combine quality,
              innovation, and reliability.
            </p>
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
