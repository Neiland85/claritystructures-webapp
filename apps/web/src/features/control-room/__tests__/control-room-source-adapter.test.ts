import { describe, expect, it } from "vitest";

import type { ControlRoomCaseRepository } from "../control-room-case-repository";
import {
  assertControlRoomSourceAdapterContract,
  requiredControlRoomSourceAdapterCapabilities,
  resolveControlRoomCaseThroughAdapter,
  type ControlRoomSourceAdapterContract,
} from "../control-room-source-adapter";

describe("Control Room source adapter contract", () => {
  const repository: ControlRoomCaseRepository = {
    async findByCaseId(caseId) {
      return {
        status: "not_found",
        caseId,
      };
    },
  };

  it("requires every adapter capability needed for observable fallback", () => {
    expect(requiredControlRoomSourceAdapterCapabilities).toEqual([
      "resolve_case",
      "preserve_status",
      "explain_failure",
      "avoid_silent_fallback",
    ]);
  });

  it("accepts a complete source adapter contract", () => {
    const adapter: ControlRoomSourceAdapterContract = {
      kind: "file",
      capabilities: requiredControlRoomSourceAdapterCapabilities,
      repository,
    };

    expect(assertControlRoomSourceAdapterContract(adapter)).toBe(adapter);
  });

  it("rejects adapters that cannot explain failure", () => {
    const adapter: ControlRoomSourceAdapterContract = {
      kind: "api",
      capabilities: [
        "resolve_case",
        "preserve_status",
        "avoid_silent_fallback",
      ],
      repository,
    };

    expect(() => assertControlRoomSourceAdapterContract(adapter)).toThrow(
      "explain_failure",
    );
  });

  it("resolves cases only through the repository seam", async () => {
    const adapter: ControlRoomSourceAdapterContract = {
      kind: "database",
      capabilities: requiredControlRoomSourceAdapterCapabilities,
      repository,
    };

    await expect(
      resolveControlRoomCaseThroughAdapter(adapter, "future-real-case"),
    ).resolves.toEqual({
      status: "not_found",
      caseId: "future-real-case",
    });
  });
});
