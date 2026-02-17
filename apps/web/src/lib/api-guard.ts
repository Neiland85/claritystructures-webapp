import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyBearerToken } from "@/lib/auth/verify-bearer";
import { validateCsrf } from "@/lib/csrf/validate-csrf";

export interface ApiGuardOptions {
  /** Require a valid Bearer token (Authorization header vs JWT_SECRET). */
  requireAuth?: boolean;
  /** Require a valid CSRF double-submit cookie on mutating methods. */
  requireCsrf?: boolean;
}

/**
 * Procedimiento de Blindaje de API (Shield)
 * Implementa validaciones de seguridad nivel ICANN/ALAC
 */
export function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  return response;
}

export function validateCors(req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return false;
  }
  return true;
}

export function apiGuard(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  options: ApiGuardOptions = {},
) {
  // CORS validation
  if (!validateCors(req)) {
    return withSecurityHeaders(
      NextResponse.json({ error: "Security Violation: CORS" }, { status: 403 }),
    );
  }

  // Bearer token auth
  if (options.requireAuth) {
    const authResult = verifyBearerToken(req.headers.get("authorization"));
    if (!authResult.authenticated) {
      return withSecurityHeaders(
        NextResponse.json(
          { error: authResult.error || "Unauthorized" },
          { status: 401 },
        ),
      );
    }
  }

  // CSRF double-submit cookie validation
  if (options.requireCsrf) {
    const csrfResult = validateCsrf(req);
    if (!csrfResult.valid) {
      return withSecurityHeaders(
        NextResponse.json(
          { error: csrfResult.error || "CSRF validation failed" },
          { status: 403 },
        ),
      );
    }
  }

  return handler().then((res) => withSecurityHeaders(res));
}
