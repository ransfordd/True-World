import type { Metadata } from "next";
import { CoachingPackages } from "@/components/coaching/CoachingPackages";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Coaching Packages",
  description:
    "Personalized one-on-one True Word coaching: Awakening, Transformation, and Impact Mentorship.",
};

export default function CoachingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <FadeIn className="text-center mb-14">
        <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
          True Word Coaching Packages
        </h1>
        <p className="text-xl text-gray-300 mb-3">
          Personalized one-on-one guidance for spiritual awakening
        </p>
        <p className="text-gray-400">
          Awaken, transform, and empower lasting impact
        </p>
      </FadeIn>

      <CoachingPackages allowModal={false} />

      <FadeIn className="mt-16 text-center">
        <p className="font-cinzel text-ttw-gold text-xl">
          Awakening = Remember → Transformation = Become → Impact = Share
        </p>
      </FadeIn>
    </div>
  );
}
