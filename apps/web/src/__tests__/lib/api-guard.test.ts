import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { apiGuard, validateCors, withSecurityHeaders } from "@/lib/api-guard";

const SECRET = "test-secret-that-is-long-enough-32ch";

function buildRequest(
  method: string,
  opts: {
    origin?: string;
    auth?: string;
    csrfCookie?: string;
    csrfHeader?: string;
  } = {},
): NextRequest {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (opts.origin) headers.set("origin", opts.origin);
  if (opts.auth) headers.set("authorization", opts.auth);
  if (opts.csrfCookie) headers.set("cookie", `__csrf=${opts.csrfCookie}`);
  if (opts.csrfHeader) headers.set("x-csrf-token", opts.csrfHeader);
  return new NextRequest("http://localhost:3000/api/test", { method, headers });
}

const okHandler = async () => NextResponse.json({ ok: true });

describe("api-guard", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", SECRET);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ── CORS ─────────────────────────────────────────────────────
  describe("validateCors", () => {
    it("allows requests without origin header", () => {
      const req = buildRequest("GET");
      expect(validateCors(req)).toBe(true);
    });

    it("allows matching origin", () => {
      const req = buildRequest("GET", { origin: "http://localhost:3000" });
      expect(validateCors(req)).toBe(true);
    });

    it("rejects mismatched origin", () => {
      const req = buildRequest("GET", { origin: "https://evil.com" });
      expect(validateCors(req)).toBe(false);
    });
  });

  // ── Security headers ────────────────────────────────────────
  describe("withSecurityHeaders", () => {
    it("sets all expected headers", () => {
      const res = NextResponse.json({});
      const secured = withSecurityHeaders(res);
      expect(secured.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(secured.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
      expect(secured.headers.get("X-XSS-Protection")).toBe("1; mode=block");
    });
  });

  // ── apiGuard without options ─────────────────────────────────
  describe("apiGuard (no options)", () => {
    it("passes through to handler on valid CORS", async () => {
      const req = buildRequest("GET");
      const res = await apiGuard(req, okHandler);
      const body = await res.json();
      expect(body.ok).toBe(true);
    });

    it("rejects on invalid CORS", async () => {
      const req = buildRequest("GET", { origin: "https://evil.com" });
      const res = await apiGuard(req, okHandler);
      expect(res.status).toBe(403);
    });
  });

  // ── apiGuard with requireAuth ────────────────────────────────
  describe("apiGuard (requireAuth)", () => {
    it("allows valid bearer token", async () => {
      const req = buildRequest("GET", { auth: `Bearer ${SECRET}` });
      const res = await apiGuard(req, okHandler, { requireAuth: true });
      expect(res.status).toBe(200);
    });

    it("rejects missing auth header", async () => {
      const req = buildRequest("GET");
      const res = await apiGuard(req, okHandler, { requireAuth: true });
      expect(res.status).toBe(401);
    });

    it("rejects wrong token", async () => {
      const req = buildRequest("GET", { auth: "Bearer wrong-token-padded-32" });
      const res = await apiGuard(req, okHandler, { requireAuth: true });
      expect(res.status).toBe(401);
    });
  });

  // ── apiGuard with requireCsrf ────────────────────────────────
  describe("apiGuard (requireCsrf)", () => {
    const CSRF = "csrf-test-token-123";

    it("allows POST with valid CSRF tokens", async () => {
      const req = buildRequest("POST", {
        csrfCookie: CSRF,
        csrfHeader: CSRF,
      });
      const res = await apiGuard(req, okHandler, { requireCsrf: true });
      expect(res.status).toBe(200);
    });

    it("rejects POST with missing CSRF", async () => {
      const req = buildRequest("POST");
      const res = await apiGuard(req, okHandler, { requireCsrf: true });
      expect(res.status).toBe(403);
    });

    it("allows GET even without CSRF (non-mutating)", async () => {
      const req = buildRequest("GET");
      const res = await apiGuard(req, okHandler, { requireCsrf: true });
      expect(res.status).toBe(200);
    });
  });

  // ── apiGuard with both options ───────────────────────────────
  describe("apiGuard (requireAuth + requireCsrf)", () => {
    const CSRF = "csrf-combined-token";

    it("allows when both auth and CSRF are valid", async () => {
      const req = buildRequest("POST", {
        auth: `Bearer ${SECRET}`,
        csrfCookie: CSRF,
        csrfHeader: CSRF,
      });
      const res = await apiGuard(req, okHandler, {
        requireAuth: true,
        requireCsrf: true,
      });
      expect(res.status).toBe(200);
    });

    it("rejects when auth valid but CSRF missing", async () => {
      const req = buildRequest("POST", { auth: `Bearer ${SECRET}` });
      const res = await apiGuard(req, okHandler, {
        requireAuth: true,
        requireCsrf: true,
      });
      expect(res.status).toBe(403);
    });

    it("rejects when CSRF valid but auth missing", async () => {
      const req = buildRequest("POST", {
        csrfCookie: CSRF,
        csrfHeader: CSRF,
      });
      const res = await apiGuard(req, okHandler, {
        requireAuth: true,
        requireCsrf: true,
      });
      expect(res.status).toBe(401);
    });
  });
});
