import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyCronBearerToken } from "@/lib/auth/verify-cron-bearer";

describe("verifyCronBearerToken", () => {
  const CRON_SECRET = "cron-secret-that-is-long-enough-32ch";

  beforeEach(() => {
    vi.stubEnv("CRON_SECRET", CRON_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns authenticated:true for a valid cron bearer token", () => {
    const result = verifyCronBearerToken(`Bearer ${CRON_SECRET}`);

    expect(result).toEqual({ authenticated: true });
  });

  it("rejects null header", () => {
    const result = verifyCronBearerToken(null);

    expect(result.authenticated).toBe(false);
    expect(result.error).toMatch(/Missing or malformed/);
  });

  it("rejects header without Bearer prefix", () => {
    const result = verifyCronBearerToken(`Basic ${CRON_SECRET}`);

    expect(result.authenticated).toBe(false);
    expect(result.error).toMatch(/Missing or malformed/);
  });

  it("rejects wrong token with same length", () => {
    const wrongToken = "x".repeat(CRON_SECRET.length);
    const result = verifyCronBearerToken(`Bearer ${wrongToken}`);

    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Invalid token");
  });

  it("rejects token with different length", () => {
    const result = verifyCronBearerToken("Bearer short");

    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Invalid token");
  });

  it("fails closed when CRON_SECRET is not set", () => {
    vi.stubEnv("CRON_SECRET", "");
    const result = verifyCronBearerToken(`Bearer ${CRON_SECRET}`);

    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Server misconfiguration");
  });
});
