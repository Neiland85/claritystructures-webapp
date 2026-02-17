import { describe, it, expect, vi } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("getNonce", () => {
  it("should return the x-nonce header value", async () => {
    const { headers } = await import("next/headers");
    vi.mocked(headers).mockResolvedValue({
      get: vi.fn().mockReturnValue("test-nonce-123"),
    } as any);

    const { getNonce } = await import("@/lib/csp/get-nonce");
    const nonce = await getNonce();
    expect(nonce).toBe("test-nonce-123");
  });

  it("should return undefined when x-nonce header is missing", async () => {
    const { headers } = await import("next/headers");
    vi.mocked(headers).mockResolvedValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    const { getNonce } = await import("@/lib/csp/get-nonce");
    const nonce = await getNonce();
    expect(nonce).toBeUndefined();
  });
});
