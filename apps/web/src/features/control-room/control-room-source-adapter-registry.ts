import { inMemoryControlRoomCaseRepository } from "./control-room-case-repository";
import {
  requiredControlRoomSourceAdapterCapabilities,
  type ControlRoomSourceAdapterContract,
} from "./control-room-source-adapter";

export type ControlRoomSourceAdapterOverride = ControlRoomSourceAdapterContract;

export const inMemoryControlRoomSourceAdapter = {
  kind: "in-memory",
  capabilities: requiredControlRoomSourceAdapterCapabilities,
  repository: inMemoryControlRoomCaseRepository,
} as const satisfies ControlRoomSourceAdapterContract;

export function getControlRoomSourceAdapter(
  adapterOverride?: ControlRoomSourceAdapterOverride,
): ControlRoomSourceAdapterContract {
  return adapterOverride ?? inMemoryControlRoomSourceAdapter;
}
