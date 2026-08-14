import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  defaultEmptyStore,
  newId,
  readStore,
  storeHasContent,
  writeStore,
} from "./store";
import type {
  CmsArticle,
  CmsCoachingPackage,
  CmsCourseTier,
  CmsStore,
} from "./types";
import { hashPassword } from "./auth";
import {
  defaultAbout,
  defaultExaltationLines,
  defaultFaqs,
  defaultHomepage,
  DEFAULT_CREED,
} from "./defaults";
import {
  COACHING_PACKAGES,
  COURSE_TIERS,
  DAILY_TRUTHS,
  RESOURCES,
  SITE,
  TESTIMONIALS,
} from "@/lib/site-data";

/** Fill v2 page copy / inbox if missing. Never resets articles or users. */
function migrateStoreV2(store: CmsStore): boolean {
  let dirty = false;
  const raw = store as CmsStore & { version?: number };

  if (!Array.isArray(store.faqs)) {
    store.faqs = defaultFaqs();
    dirty = true;
  }
  if (!store.about) {
    store.about = defaultAbout();
    dirty = true;
  }
  if (!store.homepage) {
    store.homepage = defaultHomepage();
    dirty = true;
  }
  if (!Array.isArray(store.exaltationLines)) {
    store.exaltationLines = defaultExaltationLines();
    dirty = true;
  }
  if (typeof store.creed !== "string") {
    store.creed = DEFAULT_CREED;
    dirty = true;
  }
  if (!Array.isArray(store.messages)) {
    store.messages = [];
    dirty = true;
  }
  if (!Array.isArray(store.media)) {
    store.media = [];
    dirty = true;
  }
  if (raw.version !== 2) {
    store.version = 2;
    dirty = true;
  }
  return dirty;
}

function stripMdxToHtml(content: string): string {
  return content
    .replace(/^<>\s*/, "")
    .replace(/\s*<\/>\s*$/, "")
    .replace(/className=/g, "class=");
}

function loadArticlesFromMdx(): CmsArticle[] {
  const dir = path.join(process.cwd(), "content", "articles");
  if (!fs.existsSync(dir)) return [];
  const now = new Date().toISOString();
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf8");
      const { data, content } = matter(raw);
      const title = String(data.title ?? slug);
      const bodyHtml = stripMdxToHtml(content.trim());
      const plain = bodyHtml
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const excerpt =
        plain.length > 160 ? `${plain.slice(0, 157).trim()}…` : plain;
      return {
        id: newId("art"),
        title,
        slug,
        description: String(data.description ?? ""),
        excerpt,
        category: /faith|biblical|soul|prayer|eternity|christ/i.test(title + slug)
          ? ("FAITH" as const)
          : ("TEACHING" as const),
        coverImageUrl: String(data.image ?? SITE.logo),
        bodyHtml,
        featured: [
          "a-biblical-story-that-still-speaks",
          "a-public-warning-to-humanity",
          "are-you-living-in-a-way-that-prepares-you-for-eternity",
        ].includes(slug),
        status: "published" as const,
        createdAt: now,
        updatedAt: now,
      };
    });
}

/**
 * Ensure CMS has seed data. Safe to call on server boot / first request.
 * Creates admin user from CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD if missing.
 */
export async function ensureCmsSeeded(): Promise<CmsStore> {
  let store = readStore();
  let dirty = false;
  const email =
    process.env.CMS_ADMIN_EMAIL?.trim() || "admin@thetrueword.com";
  const password = process.env.CMS_ADMIN_PASSWORD || "ChangeMe123!";

  if (!storeHasContent(store)) {
    store = defaultEmptyStore();
    store.settings = {
      name: SITE.name,
      tagline: SITE.tagline,
      email: SITE.email,
      website: SITE.website,
      instagram: SITE.instagram,
      instagramHandle: SITE.instagramHandle,
      youtube: SITE.youtube,
      youtubeFeaturedVideoId: SITE.youtubeFeaturedVideoId || "",
      logo: SITE.logo,
    };
    store.articles = loadArticlesFromMdx();
    store.testimonials = TESTIMONIALS.map((t, i) => ({
      id: newId("tst"),
      names: t.names,
      role: t.role,
      initials: t.initials,
      quote: t.quote,
      sortOrder: i,
    }));
    store.resources = RESOURCES.map((r, i) => ({
      id: newId("res"),
      title: r.title,
      description: r.description,
      image: r.image,
      link: r.link,
      sortOrder: i,
    }));
    store.dailyTruths = DAILY_TRUTHS.map((d, i) => ({
      id: newId("dt"),
      text: d.text,
      reference: d.ref,
      sortOrder: i,
    }));
    store.coachingPackages = COACHING_PACKAGES.map(
      (p, i): CmsCoachingPackage => ({
        id: newId("cp"),
        slug: p.id,
        name: p.name,
        path: p.path,
        level: p.level,
        duration: p.duration,
        purpose: p.purpose,
        outcome: p.outcome,
        featured: p.featured,
        includes: [...p.includes],
        sortOrder: i,
      })
    );
    store.courseTiers = COURSE_TIERS.map(
      (t, i): CmsCourseTier => ({
        id: newId("ct"),
        slug: t.id,
        name: t.name,
        theme: t.theme,
        level: t.level,
        focus: [...t.focus],
        practices: [...t.practices],
        outcome: t.outcome,
        sortOrder: i,
      })
    );
    store.faqs = defaultFaqs();
    store.about = defaultAbout();
    store.homepage = defaultHomepage();
    store.exaltationLines = defaultExaltationLines();
    store.creed = DEFAULT_CREED;
    store.messages = [];
    store.version = 2;
    dirty = true;
  }

  if (migrateStoreV2(store)) {
    dirty = true;
  }

  if (!store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    store.users.push({
      id: newId("usr"),
      email,
      passwordHash: await hashPassword(password),
      role: "admin",
      name: "Site Admin",
    });
    dirty = true;
  }

  if (dirty) {
    writeStore(store);
  }
  return store;
}
