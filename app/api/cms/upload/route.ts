import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { newId, readStore, writeStore } from "@/lib/cms/store";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();

  const form = await req.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") || "Upload");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Images only" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safe), buf);

  const url = `/uploads/${safe}`;
  const store = readStore();
  const media = {
    id: newId("med"),
    filename: file.name,
    url,
    alt,
    createdAt: new Date().toISOString(),
  };
  store.media.push(media);
  writeStore(store);

  return NextResponse.json({ media }, { status: 201 });
}
