import path from "node:path";

import { inMemoryControlRoomCaseRepository } from "./control-room-case-repository";
import {
  createControlRoomFileSourceAdapter,
  type ControlRoomFileSourceAdapterOptions,
} from "./file-source-adapter/control-room-file-source-adapter";
import {
  requiredControlRoomSourceAdapterCapabilities,
  type ControlRoomSourceAdapterContract,
} from "./control-room-source-adapter";

export type ControlRoomSourceAdapterSelection = "in-memory" | "file";

export type ControlRoomSourceAdapterOverride = ControlRoomSourceAdapterContract;

export type ControlRoomSourceAdapterRegistryOptions = {
  selection?: ControlRoomSourceAdapterSelection;
  adapterOverride?: ControlRoomSourceAdapterOverride;
  fileSourceOptions?: ControlRoomFileSourceAdapterOptions;
};

export const inMemoryControlRoomSourceAdapter = {
  kind: "in-memory",
  capabilities: requiredControlRoomSourceAdapterCapabilities,
  repository: inMemoryControlRoomCaseRepository,
} as const satisfies ControlRoomSourceAdapterContract;

export const defaultControlRoomFileSourceAdapterOptions = {
  fixtureDirectory: path.join(
    process.cwd(),
    "apps/web/src/features/control-room/__fixtures__/file-source-adapter",
  ),
} as const satisfies ControlRoomFileSourceAdapterOptions;

export function getControlRoomSourceAdapter(
  options: ControlRoomSourceAdapterRegistryOptions = {},
): ControlRoomSourceAdapterContract {
  if (options.adapterOverride) {
    return options.adapterOverride;
  }

  if (options.selection === "file") {
    return createControlRoomFileSourceAdapter(
      options.fileSourceOptions ?? defaultControlRoomFileSourceAdapterOptions,
    );
  }

  return inMemoryControlRoomSourceAdapter;
}
