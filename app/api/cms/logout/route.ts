import { NextResponse } from "next/server";
import { applyClearSessionCookie } from "@/lib/cms/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  return applyClearSessionCookie(res);
}
