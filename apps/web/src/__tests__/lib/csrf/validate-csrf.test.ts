import { describe, it, expect } from "vitest";
import { validateCsrf } from "@/lib/csrf/validate-csrf";
import { NextRequest } from "next/server";

/** Helper to build a NextRequest with cookies and headers. */
function buildRequest(
  method: string,
  opts: { cookie?: string; header?: string } = {},
): NextRequest {
  const url = "http://localhost:3000/api/test";
  const headers = new Headers();
  if (opts.cookie) {
    headers.set("cookie", `__csrf=${opts.cookie}`);
  }
  if (opts.header) {
    headers.set("x-csrf-token", opts.header);
  }
  return new NextRequest(url, { method, headers });
}

describe("validateCsrf", () => {
  const TOKEN = "csrf-test-token-abc123";

  it("skips validation for GET requests", () => {
    const req = buildRequest("GET");
    expect(validateCsrf(req)).toEqual({ valid: true });
  });

  it("validates matching cookie + header on POST", () => {
    const req = buildRequest("POST", { cookie: TOKEN, header: TOKEN });
    expect(validateCsrf(req)).toEqual({ valid: true });
  });

  it("rejects POST with missing cookie", () => {
    const req = buildRequest("POST", { header: TOKEN });
    const result = validateCsrf(req);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Missing CSRF/);
  });

  it("rejects POST with missing header", () => {
    const req = buildRequest("POST", { cookie: TOKEN });
    const result = validateCsrf(req);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Missing CSRF/);
  });

  it("rejects POST with mismatched tokens", () => {
    const req = buildRequest("POST", {
      cookie: TOKEN,
      header: "different-token-value-",
    });
    const result = validateCsrf(req);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/mismatch/);
  });

  it("validates PATCH method", () => {
    const req = buildRequest("PATCH", { cookie: TOKEN, header: TOKEN });
    expect(validateCsrf(req)).toEqual({ valid: true });
  });

  it("validates DELETE method", () => {
    const req = buildRequest("DELETE", { cookie: TOKEN, header: TOKEN });
    expect(validateCsrf(req)).toEqual({ valid: true });
  });
});
