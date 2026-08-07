import {
  getCmsArticleBySlug,
  getFeaturedCmsArticles,
  getPublishedArticles,
} from "@/lib/cms/queries";
import type { CmsArticle } from "@/lib/cms/types";

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  excerpt?: string;
};

export type Article = ArticleMeta & {
  content: string;
};

function mapMeta(a: CmsArticle): ArticleMeta {
  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    image: a.coverImageUrl || "/images/logo.png.png",
    category: a.category,
    excerpt: a.excerpt,
  };
}

/** Published articles from the self-hosted CMS store. */
export async function getAllArticles(): Promise<ArticleMeta[]> {
  const list = await getPublishedArticles();
  return list.map(mapMeta);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const a = await getCmsArticleBySlug(slug);
  if (!a) return null;
  return {
    ...mapMeta(a),
    content: a.bodyHtml,
  };
}

export async function getFeaturedArticles(count = 3): Promise<ArticleMeta[]> {
  const list = await getFeaturedCmsArticles(count);
  return list.map(mapMeta);
}
