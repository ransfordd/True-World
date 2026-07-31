import type { Metadata } from "next";
import { Star } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { TESTIMONIALS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Real stories of transformation, healing, and awakening from The True Word.",
};

const EXALTATION = [
  "Awakened Love, Eternal Union.",
  "From Wounds to Wonders.",
  "Two Hearts, One Divine Purpose.",
  "When Truth Heals, Love Reigns.",
  "Marriage is the altar where love becomes legacy.",
  "Faith builds, Truth heals, Love endures.",
  "Your union is sacred, your love is eternal, your purpose is divine.",
  "Every struggle can be transformed into strength.",
  "A healed marriage is a healed generation.",
  "Love renewed, hope restored, destiny awakened.",
  "In truth we unite, in love we endure.",
  "Marriage is not survival—it is sacred exaltation.",
];

export default function TestimonialsPage() {
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
        {TESTIMONIALS.map((t, i) => (
          <FadeIn key={t.names} delay={i * 0.1}>
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
          {EXALTATION.map((line) => (
            <p
              key={line}
              className="text-center text-gray-300 text-sm py-3 px-4 rounded-lg border border-ttw-gold/10 bg-black/40"
            >
              {line}
            </p>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="p-8 md:p-12 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a] text-center">
        <h2 className="font-cinzel text-2xl text-ttw-gold mb-6">Creed of Sacred Union</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line max-w-2xl mx-auto italic">
          {`We are two, yet we are one.
Joined not by chance, but by divine design.
Our love is not fragile—
It is fire refined by truth,
It is water that heals,
It is a seed that grows into legacy.
We choose faith when fear whispers.
We choose truth when silence tempts.
We choose love when storms rise.
Our words will build, not break.
Our hands will heal, not wound.
Our hearts will forgive, not forsake.
Today, we vow not only to endure—
But to exalt our marriage
As a living testimony of God's purpose.
Together, we are strength.
Together, we are sanctuary.
Together, we are eternal.`}
        </p>
      </FadeIn>
    </div>
  );
}
