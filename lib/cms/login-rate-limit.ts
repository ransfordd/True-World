/**
 * In-memory CMS login rate limiting.
 * Resets when the Node process restarts (fine for a single Coolify/Docker container).
 */

const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type AttemptState = {
  failures: number;
  lockedUntil: number;
};

const byKey = new Map<string, AttemptState>();

function getState(key: string): AttemptState {
  const existing = byKey.get(key);
  if (existing) return existing;
  const fresh = { failures: 0, lockedUntil: 0 };
  byKey.set(key, fresh);
  return fresh;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function getLoginLockout(key: string): {
  locked: boolean;
  retryAfterMinutes: number;
} {
  const state = getState(key);
  const now = Date.now();
  if (state.lockedUntil > now) {
    return {
      locked: true,
      retryAfterMinutes: Math.max(
        1,
        Math.ceil((state.lockedUntil - now) / 60000)
      ),
    };
  }
  if (state.lockedUntil && state.lockedUntil <= now) {
    state.failures = 0;
    state.lockedUntil = 0;
  }
  return { locked: false, retryAfterMinutes: 0 };
}

export function recordLoginFailure(key: string): {
  locked: boolean;
  retryAfterMinutes: number;
} {
  const state = getState(key);
  state.failures += 1;
  if (state.failures >= MAX_FAILURES) {
    state.lockedUntil = Date.now() + LOCKOUT_MS;
    return {
      locked: true,
      retryAfterMinutes: Math.ceil(LOCKOUT_MS / 60000),
    };
  }
  return { locked: false, retryAfterMinutes: 0 };
}

export function clearLoginFailures(key: string) {
  byKey.delete(key);
}
