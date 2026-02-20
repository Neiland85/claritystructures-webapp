import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock rate limiter
const { mockCheckRateLimit, mockGetIdentifier } = vi.hoisted(() => ({
  mockCheckRateLimit: vi
    .fn()
    .mockResolvedValue({ success: true, remaining: 9 }),
  mockGetIdentifier: vi.fn().mockReturnValue("ip:127.0.0.1"),
}));
vi.mock("@/lib/rate-limit/upstash", () => ({
  checkRateLimit: mockCheckRateLimit,
  getIdentifier: mockGetIdentifier,
}));

// Import after mocks
const { proxy } = await import("@/proxy");

function createRequest(path: string, cookies?: Record<string, string>) {
  const url = `http://localhost:3000${path}`;
  const req = new NextRequest(url);

  if (cookies) {
    for (const [name, value] of Object.entries(cookies)) {
      req.cookies.set(name, value);
    }
  }

  return req;
}

describe("proxy (Edge Middleware)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({ success: true, remaining: 9 });
  });

  describe("security headers", () => {
    it("should set Content-Security-Policy with nonce", async () => {
      const response = await proxy(createRequest("/"));

      const csp = response.headers.get("Content-Security-Policy");
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("'nonce-");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("upgrade-insecure-requests");
    });

    it("should set X-Frame-Options to DENY", async () => {
      const response = await proxy(createRequest("/"));
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    });

    it("should set X-Content-Type-Options to nosniff", async () => {
      const response = await proxy(createRequest("/"));
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    });

    it("should set Referrer-Policy", async () => {
      const response = await proxy(createRequest("/"));
      expect(response.headers.get("Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );
    });

    it("should set Permissions-Policy", async () => {
      const response = await proxy(createRequest("/"));
      expect(response.headers.get("Permissions-Policy")).toBe(
        "camera=(), microphone=(), geolocation=()",
      );
    });

    it("should set Cross-Origin-Opener-Policy", async () => {
      const response = await proxy(createRequest("/"));
      expect(response.headers.get("Cross-Origin-Opener-Policy")).toBe(
        "same-origin",
      );
    });

    it("should set Cross-Origin-Embedder-Policy", async () => {
      const response = await proxy(createRequest("/"));
      expect(response.headers.get("Cross-Origin-Embedder-Policy")).toBe(
        "credentialless",
      );
    });

    it("should set X-Permitted-Cross-Domain-Policies", async () => {
      const response = await proxy(createRequest("/"));
      expect(response.headers.get("X-Permitted-Cross-Domain-Policies")).toBe(
        "none",
      );
    });

    it("should forward x-nonce in request headers", async () => {
      const response = await proxy(createRequest("/"));
      // The nonce is a UUID set on the request headers
      const csp = response.headers.get("Content-Security-Policy")!;
      const nonceMatch = csp.match(/'nonce-([^']+)'/);
      expect(nonceMatch).toBeTruthy();
      expect(nonceMatch![1]).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });

  describe("rate limiting", () => {
    it("should check rate limit on API routes", async () => {
      await proxy(createRequest("/api/contact"));

      expect(mockGetIdentifier).toHaveBeenCalled();
      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        "ip:127.0.0.1",
        10,
        10_000,
      );
    });

    it("should NOT check rate limit on non-API routes", async () => {
      await proxy(createRequest("/about"));

      expect(mockCheckRateLimit).not.toHaveBeenCalled();
    });

    it("should return 429 when rate limit is exceeded", async () => {
      mockCheckRateLimit.mockResolvedValueOnce({
        success: false,
        remaining: 0,
      });

      const response = await proxy(createRequest("/api/contact"));

      expect(response.status).toBe(429);
      expect(response.headers.get("Retry-After")).toBe("10");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    });

    it("should set X-RateLimit-Remaining header on success", async () => {
      mockCheckRateLimit.mockResolvedValueOnce({
        success: true,
        remaining: 7,
      });

      const response = await proxy(createRequest("/api/triage"));

      expect(response.headers.get("X-RateLimit-Remaining")).toBe("7");
    });
  });

  describe("CSRF cookies", () => {
    it("should set __csrf and csrf-token cookies when none exist", async () => {
      const response = await proxy(createRequest("/"));

      const setCookies = response.headers.getSetCookie();
      const csrfCookie = setCookies.find((c) => c.startsWith("__csrf="));
      const tokenCookie = setCookies.find((c) => c.startsWith("csrf-token="));

      expect(csrfCookie).toBeTruthy();
      expect(csrfCookie).toContain("HttpOnly");
      expect(csrfCookie?.toLowerCase()).toContain("samesite=strict");

      expect(tokenCookie).toBeTruthy();
      expect(tokenCookie).not.toContain("HttpOnly");
    });

    it("should NOT set CSRF cookies when __csrf already exists", async () => {
      const response = await proxy(
        createRequest("/", { __csrf: "existing-token" }),
      );

      const setCookies = response.headers.getSetCookie();
      const csrfCookie = setCookies.find((c) => c.startsWith("__csrf="));

      expect(csrfCookie).toBeUndefined();
    });

    it("should set matching values for __csrf and csrf-token", async () => {
      const response = await proxy(createRequest("/"));

      const setCookies = response.headers.getSetCookie();
      const csrfValue = setCookies
        .find((c) => c.startsWith("__csrf="))
        ?.split(";")[0]
        ?.split("=")[1];
      const tokenValue = setCookies
        .find((c) => c.startsWith("csrf-token="))
        ?.split(";")[0]
        ?.split("=")[1];

      expect(csrfValue).toBeTruthy();
      expect(csrfValue).toBe(tokenValue);
    });
  });
});
