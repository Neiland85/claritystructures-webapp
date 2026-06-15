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

export const inMemoryControlRoomCaseRepository: ControlRoomCaseRepository = {
  async findByCaseId(caseId: string): Promise<ControlRoomCaseSourceResult> {
    const caseFile = inMemoryCaseFiles.get(caseId);

    if (!caseFile) {
      return {
        status: "not_found",
        caseId,
      };
    }

    return {
      status: "found",
      caseFile,
    };
  },
};
