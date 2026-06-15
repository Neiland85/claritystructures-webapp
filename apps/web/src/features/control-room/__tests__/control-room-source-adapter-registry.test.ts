import { describe, expect, it } from "vitest";

import {
  getControlRoomSourceAdapter,
  inMemoryControlRoomSourceAdapter,
} from "../control-room-source-adapter-registry";
import {
  assertControlRoomSourceAdapterContract,
  requiredControlRoomSourceAdapterCapabilities,
  type ControlRoomSourceAdapterContract,
} from "../control-room-source-adapter";

describe("Control Room source adapter registry", () => {
  it("returns the governed in-memory source adapter by default", () => {
    const adapter = getControlRoomSourceAdapter();

    expect(adapter).toBe(inMemoryControlRoomSourceAdapter);
    expect(adapter.kind).toBe("in-memory");
    expect(adapter.capabilities).toEqual(
      requiredControlRoomSourceAdapterCapabilities,
    );
    expect(assertControlRoomSourceAdapterContract(adapter)).toBe(adapter);
  });

  it("allows tests to inject a complete governed adapter override", () => {
    const adapterOverride: ControlRoomSourceAdapterContract = {
      kind: "file",
      capabilities: requiredControlRoomSourceAdapterCapabilities,
      repository: {
        async findByCaseId(caseId) {
          return {
            status: "not_found",
            caseId,
          };
        },
      },
    };

    expect(getControlRoomSourceAdapter(adapterOverride)).toBe(adapterOverride);
  });
});
