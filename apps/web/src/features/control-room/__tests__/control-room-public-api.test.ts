import { describe, expect, it } from "vitest";

import {
  assertControlRoomSourceAdapterContract,
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
