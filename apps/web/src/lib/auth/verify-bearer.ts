import { timingSafeEqual } from "crypto";

export interface AuthResult {
  authenticated: boolean;
  error?: string;
}

/**
 * Verify bearer token using constant-time comparison.
 * Checks ADMIN_API_TOKEN first (dedicated), falls back to JWT_SECRET.
 * Fails closed: no secret configured → no access.
 */
export function verifyBearerToken(authHeader: string | null): AuthResult {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      error: "Missing or malformed Authorization header",
    };
  }

  const token = authHeader.slice(7);
  const secret = process.env.ADMIN_API_TOKEN || process.env.JWT_SECRET;

  if (!secret) {
    return { authenticated: false, error: "Server misconfiguration" };
  }

  try {
    const tokenBuffer = Buffer.from(token, "utf-8");
    const secretBuffer = Buffer.from(secret, "utf-8");

    if (tokenBuffer.length !== secretBuffer.length) {
      return { authenticated: false, error: "Invalid token" };
    }

    if (!timingSafeEqual(tokenBuffer, secretBuffer)) {
      return { authenticated: false, error: "Invalid token" };
    }

    return { authenticated: true };
  } catch {
    return { authenticated: false, error: "Invalid token" };
  }
}
