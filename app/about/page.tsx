import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Globe, Sparkles, User } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCmsAbout } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover our story, our founder Eric Paddy Boso, and what makes The True Word movement unique.",
};

export const dynamic = "force-dynamic";

const UNIQUE_ICONS = [Sparkles, Globe, BookOpen];

export default async function AboutPage() {
  const about = await getCmsAbout();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <FadeIn className="text-center mb-16">
        <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
          About Us
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
          {about.introLead}
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto">{about.introSub}</p>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        <FadeIn>
          <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a] h-full">
            <div className="flex items-center gap-4 mb-6">
              <BookOpen className="text-ttw-gold" size={28} />
              <h2 className="font-cinzel text-3xl text-ttw-gold">Our Story</h2>
            </div>
            {about.story.map((p, i) => (
              <p
                key={i}
                className={`${i === 0 ? "text-gray-300" : "text-gray-400"} leading-relaxed ${
                  i < about.story.length - 1 ? "mb-4" : ""
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a] h-full">
            <div className="flex items-center gap-4 mb-6">
              <User className="text-ttw-gold" size={28} />
              <h2 className="font-cinzel text-3xl text-ttw-gold">
                {about.founderName}
              </h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">{about.founderLead}</p>
            <p className="text-gray-400 leading-relaxed">{about.founderBody}</p>
          </div>
        </FadeIn>
      </div>

      <FadeIn className="mb-16">
        <h2 className="font-cinzel text-3xl text-ttw-gold text-center uppercase gold-glow mb-8">
          What Makes Us Unique
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {about.uniqueItems.map((item, i) => {
            const Icon = UNIQUE_ICONS[i] || Sparkles;
            return (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-ttw-gold/10 bg-[#0a0a0a] text-center"
              >
                <Icon className="mx-auto mb-4 text-ttw-gold" size={36} />
                <h3 className="font-cinzel text-ttw-gold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn className="mb-16 p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
        <h2 className="font-cinzel text-3xl text-ttw-gold text-center uppercase gold-glow mb-8">
          Our Impact
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {about.impactItems.map((item) => (
            <div key={item.title}>
              <p className="font-cinzel text-3xl text-ttw-gold mb-2">{item.title}</p>
              <p className="text-gray-400 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="mb-16 grid md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
          <h2 className="font-cinzel text-2xl text-ttw-gold mb-4">Vision</h2>
          <p className="text-gray-300 leading-relaxed">{about.vision}</p>
        </div>
        <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
          <h2 className="font-cinzel text-2xl text-ttw-gold mb-4">Mission</h2>
          <ul className="text-gray-300 space-y-2 text-sm list-disc list-inside">
            {about.missionLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </FadeIn>

      <FadeIn className="p-10 md:p-14 rounded-2xl border border-ttw-gold/30 bg-gradient-to-br from-ttw-gold/10 to-[var(--surface)] text-center">
        <h2 className="font-cinzel text-3xl text-ttw-gold uppercase gold-glow mb-4">
          {about.joinTitle}
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
          {about.joinBody}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/journey"
            className="bg-ttw-gold text-black py-3 px-8 rounded-full font-bold"
          >
            Start Your Journey
          </Link>
          <Link
            href="/coaching"
            className="border border-ttw-gold text-ttw-gold py-3 px-8 rounded-full font-bold hover:bg-ttw-gold/10"
          >
            Explore Coaching
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
