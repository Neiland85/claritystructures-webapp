import { useMemo } from "react";

import {
  listCanonicalSignalsForAnswers,
  resolveAllSnippets,
  type CanonicalSignal,
  type ResolvedWizardSnippet,
  type WizardAnswerMap,
} from "@claritystructures/domain";

import {
  toWizardAnswerMap,
  type WizardUiAnswerState,
} from "@/lib/wizard-contracts/wizard-answer-adapter";

export type WizardContractContext = {
  readonly answers: WizardAnswerMap;
  readonly signals: readonly CanonicalSignal[];
  readonly snippets: readonly ResolvedWizardSnippet[];
  readonly hasCriticalSignal: boolean;
  readonly hasLegalDerivationSignal: boolean;
  readonly hasEvidenceVolatilitySignal: boolean;
  readonly hasCredentialCompromiseSignal: boolean;
  readonly hasPhysicalSafetySignal: boolean;
  readonly hasSensitivePrivacySignal: boolean;
};

function hasSignal(
  signals: readonly CanonicalSignal[],
  signal: CanonicalSignal,
): boolean {
  return signals.includes(signal);
}

export function deriveWizardContractContext(
  state: WizardUiAnswerState,
): WizardContractContext {
  const answers = toWizardAnswerMap(state);
  const signals = listCanonicalSignalsForAnswers(answers);
  const hasAnswers = Object.keys(answers).length > 0;
  const snippets = hasAnswers
    ? resolveAllSnippets({
        answers,
        signals,
      })
    : [];

  return {
    answers,
    signals,
    snippets,
    hasCriticalSignal: hasSignal(signals, "risk.critical"),
    hasLegalDerivationSignal: hasSignal(signals, "legal.derivation_candidate"),
    hasEvidenceVolatilitySignal: hasSignal(signals, "risk.evidence_volatility"),
    hasCredentialCompromiseSignal: hasSignal(
      signals,
      "risk.credential_compromise",
    ),
    hasPhysicalSafetySignal: hasSignal(signals, "risk.physical_safety"),
    hasSensitivePrivacySignal:
      hasSignal(signals, "privacy.high_sensitivity") ||
      hasSignal(signals, "privacy.personal_data"),
  };
}

export function useWizardContractContext(
  state: WizardUiAnswerState,
): WizardContractContext {
  return useMemo(() => deriveWizardContractContext(state), [state]);
}
