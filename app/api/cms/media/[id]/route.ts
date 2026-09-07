import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";
import { uploadUrlToFilePath } from "@/lib/cms/uploads";

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
  const item = store.media.find((m) => m.id === id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  store.media = store.media.filter((m) => m.id !== id);
  writeStore(store);

  const filePath = uploadUrlToFilePath(item.url);
  if (filePath) {
    try {
      await unlink(filePath);
    } catch {
      /* file may already be gone */
    }
  }

  return NextResponse.json({ ok: true });
}
