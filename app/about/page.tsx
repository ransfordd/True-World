import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Globe, Sparkles, User } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover our story, our founder Eric Paddy Boso, and what makes The True Word movement unique.",
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <FadeIn className="text-center mb-16">
        <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
          About Us
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
          A global movement awakening souls to their divine truth and purpose
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover our story, our founder, and what makes The True Word unique in
          restoring the original truth.
        </p>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        <FadeIn>
          <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a] h-full">
            <div className="flex items-center gap-4 mb-6">
              <BookOpen className="text-ttw-gold" size={28} />
              <h2 className="font-cinzel text-3xl text-ttw-gold">Our Story</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              The True Word was birthed from a divine calling—a vision to restore the
              original truth that has been obscured by centuries of religious tradition
              and human interpretation.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Founded by Eric Paddy Boso, this movement emerged not as another
              institution, but as a living testament to the unfiltered Word of God.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We are not an organization—we are a movement united to remember and embody
              the True Word that Yahushua lived and taught.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a] h-full">
            <div className="flex items-center gap-4 mb-6">
              <User className="text-ttw-gold" size={28} />
              <h2 className="font-cinzel text-3xl text-ttw-gold">Eric Paddy Boso</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              A prophetic voice committed to unveiling divine truth and empowering
              believers to walk in their full identity and purpose.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Through faithful study, prayer, and revelation, Eric restores the original
              teachings of Yahushua—beyond dogma to spiritual awakening and
              transformation.
            </p>
          </div>
        </FadeIn>
      </div>

      <FadeIn className="mb-16">
        <h2 className="font-cinzel text-3xl text-ttw-gold text-center uppercase gold-glow mb-8">
          What Makes Us Unique
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: "Truth Above Tradition",
              text: "We honor the uncompromised Word of God over religious traditions that have obscured divine truth.",
            },
            {
              icon: Globe,
              title: "Global Community",
              text: "We bring together believers from all backgrounds, cultures, and nations in unity and purpose.",
            },
            {
              icon: BookOpen,
              title: "Practical Transformation",
              text: "We provide real tools, coaching, and resources that empower lasting change.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-ttw-gold/10 bg-[#0a0a0a] text-center"
            >
              <item.icon className="mx-auto mb-4 text-ttw-gold" size={36} />
              <h3 className="font-cinzel text-ttw-gold text-xl mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="mb-16 p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
        <h2 className="font-cinzel text-3xl text-ttw-gold text-center uppercase gold-glow mb-8">
          Our Impact
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            ["Global", "Reaching souls worldwide through digital platforms"],
            ["Transformed", "Lives awakened to true identity and purpose"],
            ["Unified", "Community beyond cultural and denominational barriers"],
            ["Empowered", "Believers equipped for lasting transformation"],
          ].map(([title, text]) => (
            <div key={title}>
              <p className="font-cinzel text-3xl text-ttw-gold mb-2">{title}</p>
              <p className="text-gray-400 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="mb-16 grid md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
          <h2 className="font-cinzel text-2xl text-ttw-gold mb-4">Vision</h2>
          <p className="text-gray-300 leading-relaxed">
            Ignite a global awakening where humanity rediscovers direct connection to
            the Divine Source—beyond religion, division, and fear—ushering in truth,
            freedom, and unity.
          </p>
        </div>
        <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
          <h2 className="font-cinzel text-2xl text-ttw-gold mb-4">Mission</h2>
          <ul className="text-gray-300 space-y-2 text-sm list-disc list-inside">
            <li>Break illusions separating people from true divine nature</li>
            <li>Awaken individuals to live by the True Word within</li>
            <li>Empower seekers with knowledge, practices, and community</li>
            <li>Build a global movement of awakened souls</li>
          </ul>
        </div>
      </FadeIn>

      <FadeIn className="p-10 md:p-14 rounded-2xl border border-ttw-gold/30 bg-gradient-to-br from-ttw-gold/10 to-[var(--surface)] text-center">
        <h2 className="font-cinzel text-3xl text-ttw-gold uppercase gold-glow mb-4">
          Join the Movement
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Step into the path of awakening—whether through the Journey, coaching, or the
          wider community. Your identity and destiny are waiting.
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
