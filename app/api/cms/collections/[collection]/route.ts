import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore, newId } from "@/lib/cms/store";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/resources");
  revalidatePath("/coaching");
  revalidatePath("/journey");
  revalidatePath("/get-in-touch");
  revalidatePath("/contact");
}
import type {
  CmsCoachingPackage,
  CmsCourseTier,
  CmsDailyTruth,
  CmsResource,
  CmsTestimonial,
} from "@/lib/cms/types";

type CollectionKey =
  | "testimonials"
  | "resources"
  | "dailyTruths"
  | "coachingPackages"
  | "courseTiers";

const KEYS: CollectionKey[] = [
  "testimonials",
  "resources",
  "dailyTruths",
  "coachingPackages",
  "courseTiers",
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
  revalidatePublic();
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
  // full replace for batch edits
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store as any)[key] = body.items;
  writeStore(store);
  revalidatePublic();
  return NextResponse.json({ items: store[key] });
}

export type {
  CmsTestimonial,
  CmsResource,
  CmsDailyTruth,
  CmsCoachingPackage,
  CmsCourseTier,
};
