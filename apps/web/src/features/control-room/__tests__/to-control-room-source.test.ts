import { describe, expect, it } from "vitest";

import { governedCaseFileFixture } from "../../../../../../packages/domain/src/governed-casefile";
import { toControlRoomSource } from "../to-control-room-source";
import { toControlRoomViewModel } from "../to-control-room-view-model";

describe("toControlRoomSource", () => {
  it("maps a GovernedCaseFile into a ControlRoomSource", () => {
    const source = toControlRoomSource(governedCaseFileFixture);

    expect(source.caseRef).toBe(governedCaseFileFixture.caseRef);
    expect(source.title).toBe(governedCaseFileFixture.title);
    expect(source.allowedActions).toContain("persist_intake");
    expect(source.blockedActions[0]?.action).toBe("external_transfer");
    expect(source.privacyBoundary.title).toBe("Privacy boundary");
    expect(source.assuranceTrail.length).toBe(
      governedCaseFileFixture.assuranceTrail.length,
    );
  });

  it("feeds the existing Control Room view-model mapper", () => {
    const source = toControlRoomSource(governedCaseFileFixture);
    const viewModel = toControlRoomViewModel(source);

    expect(viewModel.caseRef).toBe("EV-2026-DEMO");
    expect(viewModel.governanceDecision.blocked).toContain("external_transfer");
    expect(viewModel.blockedActions[0]?.reason).toBe(
      "Missing active authorization record.",
    );
    expect(viewModel.readiness.some((item) => item.label === "Transfer")).toBe(
      true,
    );
  });
});
