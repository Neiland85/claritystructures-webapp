import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return false;
  }
  return true;
}

export function apiGuard(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
) {
  // CORS validation
  if (!validateCors(req)) {
    return NextResponse.json(
      { error: "Security Violation: CORS" },
      { status: 403 },
    );
  }

  // Rate limiting or Other checks could go here

  return handler().then((res) => withSecurityHeaders(res));
}
