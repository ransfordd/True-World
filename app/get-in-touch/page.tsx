import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCmsCoachingPackages } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Get In Touch",
  description: "Enroll in a True Word coaching package.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ package?: string }>;
};

export default async function GetInTouchPage({ searchParams }: Props) {
  const { package: packageName = "" } = await searchParams;
  const packages = await getCmsCoachingPackages();
  const pkg = packages.find((p) => p.name === packageName);

  if (packageName && !pkg) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="font-cinzel text-3xl text-ttw-gold mb-4">Invalid package</h1>
        <p className="text-gray-400 mb-8">Please choose a coaching package first.</p>
        <Link href="/coaching" className="text-ttw-gold hover:underline">
          View coaching packages →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <FadeIn className="text-center mb-12">
        <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
          Get In Touch
        </h1>
        <p className="text-xl text-gray-300">
          We&apos;re excited to help you begin your spiritual journey.
        </p>
      </FadeIn>

      {pkg && (
        <FadeIn className="mb-8 p-6 rounded-2xl border border-ttw-gold/30 bg-[#0a0a0a] text-center">
          <p className="text-sm text-ttw-gold/70 uppercase tracking-wider mb-2">
            Selected Package
          </p>
          <h2 id="selected-package-name" className="font-cinzel text-2xl text-ttw-gold">
            {pkg.name}
          </h2>
          <p id="selected-package-details" className="text-gray-400 text-sm mt-2">
            {pkg.path} · {pkg.level} · {pkg.duration}
          </p>
        </FadeIn>
      )}

      <FadeIn>
        <div className="p-8 rounded-2xl border border-ttw-gold/20 bg-[#0a0a0a]">
          <ContactForm variant="contact" packageName={pkg?.name || packageName} />
        </div>
      </FadeIn>
    </div>
  );
}
