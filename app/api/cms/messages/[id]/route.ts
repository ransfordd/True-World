import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { id } = await ctx.params;
  const body = (await req.json()) as { read?: boolean };
  const store = readStore();
  const idx = store.messages.findIndex((m) => m.id === id);
  if (idx < 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (typeof body.read === "boolean") {
    store.messages[idx].read = body.read;
  }
  writeStore(store);
  return NextResponse.json({ message: store.messages[idx] });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const { id } = await ctx.params;
  const store = readStore();
  const before = store.messages.length;
  store.messages = store.messages.filter((m) => m.id !== id);
  if (store.messages.length === before) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  writeStore(store);
  return NextResponse.json({ ok: true });
}
