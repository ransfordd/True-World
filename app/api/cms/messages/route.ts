import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore } from "@/lib/cms/store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSeeded();
  const store = readStore();
  const messages = [...(store.messages || [])].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );
  return NextResponse.json({ messages });
}
