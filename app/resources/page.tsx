import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCmsResources } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Resources",
  description: "Books, study guides, and resources from The True Word.",
};

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await getCmsResources();

  return (
    <div className="page-hero-resources min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <FadeIn className="text-center mb-14">
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
            Resources
          </h1>
          <p className="text-xl text-gray-300 mb-3">
            Books and teachings by Eric Paddy Boso
          </p>
          <p className="text-gray-400">
            Store links to deepen understanding and accelerate growth
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((book, i) => (
            <FadeIn key={book.id} delay={i * 0.05}>
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-2xl border border-ttw-gold/20 overflow-hidden bg-black/70 card-modern"
              >
                <div className="relative h-64">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-cinzel text-xl text-ttw-gold mb-2">{book.title}</h2>
                  <p className="text-gray-400 text-sm mb-3">{book.description}</p>
                  <span className="text-ttw-gold text-sm font-semibold">Read now →</span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
