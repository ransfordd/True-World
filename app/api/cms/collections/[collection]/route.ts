import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { newId, readStore, writeStore } from "@/lib/cms/store";
import { revalidateCmsPublic } from "@/lib/cms/revalidate";

type CollectionKey =
  | "testimonials"
  | "resources"
  | "dailyTruths"
  | "coachingPackages"
  | "courseTiers"
  | "faqs"
  | "exaltationLines";

const KEYS: CollectionKey[] = [
  "testimonials",
  "resources",
  "dailyTruths",
  "coachingPackages",
  "courseTiers",
  "faqs",
  "exaltationLines",
];

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ collection: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { collection } = await ctx.params;
  if (!KEYS.includes(collection as CollectionKey)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  const key = collection as CollectionKey;
  const items = readStore()[key];
  return NextResponse.json({ items });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ collection: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { collection } = await ctx.params;
  if (!KEYS.includes(collection as CollectionKey)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  const key = collection as CollectionKey;
  const body = await req.json();
  const store = readStore();
  const id = newId(key.slice(0, 3));
  const item = { ...body, id, sortOrder: body.sortOrder ?? store[key].length };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store[key] as any[]).push(item);
  writeStore(store);
  revalidateCmsPublic();
  return NextResponse.json({ item }, { status: 201 });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ collection: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { collection } = await ctx.params;
  if (!KEYS.includes(collection as CollectionKey)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  const key = collection as CollectionKey;
  const body = (await req.json()) as { items: unknown[] };
  if (!Array.isArray(body.items)) {
    return NextResponse.json({ error: "items array required" }, { status: 400 });
  }
  const store = readStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store as any)[key] = body.items;
  writeStore(store);
  revalidateCmsPublic();
  return NextResponse.json({ items: store[key] });
}
