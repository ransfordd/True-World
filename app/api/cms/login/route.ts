import { NextResponse } from "next/server";
import {
  applySessionCookie,
  createSessionToken,
  findUserByEmail,
  verifyPassword,
} from "@/lib/cms/auth";
import {
  clearLoginFailures,
  getClientIp,
  getLoginLockout,
  recordLoginFailure,
} from "@/lib/cms/login-rate-limit";
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

  const ip = getClientIp(req);
  const rateKey = `${ip}:${email.toLowerCase()}`;
  const lockout = getLoginLockout(rateKey);
  if (lockout.locked) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${lockout.retryAfterMinutes} minute${
          lockout.retryAfterMinutes === 1 ? "" : "s"
        }.`,
      },
      { status: 429 }
    );
  }

  const user = findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    const afterFail = recordLoginFailure(rateKey);
    if (afterFail.locked) {
      return NextResponse.json(
        {
          error: `Too many attempts. Try again in ${afterFail.retryAfterMinutes} minute${
            afterFail.retryAfterMinutes === 1 ? "" : "s"
          }.`,
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Incorrect email or password" },
      { status: 401 }
    );
  }

  clearLoginFailures(rateKey);
  const token = await createSessionToken(user);
  const res = NextResponse.json({
    ok: true,
    user: { email: user.email, role: user.role, name: user.name },
  });
  return applySessionCookie(res, token);
}
