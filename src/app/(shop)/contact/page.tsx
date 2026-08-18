"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";
import { contactInfo } from "@/data/team";
import { WhatsAppIcon, InstagramIcon } from "@/components/SocialIcons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-20 min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle className="w-16 h-16 text-kivo-plus mb-4" />
        <h1 className="text-2xl font-bold mb-2">Message Sent!</h1>
        <p className="text-gray-400">
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="mt-3 text-gray-400">
            Questions about our products? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <Mail className="w-6 h-6 text-kivo-cyan mb-3" />
              <h3 className="font-semibold mb-1">Email</h3>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-gray-400 text-sm hover:text-kivo-cyan transition-colors"
              >
                {contactInfo.email}
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border">
              <Phone className="w-6 h-6 text-kivo-cyan mb-3" />
              <h3 className="font-semibold mb-3">Phone</h3>
              <ul className="space-y-2">
                {contactInfo.phones.map((p) => (
                  <li key={p.tel}>
                    <a
                      href={`tel:${p.tel}`}
                      className="text-gray-400 text-sm hover:text-kivo-cyan transition-colors block"
                    >
                      {p.number}
                    </a>
                    <span className="text-xs text-gray-600">{p.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border">
              <h3 className="font-semibold mb-4">Social</h3>
              <div className="space-y-3">
                <a
                  href={contactInfo.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-3 text-sm text-gray-300 transition-all hover:border-[#25D366]/50 hover:bg-[#25D366]/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-medium text-white">WhatsApp</span>
                    <span className="text-xs text-gray-400">
                      {contactInfo.whatsapp.number}
                    </span>
                  </span>
                </a>
                <a
                  href={contactInfo.instagram.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-3 text-sm text-gray-300 transition-all hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg shadow-[#dd2a7b]/25">
                    <InstagramIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-medium text-white">Instagram</span>
                    <span className="text-xs text-gray-400">
                      {contactInfo.instagram.handle}
                    </span>
                  </span>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border">
              <MapPin className="w-6 h-6 text-kivo-cyan mb-3" />
              <h3 className="font-semibold mb-1">Location</h3>
              <p className="text-gray-400 text-sm">India</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none"
              />
            </div>
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none"
            />
            <input
              required
              placeholder="Subject"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none"
            />
            <textarea
              required
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-kivo-cyan focus:outline-none resize-none"
            />
            <button
              type="submit"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-black"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
