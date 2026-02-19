import { describe, it, expect, vi, beforeEach } from "vitest";

// Set env vars BEFORE module loads so Redis client is created
vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://fake-redis.upstash.io");
vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "fake-token");

// Mock @upstash/redis
const mockPipeline = {
  zremrangebyscore: vi.fn(),
  zadd: vi.fn(),
  zcard: vi.fn(),
  expire: vi.fn(),
  exec: vi.fn(),
};

vi.mock("@upstash/redis", () => ({
  Redis: vi.fn().mockImplementation(() => ({
    pipeline: () => mockPipeline,
  })),
}));

describe("upstash rate limiter", () => {
  let checkRateLimit: typeof import("@/lib/rate-limit/upstash").checkRateLimit;
  let getIdentifier: typeof import("@/lib/rate-limit/upstash").getIdentifier;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    const mod = await import("@/lib/rate-limit/upstash");
    checkRateLimit = mod.checkRateLimit;
    getIdentifier = mod.getIdentifier;
  });

  describe("checkRateLimit", () => {
    it("should return success when count <= limit", async () => {
      mockPipeline.exec.mockResolvedValue([0, 1, 5, true]);
      const result = await checkRateLimit("user-1", 10, 10_000);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(5);
    });

    it("should return failure when count > limit", async () => {
      mockPipeline.exec.mockResolvedValue([0, 1, 11, true]);
      const result = await checkRateLimit("user-1", 10, 10_000);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should fail open when Redis throws", async () => {
      mockPipeline.exec.mockRejectedValue(new Error("Redis connection failed"));
      const result = await checkRateLimit("user-1", 10, 10_000);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(10);
    });

    it("should call pipeline with correct key and window", async () => {
      mockPipeline.exec.mockResolvedValue([0, 1, 3, true]);
      await checkRateLimit("ip:1.2.3.4", 10, 60_000);
      expect(mockPipeline.zremrangebyscore).toHaveBeenCalledWith(
        "rate-limit:ip:1.2.3.4",
        0,
        expect.any(Number),
      );
      expect(mockPipeline.expire).toHaveBeenCalledWith(
        "rate-limit:ip:1.2.3.4",
        60,
      );
    });
  });

  describe("getIdentifier", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const request = new Request("http://localhost", {
        headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
      });
      expect(getIdentifier(request)).toBe("1.2.3.4");
    });

    it("should return 'unknown' when no forwarded header", () => {
      const request = new Request("http://localhost");
      expect(getIdentifier(request)).toBe("unknown");
    });
  });
});
