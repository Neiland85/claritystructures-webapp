import { describe, expect, it } from "vitest";

import { getControlRoomResolutionStatusCopy } from "../control-room-resolution-status";

describe("getControlRoomResolutionStatusCopy", () => {
  it("describes a resolved governed case source", () => {
    const copy = getControlRoomResolutionStatusCopy({
      caseId: "EV-2026-DEMO",
      status: "found",
      resolvedCaseRef: "EV-2026-DEMO",
    });

    expect(copy.eyebrow).toBe("CONTROL ROOM SOURCE");
    expect(copy.title).toBe("Case source resolved");
    expect(copy.message).toContain("EV-2026-DEMO");
  });

  it("describes a controlled not_found fallback", () => {
    const copy = getControlRoomResolutionStatusCopy({
      caseId: "future-real-case",
      status: "not_found",
      reason: "No governed case file exists for case id future-real-case.",
    });

    expect(copy.eyebrow).toBe("CONTROLLED FALLBACK");
    expect(copy.title).toBe("Case id not found");
    expect(copy.message).toContain("future-real-case");
  });

  it("describes a controlled blocked fallback", () => {
    const copy = getControlRoomResolutionStatusCopy({
      caseId: "blocked-case",
      status: "blocked",
      reason: "Policy gate blocks this governed case file.",
    });

    expect(copy.title).toBe("Access blocked by policy gate");
    expect(copy.message).toBe("Policy gate blocks this governed case file.");
  });

  it("describes a controlled unavailable fallback", () => {
    const copy = getControlRoomResolutionStatusCopy({
      caseId: "unavailable-case",
      status: "unavailable",
      reason: "Repository cannot answer safely.",
    });

    expect(copy.title).toBe("Source unavailable");
    expect(copy.message).toBe("Repository cannot answer safely.");
  });
});
