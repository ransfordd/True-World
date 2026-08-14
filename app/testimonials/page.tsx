import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCmsCreed, getCmsExaltationLines, getCmsTestimonials } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Real stories of transformation, healing, and awakening from The True Word.",
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const [testimonials, exaltation, creed] = await Promise.all([
    getCmsTestimonials(),
    getCmsExaltationLines(),
    getCmsCreed(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <FadeIn className="text-center mb-14">
        <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
          Client Testimonies
        </h1>
        <p className="text-xl text-gray-300 mb-3">
          Real stories of transformation, healing, and awakening
        </p>
        <p className="text-gray-400">
          How The True Word impacted lives and relationships
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-6 mb-20">
        {testimonials.map((t, i) => (
          <FadeIn key={t.id} delay={i * 0.1}>
            <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a] h-full">
              <div className="flex gap-1 mb-4 text-ttw-gold">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-300 italic leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-ttw-gold/20 flex items-center justify-center text-ttw-gold text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-ttw-gold font-semibold">{t.names}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mb-16">
        <h2 className="font-cinzel text-3xl text-ttw-gold text-center uppercase gold-glow mb-8">
          Exaltation Words
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {exaltation.map((line) => (
            <p
              key={line.id}
              className="text-center text-gray-300 text-sm py-3 px-4 rounded-lg border border-ttw-gold/10 bg-black/40"
            >
              {line.text}
            </p>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="p-8 md:p-12 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a] text-center mb-16">
        <h2 className="font-cinzel text-2xl text-ttw-gold mb-6">Creed of Sacred Union</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line max-w-2xl mx-auto italic">
          {creed}
        </p>
      </FadeIn>

      <FadeIn className="p-10 rounded-2xl border border-ttw-gold/30 bg-gradient-to-br from-ttw-gold/10 to-[var(--surface)] text-center">
        <h2 className="font-cinzel text-2xl text-ttw-gold mb-3">Ready for healing and renewal?</h2>
        <p className="text-gray-300 text-sm mb-6 max-w-lg mx-auto">
          Marriage consultation and coaching paths are open for couples seeking faith,
          truth, and lasting union.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/coaching"
            className="bg-ttw-gold text-black py-3 px-8 rounded-full font-bold"
          >
            Explore Coaching
          </Link>
          <Link
            href="/get-in-touch"
            className="border border-ttw-gold text-ttw-gold py-3 px-8 rounded-full font-bold hover:bg-ttw-gold/10"
          >
            Get in Touch
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
