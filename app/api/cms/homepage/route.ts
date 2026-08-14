import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";
import { revalidateCmsPublic } from "@/lib/cms/revalidate";
import type { CmsHomepage } from "@/lib/cms/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  return NextResponse.json({ homepage: readStore().homepage });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const body = (await req.json()) as Partial<CmsHomepage>;
  const store = readStore();
  store.homepage = { ...store.homepage, ...body };
  writeStore(store);
  revalidateCmsPublic();
  return NextResponse.json({ homepage: store.homepage });
}
