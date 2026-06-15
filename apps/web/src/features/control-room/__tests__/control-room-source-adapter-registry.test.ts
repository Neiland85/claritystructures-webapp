import { describe, expect, it } from "vitest";

import {
  defaultControlRoomFileSourceAdapterOptions,
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

    expect(getControlRoomSourceAdapter({ adapterOverride })).toBe(
      adapterOverride,
    );
  });

  it("selects the file source adapter through the governed registry", () => {
    const adapter = getControlRoomSourceAdapter({ selection: "file" });

    expect(adapter.kind).toBe("file");
    expect(adapter.capabilities).toEqual(
      requiredControlRoomSourceAdapterCapabilities,
    );
    expect(assertControlRoomSourceAdapterContract(adapter)).toBe(adapter);
  });

  it("keeps default file source options explicit and local", () => {
    expect(
      defaultControlRoomFileSourceAdapterOptions.fixtureDirectory,
    ).toContain(
      "apps/web/src/features/control-room/__fixtures__/file-source-adapter",
    );
  });
  it("does not activate the file source adapter unless explicitly selected", () => {
    const defaultAdapter = getControlRoomSourceAdapter();
    const fileAdapter = getControlRoomSourceAdapter({ selection: "file" });

    expect(defaultAdapter.kind).toBe("in-memory");
    expect(fileAdapter.kind).toBe("file");
    expect(defaultAdapter).not.toBe(fileAdapter);
  });
});
