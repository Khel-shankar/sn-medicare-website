import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { contactInfo } from "@/data/team";
import { WhatsAppIcon, InstagramIcon } from "@/components/SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Image
              src="/images/kivo-pro-logo.png"
              alt="Kivo — Engineered for Motion"
              width={180}
              height={60}
              sizes="180px"
              quality={85}
              className="h-14 w-auto mb-4 object-contain"
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              S.N. Medicare — Medical grade sports therapy products designed by
              physiotherapists. Sweatproof kinesiology tape built for Indian
              athletes.
            </p>
            <p className="mt-3 text-xs text-kivo-cyan font-medium tracking-widest uppercase">
              Engineered for Motion
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={contactInfo.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a
                href={contactInfo.instagram.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white transition-transform hover:scale-105"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/products" className="hover:text-kivo-cyan transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products/kivo-pro" className="hover:text-kivo-cyan transition-colors">
                  Kivo Pro
                </Link>
              </li>
              <li>
                <Link href="/products/kivo-plus" className="hover:text-kivo-cyan transition-colors">
                  Kivo Plus
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-kivo-cyan transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-kivo-cyan transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-kivo-cyan flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
              {contactInfo.phones.map((p) => (
                <li key={p.tel} className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-kivo-cyan flex-shrink-0" />
                  <a href={`tel:${p.tel}`} className="hover:text-kivo-cyan transition-colors">
                    {p.number}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-kivo-cyan flex-shrink-0 mt-0.5" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} S.N. Medicare. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="px-2 py-1 border border-kivo-cyan/30 rounded text-kivo-cyan text-[10px] font-bold">
              CE
            </span>
            <span>Latex Free</span>
            <span>Medical Grade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
