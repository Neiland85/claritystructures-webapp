import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const { mockTrackEvent } = vi.hoisted(() => ({
  mockTrackEvent: vi.fn(),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: mockTrackEvent,
}));

// Import after mock
import FunnelTracker from "@/components/FunnelTracker";

describe("FunnelTracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "location", {
      value: { pathname: "/es/contact" },
      writable: true,
    });
  });

  it("should call trackEvent with funnel.view on mount", () => {
    render(<FunnelTracker />);

    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "funnel.view",
      }),
    );
  });

  it("should include the current path in the payload", () => {
    render(<FunnelTracker />);

    const call = mockTrackEvent.mock.calls[0][0];
    expect(call.payload.path).toBe("/es/contact");
    expect(call.timestamp).toEqual(expect.any(Number));
  });
});
