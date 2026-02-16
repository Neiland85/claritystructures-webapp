import type { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

export interface CsrfResult {
  valid: boolean;
  error?: string;
}

const MUTATING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

/**
 * Double-submit cookie CSRF validation.
 * Compares __csrf cookie against x-csrf-token header.
 * Only enforced for mutating HTTP methods.
 */
export function validateCsrf(req: NextRequest): CsrfResult {
  if (!MUTATING_METHODS.has(req.method)) {
    return { valid: true };
  }

  const cookieToken = req.cookies.get("__csrf")?.value;
  const headerToken = req.headers.get("x-csrf-token");

  if (!cookieToken || !headerToken) {
    return { valid: false, error: "Missing CSRF token" };
  }

  try {
    const cookieBuf = Buffer.from(cookieToken, "utf-8");
    const headerBuf = Buffer.from(headerToken, "utf-8");

    if (cookieBuf.length !== headerBuf.length) {
      return { valid: false, error: "CSRF token mismatch" };
    }

    if (!timingSafeEqual(cookieBuf, headerBuf)) {
      return { valid: false, error: "CSRF token mismatch" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "CSRF validation error" };
  }
}
