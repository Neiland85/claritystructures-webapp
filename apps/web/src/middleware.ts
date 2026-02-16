import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getIdentifier } from "./lib/rate-limit/upstash";

/**
 * Next.js Edge Middleware
 * Consolidates: CSP nonce, security headers, rate limiting, CSRF cookies.
 * Replaces the orphan proxy.ts with a properly wired middleware.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ── CSP nonce (Edge-compatible) ──────────────────────────────
  const nonce = crypto.randomUUID();

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

  // Pass nonce to RSC
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
