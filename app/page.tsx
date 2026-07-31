import Image from "next/image";
import Link from "next/link";
import { BookOpen, Globe, Sparkles, Star, User } from "lucide-react";
import { HomeWelcomeGate } from "@/components/home/HomeWelcomeGate";
import { DailyTruth } from "@/components/home/DailyTruth";
import { CourseCards } from "@/components/journey/CourseCards";
import { CoachingPackages } from "@/components/coaching/CoachingPackages";
import { ContactForm } from "@/components/forms/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";
import { getFeaturedArticles } from "@/lib/articles";
import { SITE, TESTIMONIALS } from "@/lib/site-data";

export default function HomePage() {
  const featured = getFeaturedArticles(3);

  return (
    <HomeWelcomeGate>
      <header className="py-16 md:py-28 text-center px-4 border-b border-ttw-gold/20">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 flex justify-center">
              <Image
                src={SITE.logo}
                alt="The True Word logo"
                width={250}
                height={250}
                className="w-full max-w-[150px] sm:max-w-[200px] md:max-w-[250px] h-auto"
                priority
              />
            </div>
            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-7xl font-black mb-6 tracking-tighter text-ttw-gold uppercase gold-glow">
              Spreading Light. Speaking Truth.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Awakening the Divine Within Humanity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#journey"
                className="bg-ttw-gold text-black py-4 px-8 rounded-full font-bold text-lg uppercase tracking-wider btn-modern"
              >
                Start Your Journey
              </a>
              <a
                href="#coaching"
                className="border-2 border-ttw-gold text-ttw-gold py-4 px-8 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-ttw-gold/10"
              >
                Explore Coaching
              </a>
            </div>
          </div>
        </FadeIn>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <FadeIn className="mb-28">
          <section id="about" className="anchor-offset">
            <div className="text-center mb-16">
              <h2 className="font-cinzel text-4xl sm:text-5xl font-extrabold mb-6 text-ttw-gold uppercase gold-glow">
                About Us
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A global movement awakening souls to their divine truth and purpose
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-gradient-to-br from-[#0a0a0a] to-[#080808] card-modern">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-ttw-gold/20 flex items-center justify-center">
                    <BookOpen className="text-ttw-gold" size={22} />
                  </div>
                  <h3 className="font-cinzel text-3xl text-ttw-gold">Our Story</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The True Word was birthed from a divine calling—a vision to restore
                  the original truth obscured by centuries of religious tradition and
                  human interpretation.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Founded by Eric Paddy Boso, we are a movement that transcends
                  boundaries—united to remember and embody the True Word that Yahushua
                  lived and taught.
                </p>
              </div>
              <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-gradient-to-br from-[#0a0a0a] to-[#080808] card-modern">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-ttw-gold/20 flex items-center justify-center">
                    <User className="text-ttw-gold" size={22} />
                  </div>
                  <h3 className="font-cinzel text-3xl text-ttw-gold">Eric Paddy Boso</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our teacher and founder is a prophetic voice committed to unveiling
                  divine truth and empowering believers to walk in their full identity
                  and purpose.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  His ministry helps people remember who they truly are in Christ, break
                  free from limiting beliefs, and step into divine destiny.
                </p>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="/about"
                className="inline-block border border-ttw-gold text-ttw-gold px-6 py-3 rounded-full hover:bg-ttw-gold/10"
              >
                Learn More About Us
              </Link>
            </div>
          </section>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-28">
          <FadeIn>
            <h2 className="font-cinzel text-4xl font-extrabold mb-8 text-ttw-gold uppercase border-b-4 border-ttw-gold/50 pb-4 gold-glow">
              Who We Are
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed mb-4">
              The True Word is a global faith-based movement dedicated to unveiling
              divine truth, igniting purpose, and empowering lives through prophetic
              insight and spiritual teaching.
            </p>
            <p className="text-base text-gray-400 leading-relaxed">
              Our mission is to illuminate the path for believers to walk in their full
              identity and destiny, grounded in the uncompromised Word of God.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <section id="video-section" className="anchor-offset">
              <h2 className="font-cinzel text-4xl font-extrabold mb-8 text-ttw-gold uppercase border-b-4 border-ttw-gold/50 pb-4 gold-glow">
                Latest Message
              </h2>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block pb-[56.25%] h-0 overflow-hidden rounded-2xl border-2 border-ttw-gold/30 video-player-shadow group"
              >
                <Image
                  src="https://placehold.co/1280x720/0a0a0a/C0A04C?text=Visit+Our+YouTube+Channel"
                  alt="Visit The True Word on YouTube"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-20 h-20 rounded-full bg-ttw-gold/90 flex items-center justify-center">
                    <svg className="w-10 h-10 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </a>
            </section>
          </FadeIn>
        </div>

        <DailyTruth />

        <FadeIn className="mb-28">
          <div className="text-center mb-10">
            <h2 className="font-cinzel text-4xl font-extrabold text-ttw-gold uppercase gold-glow mb-4">
              Core Pillars
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Faith", "Truth", "Transformation", "Impact"].map((pillar) => (
              <div
                key={pillar}
                className="p-6 text-center rounded-xl border border-ttw-gold/20 bg-[#0a0a0a]"
              >
                <Sparkles className="mx-auto mb-3 text-ttw-gold" size={28} />
                <p className="font-cinzel text-ttw-gold text-xl">{pillar}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <section id="journey" className="anchor-offset mb-28">
          <FadeIn className="text-center mb-12">
            <h2 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-4">
              The Awakening Journey
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Seekers awaken. Disciples transform. Masters impact.
            </p>
          </FadeIn>
          <CourseCards />
        </section>

        <section id="coaching" className="anchor-offset mb-28">
          <FadeIn className="text-center mb-12">
            <h2 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-4">
              Coaching Packages
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Personalized one-on-one guidance for spiritual awakening
            </p>
          </FadeIn>
          <CoachingPackages />
        </section>

        <section id="ask-question" className="anchor-offset mb-28">
          <FadeIn className="text-center mb-10">
            <h2 className="font-cinzel text-4xl font-extrabold text-ttw-gold uppercase gold-glow mb-4">
              Ask a Question
            </h2>
            <p className="text-gray-300">
              Have a question about faith, truth, or the movement?
            </p>
          </FadeIn>
          <ContactForm variant="question" />
        </section>

        <FadeIn className="mb-28">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <h2 className="font-cinzel text-4xl font-extrabold text-ttw-gold uppercase gold-glow">
              Featured Articles
            </h2>
            <Link href="/articles" className="text-ttw-gold hover:underline text-sm">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group rounded-2xl border border-ttw-gold/20 overflow-hidden bg-[#0a0a0a] card-modern"
              >
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-ttw-gold/70 uppercase tracking-wider mb-2">
                    {article.category}
                  </p>
                  <h3 className="font-cinzel text-lg text-ttw-gold group-hover:gold-glow">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="font-cinzel text-4xl font-extrabold text-ttw-gold uppercase gold-glow text-center mb-10">
            Testimonies
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.names}
                className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]"
              >
                <div className="flex gap-1 mb-4 text-ttw-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ttw-gold/20 flex items-center justify-center text-ttw-gold text-xs font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-ttw-gold font-semibold">{t.names}</p>
                    <p className="text-gray-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/testimonials" className="text-ttw-gold hover:underline">
              More testimonies →
            </Link>
          </div>
        </FadeIn>

        <FadeIn className="mt-28 text-center">
          <Globe className="mx-auto text-ttw-gold mb-4" size={36} />
          <p className="text-gray-400 text-sm">
            Join a global community of awakened souls
          </p>
        </FadeIn>
      </div>
    </HomeWelcomeGate>
  );
}
