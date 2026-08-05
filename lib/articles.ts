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

const GENERIC_EXCERPT =
  "Discover profound insights and spiritual wisdom in this powerful teaching.";

function getManifest(): Record<
  string,
  { category?: string; excerpt?: string; title?: string; image?: string }
> {
  const manifestPath = path.join(articlesDirectory, "manifest.json");
  if (!fs.existsSync(manifestPath)) return {};
  const items = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Array<{
    slug: string;
    category?: string;
    excerpt?: string;
    title?: string;
    image?: string;
  }>;
  return Object.fromEntries(items.map((i) => [i.slug, i]));
}

/** Prefer FAITH for faith/prayer/identity themes when manifest has no category. */
function inferCategory(slug: string, title: string): string {
  const s = `${slug} ${title}`.toLowerCase();
  if (
    /faith|prayer|biblical|eternity|soul|spirit|christ|god|divine|identity|repent|cross|blood|truth/.test(
      s
    )
  ) {
    return "FAITH";
  }
  return "TEACHING";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFromBody(content: string): string {
  const plain = stripHtml(content);
  if (!plain) return GENERIC_EXCERPT;
  const cut = plain.length > 160 ? `${plain.slice(0, 157).trim()}…` : plain;
  return cut;
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
      const { data, content } = matter(raw);
      const title = String(data.title ?? slug);
      const m = manifest[slug];
      return {
        slug,
        title,
        description: String(data.description ?? ""),
        image: String(data.image ?? m?.image ?? "/images/logo.png.png"),
        category: m?.category ?? inferCategory(slug, title),
        excerpt:
          m?.excerpt?.trim() ||
          excerptFromBody(content) ||
          GENERIC_EXCERPT,
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
  const title = String(data.title ?? slug);
  const m = manifest[slug];

  return {
    slug,
    title,
    description: String(data.description ?? ""),
    image: String(data.image ?? m?.image ?? "/images/logo.png.png"),
    category: m?.category ?? inferCategory(slug, title),
    excerpt: m?.excerpt?.trim() || excerptFromBody(content),
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
