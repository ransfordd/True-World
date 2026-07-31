import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");

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

function getManifest(): Record<string, { category?: string; excerpt?: string }> {
  const manifestPath = path.join(articlesDirectory, "manifest.json");
  if (!fs.existsSync(manifestPath)) return {};
  const items = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Array<{
    slug: string;
    category?: string;
    excerpt?: string;
  }>;
  return Object.fromEntries(items.map((i) => [i.slug, i]));
}

export function getAllArticles(): ArticleMeta[] {
  const manifest = getManifest();
  if (!fs.existsSync(articlesDirectory)) return [];

  const files = fs
    .readdirSync(articlesDirectory)
    .filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(articlesDirectory, filename), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        image: String(data.image ?? "/images/logo.png.png"),
        category: manifest[slug]?.category ?? "TEACHING",
        excerpt:
          manifest[slug]?.excerpt ??
          "Discover profound insights and spiritual wisdom in this powerful teaching.",
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getArticle(slug: string): Article | null {
  const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const manifest = getManifest();

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    image: String(data.image ?? "/images/logo.png.png"),
    category: manifest[slug]?.category ?? "TEACHING",
    excerpt: manifest[slug]?.excerpt,
    content: content.trim(),
  };
}

const FEATURED_SLUGS = [
  "a-biblical-story-that-still-speaks",
  "a-public-warning-to-humanity",
  "are-you-living-in-a-way-that-prepares-you-for-eternity",
];

export function getFeaturedArticles(count = 3): ArticleMeta[] {
  const all = getAllArticles();
  const featured = FEATURED_SLUGS.map((slug) =>
    all.find((a) => a.slug === slug)
  ).filter(Boolean) as ArticleMeta[];
  if (featured.length >= count) return featured.slice(0, count);
  return [...featured, ...all.filter((a) => !FEATURED_SLUGS.includes(a.slug))].slice(
    0,
    count
  );
}
