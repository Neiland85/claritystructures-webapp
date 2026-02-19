import { Redis } from "@upstash/redis";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set — rate limiting is disabled",
  );
}

const redis =
  UPSTASH_URL && UPSTASH_TOKEN
    ? new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN })
    : null;

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<{ success: boolean; remaining: number }> {
  // If Redis is not configured, fail open (allow all requests)
  if (!redis) {
    return { success: true, remaining: limit };
  }

  const key = `rate-limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    // Remove old entries and get current count in a pipeline
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, { score: now, member: `${now}` });
    pipeline.zcard(key);
    pipeline.expire(key, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();
    const count = results[2] as number;

    return {
      success: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open - allow request if Redis is down
    return { success: true, remaining: limit };
  }
}

export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
}
