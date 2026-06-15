import { describe, expect, it } from "vitest";

import { getControlRoomViewModel } from "../get-control-room-view-model";

describe("getControlRoomViewModel", () => {
  it("resolves a fixture-backed Control Room view model for a case id", async () => {
    const result = await getControlRoomViewModel("EV-2026-DEMO");

    expect(result.caseId).toBe("EV-2026-DEMO");
    expect(result.source).toBe("fixture");
    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
    expect(result.viewModel.readiness.length).toBeGreaterThan(0);
  });

  it("keeps route identity separate from the current fixture reference", async () => {
    const result = await getControlRoomViewModel("future-real-case");

    expect(result.caseId).toBe("future-real-case");
    expect(result.source).toBe("fixture");
    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
  });
});
