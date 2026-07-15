export interface TeamMember {
  name: string;
  role: string;
  designation: string;
  message?: string;
  image?: string;
  initials: string;
  featured?: "founder" | "cofounder" | "team";
}

export const teamMembers: TeamMember[] = [
  {
    name: "Satvik Nandwani",
    role: "Founder",
    designation: "Founder | S.N. Medicare",
    featured: "founder",
    initials: "SN",
    image: "/images/team/satvik-nandwani.jpg",
    message:
      "I founded S.N. Medicare with one belief — Indian athletes deserve medical-grade sports therapy products that actually perform in our climate. Every Kivo product is built so you can train harder, recover smarter, and move with confidence.",
  },
  {
    name: "Abhinav Soni",
    role: "Co-Founder",
    designation: "Co-Founder | Founder, PhysioKnowledge",
    featured: "cofounder",
    initials: "AS",
    image: "/images/team/abhinav-soni.jpg",
    message:
      "As a physiotherapy educator, I focus on evidence-based recovery. Kivo Pro was shaped through real clinical testing and athletic use — so physiotherapists and athletes get tape they can trust in practice, not just on paper.",
  },
  {
    name: "Lakshya Rankawat",
    role: "Sales Manager",
    designation: "Sales Manager",
    featured: "team",
    initials: "LR",
    image: "/images/team/lakshya-rankawat.jpg",
  },
  {
    name: "Naitik",
    role: "Product Manager",
    designation: "Product Manager",
    featured: "team",
    initials: "N",
    image: "/images/team/naitik-nandwani.jpg",
  },
  {
    name: "Khel Shankar Vyas",
    role: "Developer",
    designation: "Developer",
    featured: "team",
    initials: "KV",
    image: "/images/team/khel-shankar-vyas.jpg",
  },
];

export const contactInfo = {
  email: "info@snmedicare.in",
  phones: [
    { label: "Satvik Nandwani", number: "+91 70149 49153", tel: "+917014949153" },
    { label: "Abhinav Soni", number: "+91 86196 37298", tel: "+918619637298" },
  ],
  whatsapp: {
    number: "+91 72970 49153",
    link: "https://wa.me/917297049153",
  },
  instagram: {
    handle: "@kivo1.1",
    link: "https://www.instagram.com/kivo1.1?igsh=MWVpbzNqNGxwZ2w4bQ==",
  },
};
