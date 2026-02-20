import type { WizardResult } from "../wizard-result";

/**
 * Shared helper to create a complete WizardResult for testing.
 * Provides sensible defaults for all required fields.
 */
export function baseWizard(
  overrides: Partial<WizardResult> = {},
): WizardResult {
  return {
    urgency: "informational",
    clientProfile: "private_individual",
    hasEmotionalDistress: false,
    incident: "test incident",
    devices: 0,
    actionsTaken: [],
    evidenceSources: [],
    objective: "test objective",
    ...overrides,
  };
}
