import { describe, expect, it } from "vitest";

import {
  canonicalControlRoomDemoCaseId,
  canonicalControlRoomDemoCasePath,
} from "../control-room-demo-route";

describe("canonical Control Room demo route", () => {
  it("points the legacy demo route at the governed dynamic case route", () => {
    expect(canonicalControlRoomDemoCaseId).toBe("EV-2026-DEMO");
    expect(canonicalControlRoomDemoCasePath).toBe(
      "/control/cases/EV-2026-DEMO",
    );
  });
});
