import { describe, expect, it } from "vitest";

import type { ControlRoomCaseRepository } from "../control-room-case-repository";
import { getControlRoomViewModel } from "../get-control-room-view-model";

describe("getControlRoomViewModel", () => {
  it("resolves a governed case file through the in-memory repository", async () => {
    const result = await getControlRoomViewModel("EV-2026-DEMO");

    expect(result.caseId).toBe("EV-2026-DEMO");
    expect(result.source).toBe("in-memory");
    expect(result.status).toBe("found");
    expect(result.resolvedCaseRef).toBe("EV-2026-DEMO");
    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
    expect(result.viewModel.readiness.length).toBeGreaterThan(0);
  });

  it("returns a controlled fallback when the case id is not found", async () => {
    const result = await getControlRoomViewModel("future-real-case");

    expect(result.caseId).toBe("future-real-case");
    expect(result.source).toBe("in-memory");
    expect(result.status).toBe("not_found");
    expect(result.reason).toContain("future-real-case");
    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
  });

  it("returns a controlled fallback when access is blocked", async () => {
    const repository: ControlRoomCaseRepository = {
      async findByCaseId(caseId) {
        return {
          status: "blocked",
          caseId,
          reason: "Policy gate blocks this governed case file.",
        };
      },
    };

    const result = await getControlRoomViewModel("blocked-case", repository);

    expect(result.status).toBe("blocked");
    expect(result.reason).toBe("Policy gate blocks this governed case file.");
    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
  });

  it("returns a controlled fallback when the repository is unavailable", async () => {
    const repository: ControlRoomCaseRepository = {
      async findByCaseId(caseId) {
        return {
          status: "unavailable",
          caseId,
          reason: "Repository cannot answer safely.",
        };
      },
    };

    const result = await getControlRoomViewModel(
      "unavailable-case",
      repository,
    );

    expect(result.status).toBe("unavailable");
    expect(result.reason).toBe("Repository cannot answer safely.");
    expect(result.viewModel.caseRef).toBe("EV-2026-DEMO");
  });
});
