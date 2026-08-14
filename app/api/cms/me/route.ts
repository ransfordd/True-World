import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore } from "@/lib/cms/store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const store = readStore();
  const recentArticles = [...store.articles]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      status: a.status,
      updatedAt: a.updatedAt,
    }));
  return NextResponse.json({
    user: { email: session.email, role: session.role },
    counts: {
      articles: store.articles.length,
      testimonials: store.testimonials.length,
      resources: store.resources.length,
      dailyTruths: store.dailyTruths.length,
      coachingPackages: store.coachingPackages.length,
      courseTiers: store.courseTiers.length,
      media: store.media.length,
      unreadMessages: (store.messages || []).filter((m) => !m.read).length,
      drafts: store.articles.filter((a) => a.status === "draft").length,
    },
    recentArticles,
    youtubeFeaturedVideoId: store.settings.youtubeFeaturedVideoId || "",
  });
}
