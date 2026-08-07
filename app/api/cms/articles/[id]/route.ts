import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";
import type { CmsArticle } from "@/lib/cms/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { id } = await ctx.params;
  const article = readStore().articles.find((a) => a.id === id);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ article });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { id } = await ctx.params;
  const body = (await req.json()) as Partial<CmsArticle>;
  const store = readStore();
  const idx = store.articles.findIndex((a) => a.id === id);
  if (idx < 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const prev = store.articles[idx];
  const nextSlug = body.slug
    ? body.slug.trim().toLowerCase().replace(/\s+/g, "-")
    : prev.slug;
  if (
    nextSlug !== prev.slug &&
    store.articles.some((a) => a.slug === nextSlug && a.id !== id)
  ) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }
  const article: CmsArticle = {
    ...prev,
    title: body.title?.trim() ?? prev.title,
    slug: nextSlug,
    description: body.description ?? prev.description,
    excerpt: body.excerpt ?? prev.excerpt,
    category:
      body.category === "FAITH" || body.category === "TEACHING"
        ? body.category
        : prev.category,
    coverImageUrl: body.coverImageUrl ?? prev.coverImageUrl,
    bodyHtml: body.bodyHtml ?? prev.bodyHtml,
    featured: body.featured ?? prev.featured,
    status:
      body.status === "draft" || body.status === "published"
        ? body.status
        : prev.status,
    updatedAt: new Date().toISOString(),
  };
  store.articles[idx] = article;
  writeStore(store);
  return NextResponse.json({ article });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { id } = await ctx.params;
  const store = readStore();
  const before = store.articles.length;
  store.articles = store.articles.filter((a) => a.id !== id);
  if (store.articles.length === before) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  writeStore(store);
  return NextResponse.json({ ok: true });
}
