import { NextResponse } from "next/server";
import { getCmsSettings } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

/** Public site settings (no secrets). Used by layout chrome. */
export async function GET() {
  try {
    const settings = await getCmsSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 500 });
  }
}
