interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 10000,
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const now = Date.now();

  if (Math.random() < 0.1) {
    for (const [k, v] of store.entries()) {
      if (v.resetAt < now) {
        store.delete(k);
      }
    }
  }

  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    store.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  entry.count++;

  if (entry.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}

export function getIdentifier(request: Request): string {
  // Identity = CSRF/session cookie + client IP. Combined on purpose.
  // x-forwarded-for is never the sole key (clients can spoof it).
  const cookieHeader = request.headers.get("cookie") ?? "";
  const session =
    cookieHeader.match(/(?:^|;\s*)(?:__csrf|csrf-token)=([^;]+)/)?.[1] ??
    "anon";
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "127.0.0.1";
  return `${session}:${ip}`;
}
