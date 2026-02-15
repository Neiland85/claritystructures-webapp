import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getIdentifier } from "./lib/rate-limit/memory";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate nonce using Web Crypto API (Edge Runtime compatible)
  const nonce = crypto.randomUUID();

  // Content Security Policy
  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://eu-assets.i.posthog.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: https://eu-assets.i.posthog.com`,
    `font-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  // Security headers
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // HSTS in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const identifier = getIdentifier(request);
    const { success, remaining } = await checkRateLimit(identifier, 10, 10000);

    if (!success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "10",
          "X-RateLimit-Remaining": "0",
        },
      });
    }

    response.headers.set("X-RateLimit-Remaining", remaining.toString());
  }

  // Pass nonce to RSC
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
