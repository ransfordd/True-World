import { NextResponse } from "next/server";
import {
  findUserByEmail,
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/cms/auth";
import { ensureCmsSeeded } from "@/lib/cms/seed";
import { readStore, writeStore } from "@/lib/cms/store";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureCmsSeeded();

  const body = (await req.json().catch(() => ({}))) as {
    currentPassword?: string;
    newPassword?: string;
  };
  const currentPassword = body.currentPassword || "";
  const newPassword = body.newPassword || "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current and new password are required" },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }
  if (newPassword === currentPassword) {
    return NextResponse.json(
      { error: "New password must be different from the current password" },
      { status: 400 }
    );
  }

  const user = findUserByEmail(session.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  const store = readStore();
  const idx = store.users.findIndex((u) => u.id === user.id);
  if (idx < 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  store.users[idx] = {
    ...store.users[idx],
    passwordHash: await hashPassword(newPassword),
  };
  writeStore(store);

  return NextResponse.json({ ok: true });
}
