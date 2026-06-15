import { describe, expect, it } from "vitest";

import { getControlRoomViewModel } from "../get-control-room-view-model";
import {
  requiredControlRoomSourceAdapterCapabilities,
  type ControlRoomSourceAdapterContract,
} from "../control-room-source-adapter";

describe("getControlRoomViewModel", () => {
  it("resolves a governed case file through the default source adapter", async () => {
    const result = await getControlRoomViewModel("EV-2026-DEMO");

    expect(result).toMatchObject({
      caseId: "EV-2026-DEMO",
      source: "in-memory",
      status: "found",
      resolvedCaseRef: "EV-2026-DEMO",
    });

    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
  });

  it("returns a controlled fallback when the case id is not found", async () => {
    const result = await getControlRoomViewModel("future-real-case");

    expect(result).toMatchObject({
      caseId: "future-real-case",
      source: "in-memory",
      status: "not_found",
    });

    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
  });

  it("returns a controlled fallback when access is blocked", async () => {
    const adapter: ControlRoomSourceAdapterContract = {
      kind: "file",
      capabilities: requiredControlRoomSourceAdapterCapabilities,
      repository: {
        async findByCaseId(caseId) {
          return {
            status: "blocked",
            caseId,
            reason: "Policy gate blocks this governed case source.",
          };
        },
      },
    };

    const result = await getControlRoomViewModel("blocked-case", adapter);

    expect(result).toMatchObject({
      caseId: "blocked-case",
      source: "file",
      status: "blocked",
      reason: "Policy gate blocks this governed case source.",
    });

    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
  });

  it("returns a controlled fallback when the adapter source is unavailable", async () => {
    const adapter: ControlRoomSourceAdapterContract = {
      kind: "api",
      capabilities: requiredControlRoomSourceAdapterCapabilities,
      repository: {
        async findByCaseId(caseId) {
          return {
            status: "unavailable",
            caseId,
            reason: "Source adapter is unavailable.",
          };
        },
      },
    };

    const result = await getControlRoomViewModel("unavailable-case", adapter);

    expect(result).toMatchObject({
      caseId: "unavailable-case",
      source: "api",
      status: "unavailable",
      reason: "Source adapter is unavailable.",
    });

    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
  });
});
