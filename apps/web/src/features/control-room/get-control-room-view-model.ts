import {
  inMemoryControlRoomCaseRepository,
  type ControlRoomCaseRepository,
  type ControlRoomCaseSourceResult,
} from "./control-room-case-repository";
import { controlRoomDemoViewModel } from "./control-room-demo-data";
import type { ControlRoomViewModel } from "./control-room-view-model";
import { toControlRoomSource } from "./to-control-room-source";
import { toControlRoomViewModel } from "./to-control-room-view-model";

export type ControlRoomViewModelResolution = {
  caseId: string;
  viewModel: ControlRoomViewModel;
  source: "in-memory";
  status: ControlRoomCaseSourceResult["status"];
  reason?: string;
  resolvedCaseRef?: string;
};

function getControlledFallbackReason(
  result: Exclude<ControlRoomCaseSourceResult, { status: "found" }>,
): string | undefined {
  if (result.status === "not_found") {
    return `No governed case file exists for case id ${result.caseId}.`;
  }

  return result.reason;
}

export async function getControlRoomViewModel(
  caseId: string,
  repository: ControlRoomCaseRepository = inMemoryControlRoomCaseRepository,
): Promise<ControlRoomViewModelResolution> {
  const result = await repository.findByCaseId(caseId);

  if (result.status === "found") {
    const source = toControlRoomSource(result.caseFile);

    return {
      caseId,
      viewModel: toControlRoomViewModel(source),
      source: "in-memory",
      status: "found",
      resolvedCaseRef: result.caseFile.caseRef,
    };
  }

  return {
    caseId,
    viewModel: controlRoomDemoViewModel,
    source: "in-memory",
    status: result.status,
    reason: getControlledFallbackReason(result),
  };
}
