import { Redis } from "@upstash/redis";
import { createLogger } from "@/lib/logger";

const logger = createLogger("rate-limit");

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

function fallbackRateLimitResult(limit: number): {
  success: boolean;
  remaining: number;
} {
  if (isProductionRuntime()) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit };
}

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  logger.warn(
    "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set — rate limiting is disabled outside production",
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
  if (!redis) {
    logger.error("Rate limit unavailable: Upstash Redis is not configured");
    return fallbackRateLimitResult(limit);
  }

  const key = `rate-limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
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
    logger.error("Rate limit check failed", error);
    return fallbackRateLimitResult(limit);
  }
}

export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
}
