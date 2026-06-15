import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  assertControlRoomSourceAdapterContract,
  resolveControlRoomCaseThroughAdapter,
} from "../control-room-source-adapter";
import {
  createControlRoomFileSourceAdapter,
  createControlRoomFileSourceRepository,
} from "../file-source-adapter/control-room-file-source-adapter";

const fixtureDirectory = path.join(
  process.cwd(),
  "apps/web/src/features/control-room/__fixtures__/file-source-adapter",
);

describe("Control Room file source adapter", () => {
  it("implements the governed source adapter contract", () => {
    const adapter = createControlRoomFileSourceAdapter({ fixtureDirectory });

    expect(adapter.kind).toBe("file");
    expect(assertControlRoomSourceAdapterContract(adapter)).toBe(adapter);
  });

  it("resolves a governed case from a file-backed source", async () => {
    const adapter = createControlRoomFileSourceAdapter({ fixtureDirectory });

    await expect(
      resolveControlRoomCaseThroughAdapter(adapter, "EV-2026-DEMO"),
    ).resolves.toMatchObject({
      status: "found",
      caseFile: {
        caseRef: "EV-2026-DEMO",
      },
    });
  });

  it("preserves not_found when the file does not exist", async () => {
    const repository = createControlRoomFileSourceRepository({
      fixtureDirectory,
    });

    await expect(repository.findByCaseId("future-real-case")).resolves.toEqual({
      status: "not_found",
      caseId: "future-real-case",
    });
  });

  it("preserves blocked as an observable policy state", async () => {
    const repository = createControlRoomFileSourceRepository({
      fixtureDirectory,
    });

    await expect(repository.findByCaseId("blocked-case")).resolves.toEqual({
      status: "blocked",
      caseId: "blocked-case",
      reason:
        "File source adapter policy gate blocks exposure of this governed case file.",
    });
  });

  it("preserves unavailable as an observable source failure state", async () => {
    const repository = createControlRoomFileSourceRepository({
      fixtureDirectory,
    });

    await expect(repository.findByCaseId("unavailable-case")).resolves.toEqual({
      status: "unavailable",
      caseId: "unavailable-case",
      reason:
        "File source adapter cannot read the governed case source safely.",
    });
  });
});
