import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  verifyBearerToken,
  assertProductionAuthSecrets,
} from "@/lib/auth/verify-bearer";

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

  it("rejects secrets shorter than 32 characters", () => {
    vi.stubEnv("JWT_SECRET", "short");
    vi.stubEnv("ADMIN_API_TOKEN", "");
    const result = verifyBearerToken("Bearer short");
    expect(result.authenticated).toBe(false);
    expect(result.error).toBe("Server misconfiguration");
  });

  it("exits process in production when no auth secret is configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("JWT_SECRET", "");
    vi.stubEnv("ADMIN_API_TOKEN", "");
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as typeof process.exit);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    assertProductionAuthSecrets();

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("prefers ADMIN_API_TOKEN over JWT_SECRET", () => {
    const dedicatedToken = "dedicated-console-secret-value-32";
    vi.stubEnv("ADMIN_API_TOKEN", dedicatedToken);
    // Should authenticate with ADMIN_API_TOKEN, not JWT_SECRET
    const result = verifyBearerToken(`Bearer ${dedicatedToken}`);
    expect(result).toEqual({ authenticated: true });
    // JWT_SECRET should NOT work when ADMIN_API_TOKEN is set
    const result2 = verifyBearerToken(`Bearer ${REAL_SECRET}`);
    expect(result2.authenticated).toBe(false);
  });
});
