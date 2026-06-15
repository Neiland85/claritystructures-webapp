import { describe, expect, it } from "vitest";

import { inMemoryControlRoomCaseRepository } from "../control-room-case-repository";

describe("inMemoryControlRoomCaseRepository", () => {
  it("returns a governed case file when the case id exists", async () => {
    const result =
      await inMemoryControlRoomCaseRepository.findByCaseId("EV-2026-DEMO");

    expect(result.status).toBe("found");

    if (result.status === "found") {
      expect(result.caseFile.caseRef).toBe("EV-2026-DEMO");
    }
  });

  it("returns a controlled not_found result when the case id does not exist", async () => {
    const result =
      await inMemoryControlRoomCaseRepository.findByCaseId("future-real-case");

    expect(result).toEqual({
      status: "not_found",
      caseId: "future-real-case",
    });
  });
});
