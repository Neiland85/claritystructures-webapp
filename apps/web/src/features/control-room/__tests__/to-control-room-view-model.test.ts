import { describe, expect, it } from "vitest";

import { controlRoomDemoSource } from "../control-room-demo-data";
import { toControlRoomViewModel } from "../to-control-room-view-model";

describe("toControlRoomViewModel", () => {
  it("maps a controlled source into a ControlRoomViewModel", () => {
    const viewModel = toControlRoomViewModel(controlRoomDemoSource);

    expect(viewModel.caseRef).toBe(controlRoomDemoSource.caseRef);
    expect(viewModel.title).toBe(controlRoomDemoSource.title);
    expect(viewModel.readiness.length).toBe(
      controlRoomDemoSource.readiness.length,
    );
    expect(viewModel.governanceDecision.blocked).toEqual(
      controlRoomDemoSource.governanceDecision.blocked,
    );
    expect(viewModel.blockedActions[0]?.action).toBe(
      controlRoomDemoSource.blockedActions[0]?.action,
    );
    expect(viewModel.privacyBoundary.title).toBe(
      controlRoomDemoSource.privacyBoundary.title,
    );
  });

  it("does not expose source arrays by reference", () => {
    const viewModel = toControlRoomViewModel(controlRoomDemoSource);

    expect(viewModel.allowedActions).not.toBe(
      controlRoomDemoSource.allowedActions,
    );
    expect(viewModel.governanceDecision.allowed).not.toBe(
      controlRoomDemoSource.governanceDecision.allowed,
    );
    expect(viewModel.governanceDecision.blocked).not.toBe(
      controlRoomDemoSource.governanceDecision.blocked,
    );
  });
});
