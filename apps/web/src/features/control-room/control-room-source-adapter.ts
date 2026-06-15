import type {
  ControlRoomCaseRepository,
  ControlRoomCaseSourceResult,
} from "./control-room-case-repository";

export type ControlRoomSourceAdapterKind =
  | "in-memory"
  | "file"
  | "api"
  | "database";

export type ControlRoomSourceAdapterCapability =
  | "resolve_case"
  | "preserve_status"
  | "explain_failure"
  | "avoid_silent_fallback";

export type ControlRoomSourceAdapterContract = {
  kind: ControlRoomSourceAdapterKind;
  capabilities: readonly ControlRoomSourceAdapterCapability[];
  repository: ControlRoomCaseRepository;
};

export const requiredControlRoomSourceAdapterCapabilities = [
  "resolve_case",
  "preserve_status",
  "explain_failure",
  "avoid_silent_fallback",
] as const satisfies readonly ControlRoomSourceAdapterCapability[];

export function assertControlRoomSourceAdapterContract(
  adapter: ControlRoomSourceAdapterContract,
): ControlRoomSourceAdapterContract {
  for (const capability of requiredControlRoomSourceAdapterCapabilities) {
    if (!adapter.capabilities.includes(capability)) {
      throw new Error(
        `Control Room source adapter is missing required capability: ${capability}`,
      );
    }
  }

  return adapter;
}

export async function resolveControlRoomCaseThroughAdapter(
  adapter: ControlRoomSourceAdapterContract,
  caseId: string,
): Promise<ControlRoomCaseSourceResult> {
  const governedAdapter = assertControlRoomSourceAdapterContract(adapter);

  return governedAdapter.repository.findByCaseId(caseId);
}
