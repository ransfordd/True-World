import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";
import { revalidateCmsPublic } from "@/lib/cms/revalidate";
import type { CmsAbout } from "@/lib/cms/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  return NextResponse.json({ about: readStore().about });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const body = (await req.json()) as Partial<CmsAbout>;
  const store = readStore();
  store.about = { ...store.about, ...body };
  writeStore(store);
  revalidateCmsPublic();
  return NextResponse.json({ about: store.about });
}
