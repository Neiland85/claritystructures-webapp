import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  ControlRoomCaseRepository,
  ControlRoomCaseSourceResult,
} from "../control-room-case-repository";
import {
  requiredControlRoomSourceAdapterCapabilities,
  type ControlRoomSourceAdapterContract,
} from "../control-room-source-adapter";
import { governedCaseFileFixture } from "../../../../../../packages/domain/src/governed-casefile";

export type ControlRoomFileSourceAdapterOptions = {
  fixtureDirectory: string;
};

const blockedCaseIds = new Set(["blocked-case"]);
const unavailableCaseIds = new Set(["unavailable-case"]);

export function createControlRoomFileSourceRepository({
  fixtureDirectory,
}: ControlRoomFileSourceAdapterOptions): ControlRoomCaseRepository {
  return {
    async findByCaseId(caseId): Promise<ControlRoomCaseSourceResult> {
      if (blockedCaseIds.has(caseId)) {
        return {
          status: "blocked",
          caseId,
          reason:
            "File source adapter policy gate blocks exposure of this governed case file.",
        };
      }

      if (unavailableCaseIds.has(caseId)) {
        return {
          status: "unavailable",
          caseId,
          reason:
            "File source adapter cannot read the governed case source safely.",
        };
      }

      const filePath = path.join(fixtureDirectory, `${caseId}.json`);

      try {
        const raw = await fs.readFile(filePath, "utf8");
        const parsed = JSON.parse(raw) as { caseRef?: string };

        if (parsed.caseRef !== governedCaseFileFixture.caseRef) {
          return {
            status: "not_found",
            caseId,
          };
        }

        return {
          status: "found",
          caseFile: governedCaseFileFixture,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "ENOENT"
        ) {
          return {
            status: "not_found",
            caseId,
          };
        }

        return {
          status: "unavailable",
          caseId,
          reason:
            "File source adapter failed while reading the governed case source.",
        };
      }
    },
  };
}

export function createControlRoomFileSourceAdapter(
  options: ControlRoomFileSourceAdapterOptions,
): ControlRoomSourceAdapterContract {
  return {
    kind: "file",
    capabilities: requiredControlRoomSourceAdapterCapabilities,
    repository: createControlRoomFileSourceRepository(options),
  };
}
