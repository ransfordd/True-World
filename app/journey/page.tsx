import type { Metadata } from "next";
import { CourseCards } from "@/components/journey/CourseCards";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCmsCourseTiers } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "The Awakening Journey",
  description:
    "A three-tiered self-paced course for spiritual awakening: Seekers, Disciples, and Masters.",
};

export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  const courseTiers = await getCmsCourseTiers();
  const tiers = courseTiers.map((t) => ({
    id: t.slug || t.id,
    name: t.name,
    theme: t.theme,
    level: t.level,
    focus: t.focus,
    practices: t.practices,
    outcome: t.outcome,
  }));

  return (
    <div className="page-hero-journey min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <FadeIn className="text-center mb-14">
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
            The True Word Awakening Journey
          </h1>
          <p className="text-xl text-gray-300 mb-3">
            A Three-Tiered Self-Paced Course for Spiritual Awakening
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transform through three paths: seeking → embodying → lasting impact.
          </p>
        </FadeIn>

        <CourseCards tiers={tiers} showCta={false} />

        <FadeIn className="mt-16 p-8 rounded-2xl border border-ttw-gold/20 bg-black/70 text-center">
          <h2 className="font-cinzel text-2xl text-ttw-gold mb-6">How The Course Works</h2>
          <ul className="text-gray-300 space-y-2 max-w-md mx-auto text-left list-decimal list-inside mb-8">
            <li>Self-paced modules</li>
            <li>Reflection & journaling</li>
            <li>Practical challenges</li>
            <li>Optional circles (online/offline)</li>
            <li>Certification of Path Completion</li>
          </ul>
          <p className="font-cinzel text-ttw-gold text-lg mb-8">
            Seekers awaken. Disciples transform. Masters impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/get-in-touch"
              className="bg-ttw-gold text-black py-3 px-8 rounded-full font-bold"
            >
              Enroll / Get in Touch
            </a>
            <a
              href="/coaching"
              className="border border-ttw-gold text-ttw-gold py-3 px-8 rounded-full font-bold hover:bg-ttw-gold/10"
            >
              View Coaching Packages
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
