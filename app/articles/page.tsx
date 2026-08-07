import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArticleCover } from "@/components/ui/ArticleCover";

export const metadata: Metadata = {
  title: "Articles",
  description: "Teachings and spiritual insights from The True Word ministry.",
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="page-hero-articles min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <FadeIn className="text-center mb-14">
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-ttw-gold uppercase gold-glow mb-6">
            Articles
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Profound teachings and spiritual insights from The True Word
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <FadeIn key={article.slug} delay={(i % 6) * 0.05}>
              <Link
                href={`/articles/${article.slug}`}
                className="group block h-full rounded-2xl border border-ttw-gold/20 overflow-hidden bg-black/70 card-modern"
              >
                <ArticleCover src={article.image} alt={article.title} />
                <div className="p-5">
                  <p className="text-xs text-ttw-gold/70 uppercase tracking-wider mb-2">
                    {article.category}
                  </p>
                  <h2 className="font-cinzel text-lg text-ttw-gold mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                  <span className="text-ttw-gold text-sm">Read more →</span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
