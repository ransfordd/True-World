import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCmsSettings } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Ask a question or connect with The True Word ministry.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const site = await getCmsSettings();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <FadeIn className="text-center mb-12">
        <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
          Contact Us
        </h1>
        <p className="text-xl text-gray-300 mb-3">
          Question about faith, truth, or the movement?
        </p>
        <p className="text-gray-400">Submit below for guidance and answers.</p>
      </FadeIn>

      <FadeIn className="mb-16">
        <div id="ask-question" className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
          <ContactForm variant="question" />
        </div>
      </FadeIn>

      <FadeIn className="text-center p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
        <h2 className="font-cinzel text-2xl text-ttw-gold mb-6">Connect With Us</h2>
        <div className="space-y-2 text-gray-300">
          <p>
            Website:{" "}
            <a href={site.website} className="text-ttw-gold hover:underline" target="_blank" rel="noopener noreferrer">
              {site.website.replace(/^https?:\/\//, "")}
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a href={site.instagram} className="text-ttw-gold hover:underline" target="_blank" rel="noopener noreferrer">
              {site.instagramHandle}
            </a>
          </p>
          <p>
            Email:{" "}
            <a href={`mailto:${site.email}`} className="text-ttw-gold hover:underline">
              {site.email}
            </a>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
