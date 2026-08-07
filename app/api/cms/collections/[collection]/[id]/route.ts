import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";

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

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/resources");
  revalidatePath("/coaching");
  revalidatePath("/journey");
  revalidatePath("/get-in-touch");
  revalidatePath("/contact");
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ collection: string; id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { collection, id } = await ctx.params;
  if (!KEYS.includes(collection as CollectionKey)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  const key = collection as CollectionKey;
  const body = await req.json();
  const store = readStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = store[key] as any[];
  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  items[idx] = { ...items[idx], ...body, id };
  writeStore(store);
  revalidatePublic();
  return NextResponse.json({ item: items[idx] });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ collection: string; id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { collection, id } = await ctx.params;
  if (!KEYS.includes(collection as CollectionKey)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  const key = collection as CollectionKey;
  const store = readStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const before = (store[key] as any[]).length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store as any)[key] = (store[key] as any[]).filter((i) => i.id !== id);
  if ((store[key] as unknown[]).length === before) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  writeStore(store);
  revalidatePublic();
  return NextResponse.json({ ok: true });
}
