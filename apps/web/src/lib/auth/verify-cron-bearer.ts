import { createHash, timingSafeEqual } from "crypto";
import type { AuthResult } from "@/lib/auth/verify-bearer";

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf-8").digest();
}

/**
 * Verify cron bearer token using constant-length digest comparison.
 * Uses CRON_SECRET only and fails closed when it is not configured.
 */
export function verifyCronBearerToken(authHeader: string | null): AuthResult {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      error: "Missing or malformed Authorization header",
    };
  }

  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return { authenticated: false, error: "Server misconfiguration" };
  }

  const token = authHeader.slice(7);

  try {
    const tokenDigest = sha256(token);
    const secretDigest = sha256(secret);

    if (!timingSafeEqual(tokenDigest, secretDigest)) {
      return { authenticated: false, error: "Invalid token" };
    }

    return { authenticated: true };
  } catch {
    return { authenticated: false, error: "Invalid token" };
  }
}
