import { timingSafeEqual } from "crypto";

export interface AuthResult {
  authenticated: boolean;
  error?: string;
}

function resolveAdminSecret(): string | undefined {
  const secret = process.env.ADMIN_API_TOKEN || process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return undefined;
  }
  return secret;
}

/**
 * Production boot guard: refuse to start without a configured admin/API secret.
 * Never falls back to a static token.
 */
export function assertProductionAuthSecrets(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (!resolveAdminSecret()) {
    console.error(
      "[auth] Missing ADMIN_API_TOKEN or JWT_SECRET (>=32 chars) in production",
    );
    process.exit(1);
  }
}

/**
 * Verify bearer token using constant-time comparison.
 * Checks ADMIN_API_TOKEN first (dedicated), falls back to JWT_SECRET.
 * Fails closed: no secret configured → no access. No static default token.
 */
export function verifyBearerToken(authHeader: string | null): AuthResult {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      error: "Missing or malformed Authorization header",
    };
  }

  const token = authHeader.slice(7);
  const secret = resolveAdminSecret();

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
