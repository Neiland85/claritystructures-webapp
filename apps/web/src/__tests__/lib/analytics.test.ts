import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { FunnelEvent } from "@claritystructures/types";

describe("trackEvent", () => {
  const mockCapture = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    // Simulate browser environment
    (globalThis as any).window = {
      posthog: { capture: mockCapture },
    };
  });

  afterEach(() => {
    delete (globalThis as any).window;
    vi.restoreAllMocks();
  });

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
