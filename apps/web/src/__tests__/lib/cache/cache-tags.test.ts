import { describe, it, expect, vi } from "vitest";
import { CacheTags } from "@/lib/cache/tags";

// Mock next/cache (used by unstable-cache.ts)
vi.mock("next/cache", () => ({
  unstable_cache: vi.fn((fn: Function) => fn),
}));

import { CacheConfig } from "@/lib/cache/unstable-cache";

describe("CacheTags", () => {
  describe("intakes", () => {
    it("should have 'intakes' as the all tag", () => {
      expect(CacheTags.intakes.all).toBe("intakes");
    });

    it("should produce byId tag", () => {
      expect(CacheTags.intakes.byId("abc-123")).toBe("intake:abc-123");
    });

    it("should produce byStatus tag", () => {
      expect(CacheTags.intakes.byStatus("pending")).toBe(
        "intakes:status:pending",
      );
    });

    it("should produce byPriority tag", () => {
      expect(CacheTags.intakes.byPriority("high")).toBe(
        "intakes:priority:high",
      );
    });
  });

  describe("settings", () => {
    it("should have 'settings' as the all tag", () => {
      expect(CacheTags.settings.all).toBe("settings");
    });

    it("should produce byKey tag", () => {
      expect(CacheTags.settings.byKey("theme")).toBe("setting:theme");
    });
  });
});

describe("CacheConfig", () => {
  it("should have static config (1 hour)", () => {
    expect(CacheConfig.static.revalidate).toBe(3600);
  });

  it("should have dynamic config (5 minutes)", () => {
    expect(CacheConfig.dynamic.revalidate).toBe(300);
  });

  it("should have realtime config (no cache)", () => {
    expect(CacheConfig.realtime.revalidate).toBe(0);
  });

  it("should have longTerm config (1 day)", () => {
    expect(CacheConfig.longTerm.revalidate).toBe(86400);
  });
});
