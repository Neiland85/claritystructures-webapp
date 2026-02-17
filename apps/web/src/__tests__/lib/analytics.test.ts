import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { FunnelEvent } from "@claritystructures/types";

// Mock the consent module so we can control hasAnalyticalConsent
vi.mock("@/lib/consent", () => ({
  hasAnalyticalConsent: vi.fn(() => true),
}));

import { hasAnalyticalConsent } from "@/lib/consent";

describe("trackEvent", () => {
  const mockCapture = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.mocked(hasAnalyticalConsent).mockReturnValue(true);
    // Simulate browser environment
    (globalThis as any).window = {
      posthog: { capture: mockCapture },
    };
  });

  afterEach(() => {
    delete (globalThis as any).window;
    vi.restoreAllMocks();
  });

  it("should call posthog.capture with event data when consent given", async () => {
  it("should call posthog.capture with event data", async () => {
    const { trackEvent } = await import("@/lib/analytics");
    const event: FunnelEvent = {
      name: "contact.submit_success",
      payload: { step: "1" },
      requestId: "req-123",
      timestamp: Date.now(),
    };

    trackEvent(event);

    expect(mockCapture).toHaveBeenCalledWith("contact.submit_success", {
      step: "1",
      requestId: "req-123",
      timestamp: expect.any(Number),
    });
  });

  it("should not track when analytical consent is not given", async () => {
    vi.mocked(hasAnalyticalConsent).mockReturnValue(false);
    const { trackEvent } = await import("@/lib/analytics");

    trackEvent({
      name: "funnel.view",
      payload: {},
      requestId: "req-789",
      timestamp: Date.now(),
    });

    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("should not throw when posthog is not available", async () => {
    (globalThis as any).window = {};
    const { trackEvent } = await import("@/lib/analytics");

    expect(() =>
      trackEvent({
        name: "funnel.view",
        payload: {},
        requestId: "req-456",
        timestamp: Date.now(),
      }),
    ).not.toThrow();
  });

  it("should return early in server context (no window)", async () => {
    delete (globalThis as any).window;
    const { trackEvent } = await import("@/lib/analytics");

    expect(() =>
      trackEvent({
        name: "wizard.step_view",
        timestamp: Date.now(),
      }),
    ).not.toThrow();
    expect(mockCapture).not.toHaveBeenCalled();
  });
});
