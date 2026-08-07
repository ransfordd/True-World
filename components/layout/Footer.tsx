"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site-data";
import { useToast } from "@/components/providers/ToastProvider";
import { mailtoFallbackUrl } from "@/lib/client-mail";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

const FOOTER_LINKS = [
  ...NAV_LINKS.slice(0, 6),
  { href: "/prayer-requests", label: "Prayer" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const pathname = usePathname();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const site = useSiteSettings();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  async function onSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email")?.toString().trim() || "";
    if (!email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      showToast("Subscription successful! Welcome to The True Word community.", "success");
      form.reset();
    } catch {
      window.location.href = mailtoFallbackUrl(
        "Newsletter Subscription",
        `Please subscribe this email: ${email}`
      );
      showToast("Opening email client as fallback…", "warning");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="border-t border-ttw-gold/20 mt-20 theme-footer">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Image
            src={site.logo}
            alt="The True Word logo"
            width={128}
            height={128}
            className="w-32 mb-4 opacity-90"
          />
          <p className="theme-muted text-sm leading-relaxed">
            {site.tagline}. Awakening the Divine Within Humanity.
          </p>
        </div>

        <div>
          <h3 className="font-cinzel text-ttw-gold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm theme-muted">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-ttw-gold transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-cinzel text-ttw-gold mb-4">Stay Connected</h3>
          <p className="text-sm theme-muted mb-2">
            YouTube:{" "}
            <a
              href={site.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ttw-gold hover:underline"
            >
              Channel
            </a>
          </p>
          <p className="text-sm theme-muted mb-2">
            Instagram:{" "}
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ttw-gold hover:underline"
            >
              {site.instagramHandle}
            </a>
          </p>
          <p className="text-sm theme-muted mb-4">
            Email:{" "}
            <a href={`mailto:${site.email}`} className="text-ttw-gold hover:underline">
              {site.email}
            </a>
          </p>
          <form onSubmit={onSubscribe} className="flex gap-2">
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="flex-1 theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ttw-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-ttw-gold text-black px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60"
            >
              {loading ? "…" : "Join"}
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-ttw-gold/10 py-4 text-center text-xs theme-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.{" "}
        <Link href="/faq" className="text-ttw-gold/70 hover:text-ttw-gold">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
