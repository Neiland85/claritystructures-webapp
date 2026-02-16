import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyBearerToken } from "@/lib/auth/verify-bearer";

describe("verifyBearerToken", () => {
  const REAL_SECRET = "test-secret-that-is-long-enough-32ch";

  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", REAL_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns authenticated:true for a valid token", () => {
    const result = verifyBearerToken(`Bearer ${REAL_SECRET}`);
    expect(result).toEqual({ authenticated: true });
  });

  it("rejects null header", () => {
    const result = verifyBearerToken(null);
    expect(result.authenticated).toBe(false);
    expect(result.error).toMatch(/Missing or malformed/);
  });

  it("rejects empty string header", () => {
    const result = verifyBearerToken("");
    expect(result.authenticated).toBe(false);
    expect(result.error).toMatch(/Missing or malformed/);
  });

  it("rejects header without Bearer prefix", () => {
    const result = verifyBearerToken(`Basic ${REAL_SECRET}`);
    expect(result.authenticated).toBe(false);
    expect(result.error).toMatch(/Missing or malformed/);
  });

  it("rejects wrong token", () => {
    const result = verifyBearerToken("Bearer wrong-token-value-padded-32ch");
    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Invalid token");
  });

  it("rejects token with different length", () => {
    const result = verifyBearerToken("Bearer short");
    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Invalid token");
  });

  it("fails closed when JWT_SECRET is not set", () => {
    vi.stubEnv("JWT_SECRET", "");
    const result = verifyBearerToken(`Bearer ${REAL_SECRET}`);
    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Server misconfiguration");
  });
});
