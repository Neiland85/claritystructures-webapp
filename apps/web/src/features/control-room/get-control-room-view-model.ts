import { controlRoomDemoViewModel } from "./control-room-demo-data";
import type { ControlRoomViewModel } from "./control-room-view-model";

export type ControlRoomViewModelResolution = {
  caseId: string;
  viewModel: ControlRoomViewModel;
  source: "fixture";
};

export async function getControlRoomViewModel(
  caseId: string,
): Promise<ControlRoomViewModelResolution> {
  return {
    caseId,
    viewModel: controlRoomDemoViewModel,
    source: "fixture",
  };
}
