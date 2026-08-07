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
  return NextResponse.json({
    user: { email: session.email, role: session.role },
    counts: {
      articles: readStore().articles.length,
      testimonials: readStore().testimonials.length,
      resources: readStore().resources.length,
      dailyTruths: readStore().dailyTruths.length,
      coachingPackages: readStore().coachingPackages.length,
      courseTiers: readStore().courseTiers.length,
      media: readStore().media.length,
    },
  });
}
