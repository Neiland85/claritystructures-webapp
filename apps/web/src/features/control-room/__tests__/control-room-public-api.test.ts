import { describe, expect, it } from "vitest";

import {
  assertControlRoomSourceAdapterContract,
  requiredControlRoomSourceAdapterCapabilities,
  resolveControlRoomCaseThroughAdapter,
} from "../index";

describe("Control Room public feature API", () => {
  it("exports the real source adapter contract boundary", () => {
    expect(assertControlRoomSourceAdapterContract).toBeTypeOf("function");
    expect(resolveControlRoomCaseThroughAdapter).toBeTypeOf("function");
    expect(requiredControlRoomSourceAdapterCapabilities).toEqual([
      "resolve_case",
      "preserve_status",
      "explain_failure",
      "avoid_silent_fallback",
    ]);
  });
});
