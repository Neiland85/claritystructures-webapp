import { describe, expect, it } from "vitest";

import { controlRoomDemoViewModel } from "../control-room-demo-data";

describe("control case dynamic route contract", () => {
  it("can render a dynamic governed case route from the existing feature boundary", () => {
    expect(controlRoomDemoViewModel.caseRef).toBe("EV-2026-DEMO");
    expect(controlRoomDemoViewModel.readiness.length).toBeGreaterThan(0);
    expect(
      controlRoomDemoViewModel.governanceDecision.blocked.length,
    ).toBeGreaterThan(0);
  });
});
