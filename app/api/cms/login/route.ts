import { NextResponse } from "next/server";
import {
  createSessionToken,
  findUserByEmail,
  setSessionCookie,
  verifyPassword,
} from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";

export async function POST(req: Request) {
  await ensureCmsSeeded();
  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };
  const email = body.email?.trim() || "";
  const password = body.password || "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }
  const user = findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await createSessionToken(user);
  await setSessionCookie(token);
  return NextResponse.json({
    ok: true,
    user: { email: user.email, role: user.role, name: user.name },
  });
}
