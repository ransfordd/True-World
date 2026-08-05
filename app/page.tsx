import Image from "next/image";
import Link from "next/link";
import { Cross, Eye, Flame, Globe, Heart, Star } from "lucide-react";
import { HomeWelcomeGate } from "@/components/home/HomeWelcomeGate";
import { DailyTruth } from "@/components/home/DailyTruth";
import { CourseCards } from "@/components/journey/CourseCards";
import { CoachingPackages } from "@/components/coaching/CoachingPackages";
import { ContactForm } from "@/components/forms/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArticleCover } from "@/components/ui/ArticleCover";
import { getFeaturedArticles } from "@/lib/articles";
import { SITE, TESTIMONIALS } from "@/lib/site-data";

const PILLARS = [
  { name: "Faith", line: "Trust rooted in the living Word", Icon: Cross },
  { name: "Truth", line: "Revelation beyond tradition", Icon: Eye },
  { name: "Transformation", line: "Renewed mind, renewed life", Icon: Flame },
  { name: "Impact", line: "Awakening that multiplies", Icon: Heart },
] as const;

export default function HomePage() {
  const featured = getFeaturedArticles(3);
  const videoId = SITE.youtubeFeaturedVideoId.trim();
  const videoHref = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : SITE.youtube;
  const videoAria = videoId
    ? "Watch the latest message on YouTube"
    : "Visit our YouTube channel — THE TRUE WORD";

  return (
    <HomeWelcomeGate>
      <header className="relative min-h-[88vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-ttw-gold/20">
        <Image
          src="/images/pr.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-[var(--page-bg)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-ttw-gold/10 via-transparent to-transparent" />
        <FadeIn className="relative z-10 w-full py-20 md:py-28 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <Image
                src={SITE.logo}
                alt="The True Word logo"
                width={250}
                height={250}
                className="w-full max-w-[140px] sm:max-w-[180px] md:max-w-[220px] h-auto drop-shadow-lg"
                priority
              />
            </div>
            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-7xl font-black mb-5 tracking-tighter text-ttw-gold uppercase gold-glow">
              Spreading Light. Speaking Truth.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
              Awakening the Divine Within Humanity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#journey"
                className="bg-ttw-gold text-black py-4 px-8 rounded-full font-bold text-lg uppercase tracking-wider btn-modern"
              >
                Start Your Journey
              </a>
              <a
                href="#coaching"
                className="text-ttw-gold font-semibold text-base underline-offset-4 hover:underline"
              >
                Explore Coaching
              </a>
            </div>
          </div>
        </FadeIn>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <FadeIn className="mb-24">
          <section id="about" className="anchor-offset">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-ttw-gold/25">
                <Image
                  src="/images/ar.jpg"
                  alt="Ministry atmosphere — The True Word"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div>
                <h2 className="font-cinzel text-4xl sm:text-5xl font-extrabold mb-4 text-ttw-gold uppercase gold-glow">
                  About Us
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  A global faith-based movement unveiling divine truth, igniting purpose,
                  and empowering lives through prophetic insight and spiritual teaching.
                </p>
                <p className="text-base text-gray-400 leading-relaxed mb-4">
                  Founded by Eric Paddy Boso, we restore the unfiltered Word of God beyond
                  religious tradition—so believers walk in full identity and destiny.
                </p>
                <p className="text-base text-gray-400 leading-relaxed mb-8">
                  Not an institution: a living community united to remember and embody the
                  True Word Yahushua lived and taught.
                </p>
                <Link
                  href="/about"
                  className="inline-block border border-ttw-gold text-ttw-gold px-6 py-3 rounded-full hover:bg-ttw-gold/10 transition"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn className="mb-24" delay={0.05}>
          <section id="video-section" className="anchor-offset max-w-3xl mx-auto">
            <h2 className="font-cinzel text-4xl font-extrabold mb-3 text-ttw-gold uppercase gold-glow text-center">
              Latest Message
            </h2>
            <p className="text-center text-gray-400 text-sm mb-8">
              Teachings and prophetic insight from our YouTube channel
            </p>
            <a
              href={videoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block pb-[56.25%] h-0 overflow-hidden rounded-2xl border border-ttw-gold/40 video-player-shadow group bg-[var(--surface)]"
              aria-label={videoAria}
            >
              {videoId ? (
                <>
                  <Image
                    src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                    alt="Latest message on The True Word YouTube channel"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/25" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-ttw-gold shadow-[0_0_28px_rgba(192,160,76,0.4)] transition-transform duration-300 group-hover:scale-110">
                      <svg className="ml-1 h-8 w-8 sm:h-10 sm:w-10 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-center text-sm font-medium text-white/90">Watch the message</p>
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src="/images/pr.jpg"
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-ttw-gold/10" />
                  <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-3 p-3 sm:p-4">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-ttw-gold/60 bg-black shadow-md sm:h-12 sm:w-12">
                      <Image src={SITE.logo} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="truncate font-cinzel text-sm font-semibold tracking-wide text-ttw-gold sm:text-base">
                        {SITE.name}
                      </p>
                      <p className="truncate text-xs text-gray-300 sm:text-sm">
                        @THETRUEWORDBYERICPADDYBOSO
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 rounded bg-[#FF0000] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      YouTube
                    </span>
                  </div>
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 pt-10">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ttw-gold shadow-[0_0_28px_rgba(192,160,76,0.45)] transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                      <svg className="ml-1 h-8 w-8 text-black sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-center text-base font-semibold tracking-wide text-white sm:text-lg">
                      Visit Our YouTube Channel
                    </p>
                    <p className="text-center text-xs font-medium tracking-wide text-gray-300 sm:text-sm">
                      Teachings · Prophetic insight
                    </p>
                  </div>
                </>
              )}
            </a>
            {videoId ? (
              <p className="mt-4 text-center text-sm text-gray-400">
                <a
                  href={SITE.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ttw-gold hover:underline"
                >
                  Visit the full channel →
                </a>
              </p>
            ) : null}
          </section>
        </FadeIn>

        <DailyTruth />

        <FadeIn className="mb-24">
          <div className="text-center mb-10">
            <h2 className="font-cinzel text-4xl font-extrabold text-ttw-gold uppercase gold-glow mb-3">
              Core Pillars
            </h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              What anchors the teaching and the journey ahead
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PILLARS.map(({ name, line, Icon }) => (
              <div
                key={name}
                className="p-5 text-center rounded-xl border border-ttw-gold/20 bg-[var(--surface)]"
              >
                <Icon className="mx-auto mb-3 text-ttw-gold" size={26} />
                <p className="font-cinzel text-ttw-gold text-lg mb-1">{name}</p>
                <p className="text-xs text-gray-400 leading-snug">{line}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <section id="journey" className="anchor-offset mb-24">
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

        <section id="coaching" className="anchor-offset mb-24">
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

        <section id="ask-question" className="anchor-offset mb-24">
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

        {featured.length > 0 ? (
          <FadeIn className="mb-24">
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
                  className="group rounded-2xl border border-ttw-gold/20 overflow-hidden bg-[var(--surface)] card-modern"
                >
                  <ArticleCover
                    src={article.image}
                    alt={article.title}
                    className="relative h-48"
                  />
                  <div className="p-5">
                    <p className="text-xs text-ttw-gold/70 uppercase tracking-wider mb-2">
                      {article.category}
                    </p>
                    <h3 className="font-cinzel text-lg text-ttw-gold group-hover:gold-glow mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt ? (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                    ) : null}
                    <span className="text-ttw-gold text-sm">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        ) : null}

        <FadeIn>
          <h2 className="font-cinzel text-4xl font-extrabold text-ttw-gold uppercase gold-glow text-center mb-10">
            Testimonies
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.names}
                className="p-8 rounded-2xl border border-ttw-gold/20 bg-[var(--surface)]"
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

        <FadeIn className="mt-24 text-center p-10 rounded-2xl border border-ttw-gold/25 bg-gradient-to-br from-[var(--surface)] to-black/40">
          <Globe className="mx-auto text-ttw-gold mb-4" size={36} />
          <p className="font-cinzel text-ttw-gold text-xl mb-2">
            Join a global community of awakened souls
          </p>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Watch teachings, follow the journey, or take the first step today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={SITE.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ttw-gold text-black px-5 py-2.5 rounded-full text-sm font-bold"
            >
              YouTube
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-ttw-gold text-ttw-gold px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-ttw-gold/10"
            >
              Instagram
            </a>
            <a
              href="#journey"
              className="inline-flex items-center gap-2 text-ttw-gold text-sm font-semibold underline-offset-4 hover:underline"
            >
              Start Journey
            </a>
          </div>
        </FadeIn>
      </div>
    </HomeWelcomeGate>
  );
}
