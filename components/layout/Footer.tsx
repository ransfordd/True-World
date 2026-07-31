"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site-data";
import { useToast } from "@/components/providers/ToastProvider";
import { mailtoFallbackUrl } from "@/lib/client-mail";

export function Footer() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

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
    <footer className="border-t border-ttw-gold/20 mt-20 bg-black/80">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Image
            src={SITE.logo}
            alt="The True Word logo"
            width={128}
            height={128}
            className="w-32 mb-4 opacity-90"
          />
          <p className="text-gray-400 text-sm leading-relaxed">
            {SITE.tagline}. Awakening the Divine Within Humanity.
          </p>
        </div>

        <div>
          <h3 className="font-cinzel text-ttw-gold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {NAV_LINKS.slice(0, 6).map((link) => (
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
          <p className="text-sm text-gray-400 mb-2">
            Instagram:{" "}
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ttw-gold hover:underline"
            >
              {SITE.instagramHandle}
            </a>
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Email:{" "}
            <a href={`mailto:${SITE.email}`} className="text-ttw-gold hover:underline">
              {SITE.email}
            </a>
          </p>
          <form onSubmit={onSubscribe} className="flex gap-2">
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="flex-1 bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ttw-gold"
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
      <div className="border-t border-ttw-gold/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.{" "}
        <Link href="/faq" className="text-ttw-gold/70 hover:text-ttw-gold">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
