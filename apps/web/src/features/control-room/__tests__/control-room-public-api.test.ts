import { describe, expect, it } from "vitest";

import type { ControlRoomViewModelSourceOptions } from "../index";

import {
  assertControlRoomSourceAdapterContract,
  defaultControlRoomFileSourceAdapterOptions,
  getControlRoomSourceAdapter,
  inMemoryControlRoomSourceAdapter,
  requiredControlRoomSourceAdapterCapabilities,
  resolveControlRoomCaseThroughAdapter,
} from "../index";

describe("Control Room public API", () => {
  it("exports governed source adapter primitives", () => {
    expect(assertControlRoomSourceAdapterContract).toBeTypeOf("function");
    expect(resolveControlRoomCaseThroughAdapter).toBeTypeOf("function");
    expect(getControlRoomSourceAdapter).toBeTypeOf("function");
    const sourceOptions = {
      selection: "file",
    } satisfies ControlRoomViewModelSourceOptions;
    expect(sourceOptions.selection).toBe("file");
    expect(
      defaultControlRoomFileSourceAdapterOptions.fixtureDirectory,
    ).toContain(
      "apps/web/src/features/control-room/__fixtures__/file-source-adapter",
    );

    expect(inMemoryControlRoomSourceAdapter).toMatchObject({
      kind: "in-memory",
    });

    expect(requiredControlRoomSourceAdapterCapabilities).toEqual([
      "resolve_case",
      "preserve_status",
      "explain_failure",
      "avoid_silent_fallback",
    ]);
  });
});
