import {
  governedCaseFileFixture,
  type GovernedCaseFile,
} from "../../../../../packages/domain/src/governed-casefile";

export type ControlRoomCaseSourceResult =
  | { status: "found"; caseFile: GovernedCaseFile }
  | { status: "not_found"; caseId: string }
  | { status: "blocked"; caseId: string; reason: string }
  | { status: "unavailable"; caseId: string; reason: string };

export interface ControlRoomCaseRepository {
  findByCaseId(caseId: string): Promise<ControlRoomCaseSourceResult>;
}

const inMemoryCaseFiles = new Map<string, GovernedCaseFile>([
  [governedCaseFileFixture.caseRef, governedCaseFileFixture],
]);

const blockedCaseIds = new Set(["blocked-case"]);
const unavailableCaseIds = new Set(["unavailable-case"]);

export const inMemoryControlRoomCaseRepository: ControlRoomCaseRepository = {
  async findByCaseId(caseId: string): Promise<ControlRoomCaseSourceResult> {
    const caseFile = inMemoryCaseFiles.get(caseId);

    if (caseFile) {
      return {
        status: "found",
        caseFile,
      };
    }

    if (blockedCaseIds.has(caseId)) {
      return {
        status: "blocked",
        caseId,
        reason: "Demo policy gate blocks exposure of this governed case file.",
      };
    }

    if (unavailableCaseIds.has(caseId)) {
      return {
        status: "unavailable",
        caseId,
        reason: "Demo source adapter cannot answer this case safely.",
      };
    }

    return {
      status: "not_found",
      caseId,
    };
  },
};
