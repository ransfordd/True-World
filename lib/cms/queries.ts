import { ensureCmsSeeded } from "./seed";
import { readStore } from "./store";
import type {
  CmsArticle,
  CmsCoachingPackage,
  CmsCourseTier,
  CmsDailyTruth,
  CmsResource,
  CmsSiteSettings,
  CmsTestimonial,
} from "./types";

/** Public read helpers — always run seed so first deploy has content. */
export async function getCmsSettings(): Promise<CmsSiteSettings> {
  await ensureCmsSeeded();
  return readStore().settings;
}

export async function getPublishedArticles(): Promise<CmsArticle[]> {
  await ensureCmsSeeded();
  return readStore()
    .articles.filter((a) => a.status === "published")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getCmsArticleBySlug(
  slug: string
): Promise<CmsArticle | null> {
  await ensureCmsSeeded();
  return (
    readStore().articles.find(
      (a) => a.slug === slug && a.status === "published"
    ) || null
  );
}

export async function getFeaturedCmsArticles(
  count = 3
): Promise<CmsArticle[]> {
  const all = await getPublishedArticles();
  const featured = all.filter((a) => a.featured);
  if (featured.length >= count) return featured.slice(0, count);
  return [...featured, ...all.filter((a) => !a.featured)].slice(0, count);
}

export async function getCmsTestimonials(): Promise<CmsTestimonial[]> {
  await ensureCmsSeeded();
  return [...readStore().testimonials].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export async function getCmsResources(): Promise<CmsResource[]> {
  await ensureCmsSeeded();
  return [...readStore().resources].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCmsDailyTruths(): Promise<CmsDailyTruth[]> {
  await ensureCmsSeeded();
  return [...readStore().dailyTruths].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export async function getCmsCoachingPackages(): Promise<CmsCoachingPackage[]> {
  await ensureCmsSeeded();
  return [...readStore().coachingPackages].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export async function getCmsCourseTiers(): Promise<CmsCourseTier[]> {
  await ensureCmsSeeded();
  return [...readStore().courseTiers].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}
