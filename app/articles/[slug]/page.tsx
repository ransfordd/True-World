import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle } from "@/lib/articles";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.description,
  };
}

function toHtml(content: string): string {
  return content
    .replace(/^<>\s*/, "")
    .replace(/\s*<\/>\s*$/, "")
    .replace(/className=/g, "class=");
}

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <FadeIn className="text-center mb-12">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-ttw-gold/70 hover:text-ttw-gold mb-6 text-sm"
        >
          ← Back to Articles
        </Link>
        {article.image && (
          <div className="relative w-full h-56 sm:h-72 mb-8 rounded-2xl overflow-hidden border border-ttw-gold/20">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        )}
        <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-ttw-gold uppercase gold-glow">
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span className="text-ttw-gold/70 uppercase tracking-wider font-semibold">
            {article.category || "ARTICLE"}
          </span>
          <span>The True Word</span>
        </div>
      </FadeIn>

      <FadeIn>
        <article className="rounded-2xl border border-ttw-gold/20 bg-gradient-to-br from-[#0a0a0a] to-[#080808] p-8 md:p-12">
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: toHtml(article.content) }}
          />
        </article>
      </FadeIn>
    </div>
  );
}
