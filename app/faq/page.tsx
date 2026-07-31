import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about The True Word, awakening, and faith.",
};

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <FadeIn className="text-center mb-12">
        <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-300 mb-3">
          Answers about The True Word, teachings, and the spiritual journey
        </p>
        <p className="text-gray-400">Awakening, transformation, and community</p>
      </FadeIn>
      <FaqAccordion />
    </div>
  );
}
