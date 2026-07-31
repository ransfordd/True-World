import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Prayer Requests",
  description: "Submit a prayer request to The True Word prayer team.",
};

export default function PrayerRequestsPage() {
  return (
    <div className="page-hero-prayer min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <FadeIn className="text-center mb-12">
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
            Prayer Requests
          </h1>
          <p className="text-xl text-gray-300 mb-3">Submit to our prayer team</p>
          <p className="text-gray-400">
            Your request is held in confidence and lifted to the Most High.
          </p>
        </FadeIn>
        <FadeIn>
          <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-black/70">
            <ContactForm variant="prayer" />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
