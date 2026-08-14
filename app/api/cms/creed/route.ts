import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";
import { revalidateCmsPublic } from "@/lib/cms/revalidate";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  return NextResponse.json({ creed: readStore().creed });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const body = (await req.json()) as { creed?: string };
  const store = readStore();
  if (typeof body.creed === "string") {
    store.creed = body.creed;
    writeStore(store);
    revalidateCmsPublic();
  }
  return NextResponse.json({ creed: store.creed });
}
