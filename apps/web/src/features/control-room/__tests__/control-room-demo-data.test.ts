import { describe, expect, it } from "vitest";

import {
  controlRoomDemoSource,
  controlRoomDemoViewModel,
} from "../control-room-demo-data";

describe("controlRoomDemoData", () => {
  it("renders the demo from the governed case-file domain fixture chain", () => {
    expect(controlRoomDemoSource.caseRef).toBe("EV-2026-DEMO");
    expect(controlRoomDemoViewModel.caseRef).toBe("EV-2026-DEMO");
    expect(controlRoomDemoSource.blockedActions[0]?.action).toBe(
      "external_transfer",
    );
    expect(controlRoomDemoViewModel.blockedActions[0]?.action).toBe(
      "external_transfer",
    );
  });

  it("keeps the route demo static while using the real mapper chain", () => {
    expect(controlRoomDemoSource.assuranceTrail.length).toBeGreaterThan(0);
    expect(controlRoomDemoViewModel.readiness.length).toBeGreaterThan(0);
    expect(controlRoomDemoViewModel.privacyBoundary.title).toBe(
      "Privacy boundary",
    );
  });
});
