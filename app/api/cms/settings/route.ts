import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";
import type { CmsSiteSettings } from "@/lib/cms/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  return NextResponse.json({ settings: readStore().settings });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  await ensureCmsSeeded();
  const body = (await req.json()) as Partial<CmsSiteSettings>;
  const store = readStore();
  store.settings = {
    ...store.settings,
    ...Object.fromEntries(
      Object.entries(body).filter(([, v]) => typeof v === "string")
    ),
  } as CmsSiteSettings;
  writeStore(store);
  return NextResponse.json({ settings: store.settings });
}
