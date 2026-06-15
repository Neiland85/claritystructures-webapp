import { controlRoomDemoViewModel } from "./control-room-demo-data";
import type { ControlRoomCaseSourceResult } from "./control-room-case-repository";
import {
  getControlRoomSourceAdapter,
  type ControlRoomSourceAdapterOverride,
} from "./control-room-source-adapter-registry";
import {
  resolveControlRoomCaseThroughAdapter,
  type ControlRoomSourceAdapterKind,
} from "./control-room-source-adapter";
import type { ControlRoomViewModel } from "./control-room-view-model";
import { toControlRoomSource } from "./to-control-room-source";
import { toControlRoomViewModel } from "./to-control-room-view-model";

export type ControlRoomViewModelResolution = {
  caseId: string;
  viewModel: ControlRoomViewModel;
  source: ControlRoomSourceAdapterKind;
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
  adapterOverride?: ControlRoomSourceAdapterOverride,
): Promise<ControlRoomViewModelResolution> {
  const adapter = getControlRoomSourceAdapter(adapterOverride);
  const result = await resolveControlRoomCaseThroughAdapter(adapter, caseId);

  if (result.status === "found") {
    const source = toControlRoomSource(result.caseFile);

    return {
      caseId,
      viewModel: toControlRoomViewModel(source),
      source: adapter.kind,
      status: "found",
      resolvedCaseRef: result.caseFile.caseRef,
    };
  }

  return {
    caseId,
    viewModel: controlRoomDemoViewModel,
    source: adapter.kind,
    status: result.status,
    reason: getControlledFallbackReason(result),
  };
}
