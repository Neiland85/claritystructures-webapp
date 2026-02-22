import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getIdentifier } from "./lib/rate-limit/upstash";

/**
 * Next.js 16 Proxy (Edge Middleware)
 * Consolidates: CSP nonce, security headers, rate limiting, CSRF cookies.
 *
 * Next.js 16 uses proxy.ts instead of middleware.ts.
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 */
export async function proxy(request: NextRequest) {
  // Forward nonce via request headers so RSC can read it via next/headers
  const nonce = crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // ── CSP (without strict-dynamic — Next.js injects scripts without nonces) ──
  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' https://eu-assets.i.posthog.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' blob: data: https://eu-assets.i.posthog.com`,
    `connect-src 'self' https://eu.i.posthog.com https://eu-assets.i.posthog.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

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
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Embedder-Policy", "credentialless");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // HSTS in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  // ── Rate limiting (API routes only) ──────────────────────────
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const identifier = getIdentifier(request);
    const { success, remaining } = await checkRateLimit(identifier, 10, 10_000);

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

  // ── CSRF double-submit cookies ───────────────────────────────
  // Set a pair of cookies: __csrf (HttpOnly) and csrf-token (readable by JS).
  // The client sends the csrf-token value back in the x-csrf-token header;
  // the server-side validateCsrf() compares it against the __csrf cookie.
  const existingCsrf = request.cookies.get("__csrf")?.value;
  if (!existingCsrf) {
    const csrfToken = crypto.randomUUID();
    const isProduction = process.env.NODE_ENV === "production";

    // HttpOnly cookie — sent automatically, cannot be read by JS
    response.cookies.set("__csrf", csrfToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: isProduction,
      path: "/",
    });

    // Readable cookie — JS reads this and sends via x-csrf-token header
    response.cookies.set("csrf-token", csrfToken, {
      httpOnly: false,
      sameSite: "strict",
      secure: isProduction,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
