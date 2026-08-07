import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore, newId } from "@/lib/cms/store";
import type { CmsArticle } from "@/lib/cms/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const articles = readStore().articles.sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return NextResponse.json({ articles });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const body = (await req.json()) as Partial<CmsArticle>;
  if (!body.title?.trim() || !body.slug?.trim()) {
    return NextResponse.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );
  }
  const store = readStore();
  const slug = body.slug.trim().toLowerCase().replace(/\s+/g, "-");
  if (store.articles.some((a) => a.slug === slug)) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }
  const now = new Date().toISOString();
  const article: CmsArticle = {
    id: newId("art"),
    title: body.title.trim(),
    slug,
    description: body.description?.trim() || "",
    excerpt: body.excerpt?.trim() || "",
    category: body.category === "FAITH" ? "FAITH" : "TEACHING",
    coverImageUrl: body.coverImageUrl?.trim() || "/images/logo.png.png",
    bodyHtml: body.bodyHtml || "<p></p>",
    featured: Boolean(body.featured),
    status: body.status === "draft" ? "draft" : "published",
    createdAt: now,
    updatedAt: now,
  };
  store.articles.push(article);
  writeStore(store);
  return NextResponse.json({ article }, { status: 201 });
}
