import type { WizardResult } from "./wizard-result";

import type {
  DecisionExplanation,
  DecisionReason,
} from "./decision-explanation";
import { mapWizardToSignals } from "./map-wizard-to-signals";
import type {
  IntakeActionCode,
  IntakeFlag,
  IntakePriority,
  IntakeTone,
} from "./intake-records";

export const INTAKE_ROUTE_BY_TONE: Readonly<Record<IntakeTone, string>> = {
  basic: "/contact/basic",
  family: "/contact/family",
  legal: "/contact/legal",
  critical: "/contact/critical",
} as const;

export const DECISION_MODEL_VERSION = "decision-model/v1" as const;
export const DECISION_MODEL_VERSION_V1 = DECISION_MODEL_VERSION;
export const DECISION_MODEL_VERSION_V2 = "decision-model/v2" as const;

export type DecisionModelVersion =
  | typeof DECISION_MODEL_VERSION_V1
  | typeof DECISION_MODEL_VERSION_V2;

export type IntakeDecision = {
  route: string;
  priority: IntakePriority;
  flags: IntakeFlag[];
  actionCode: IntakeActionCode;
  decisionModelVersion: DecisionModelVersion;
};

type FrozenIntakeDecision = Readonly<{
  route: string;
  priority: IntakePriority;
  flags: ReadonlyArray<IntakeFlag>;
  actionCode: IntakeActionCode;
  decisionModelVersion: DecisionModelVersion;
}>;

type FrozenDecisionExplanation = Readonly<{
  reasons: ReadonlyArray<DecisionReason>;
  baselinePriority: IntakePriority;
  finalPriority: IntakePriority;
  modelVersion: DecisionModelVersion;
}>;

const PRIORITY_RANK: Readonly<Record<IntakePriority, number>> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
} as const;

const DECISION_REASONS: Readonly<Record<DecisionReason, true>> = {
  urgency_based_routing: true,
  client_profile_routing: true,
  family_conflict_flag: true,
  legal_professional_flag: true,
  active_procedure_flag: true,
  emotional_distress_flag: true,
  data_sensitivity_escalation: true,
  ongoing_incident_escalation: true,
  device_access_constraint: true,
  long_duration_exposure_hint: true,
  physical_safety_risk_flag: true,
  financial_risk_flag: true,
  access_compromised_flag: true,
  evidence_volatility_flag: true,
} as const;

function finalizeDecision(decision: IntakeDecision): IntakeDecision {
  const frozenDecision: FrozenIntakeDecision = {
    ...decision,
    flags: Object.freeze([...decision.flags]),
  };

  return Object.freeze(frozenDecision) as IntakeDecision;
}

function finalizeExplanation(
  explanation: DecisionExplanation,
): DecisionExplanation {
  const frozenExplanation: FrozenDecisionExplanation = {
    ...explanation,
    reasons: Object.freeze([...explanation.reasons]),
  };

  return Object.freeze(frozenExplanation) as DecisionExplanation;
}

function actionCodeFromPriority(priority: IntakePriority): IntakeActionCode {
  switch (priority) {
    case "critical":
      return "IMMEDIATE_HUMAN_CONTACT";
    case "high":
      return "PRIORITY_REVIEW_24_48H";
    case "medium":
      return "STANDARD_REVIEW";
    default:
      return "DEFERRED_INFORMATIONAL_RESPONSE";
  }
}

function maxPriority(
  left: IntakePriority,
  right: IntakePriority,
): IntakePriority {
  return PRIORITY_RANK[left] >= PRIORITY_RANK[right] ? left : right;
}

function buildDecisionExplanation(
  baseline: IntakeDecision,
  refined: IntakeDecision,
  result: WizardResult,
): DecisionExplanation {
  const reasons: DecisionReason[] = [];
  const isV2: boolean = isDecisionModelV2(refined);

  if (
    result.urgency === "critical" &&
    refined.route === INTAKE_ROUTE_BY_TONE.critical
  ) {
    reasons.push("urgency_based_routing");
  } else if (
    (result.clientProfile === "family_inheritance_conflict" &&
      refined.route === INTAKE_ROUTE_BY_TONE.family) ||
    ((result.clientProfile === "legal_professional" ||
      result.clientProfile === "court_related") &&
      refined.route === INTAKE_ROUTE_BY_TONE.legal)
  ) {
    reasons.push("client_profile_routing");
  }

  if (baseline.flags.includes("family_conflict")) {
    reasons.push("family_conflict_flag");
  }

  if (baseline.flags.includes("legal_professional")) {
    reasons.push("legal_professional_flag");
  }

  if (baseline.flags.includes("active_procedure")) {
    reasons.push("active_procedure_flag");
  }

  if (baseline.flags.includes("emotional_distress")) {
    reasons.push("emotional_distress_flag");
  }

  if (result.physicalSafetyRisk) {
    reasons.push("physical_safety_risk_flag");
  }

  if (result.financialAssetRisk) {
    reasons.push("financial_risk_flag");
  }

  if (result.attackerHasPasswords) {
    reasons.push("access_compromised_flag");
  }

  if (result.evidenceIsAutoDeleted) {
    reasons.push("evidence_volatility_flag");
  }

  if (isV2) {
    const signals = mapWizardToSignals(result);
    let refinedPriority: IntakePriority = baseline.priority;

    const pushEscalationReason = (
      nextPriority: IntakePriority,
      reason: Extract<
        DecisionReason,
        | "ongoing_incident_escalation"
        | "data_sensitivity_escalation"
        | "device_access_constraint"
      >,
    ): void => {
      if (nextPriority !== refinedPriority) {
        reasons.push(reason);
        refinedPriority = nextPriority;
      }
    };

    if (
      signals.exposureState === "active" &&
      baseline.priority !== "critical"
    ) {
      pushEscalationReason(
        maxPriority(refinedPriority, "high"),
        "ongoing_incident_escalation",
      );
    }

    if (
      result.dataSensitivityLevel === "high" &&
      (signals.riskLevel === "high" || signals.riskLevel === "imminent")
    ) {
      pushEscalationReason(
        maxPriority(refinedPriority, "critical"),
        "data_sensitivity_escalation",
      );
    }

    if (
      result.hasAccessToDevices === false &&
      signals.evidenceLevel === "messages_only" &&
      refinedPriority === "low"
    ) {
      pushEscalationReason(
        maxPriority(refinedPriority, "medium"),
        "device_access_constraint",
      );
    }

    if (
      result.estimatedIncidentStart === "weeks" ||
      result.estimatedIncidentStart === "months"
    ) {
      reasons.push("long_duration_exposure_hint");
    }
  }

  for (const reason of reasons) {
    const coveredReason: true = DECISION_REASONS[reason];
    void coveredReason;
  }

  return finalizeExplanation({
    reasons,
    baselinePriority: baseline.priority,
    finalPriority: refined.priority,
    modelVersion: refined.decisionModelVersion,
  });
}

/**
 * Decision model V2 keeps V1 as baseline and applies signal-based refinements
 * only when contextual signal fields provide additional, meaningful context.
 */
function applySignalRefinements(
  baseline: IntakeDecision,
  result: WizardResult,
): IntakeDecision {
  const signals = mapWizardToSignals(result);

  const usesRefinedSignalInputs: boolean =
    result.dataSensitivityLevel === "high" ||
    result.isOngoing === true ||
    result.hasAccessToDevices === false ||
    result.estimatedIncidentStart === "weeks" ||
    result.estimatedIncidentStart === "months" ||
    result.physicalSafetyRisk === true ||
    result.financialAssetRisk === true ||
    result.attackerHasPasswords === true ||
    result.evidenceIsAutoDeleted === true;

  if (!usesRefinedSignalInputs) {
    return baseline;
  }

  let refinedPriority: IntakePriority = baseline.priority;

  if (signals.exposureState === "active" && baseline.priority !== "critical") {
    refinedPriority = maxPriority(refinedPriority, "high");
  }

  if (
    result.dataSensitivityLevel === "high" &&
    (signals.riskLevel === "high" || signals.riskLevel === "imminent")
  ) {
    refinedPriority = maxPriority(refinedPriority, "critical");
  }

  if (
    result.hasAccessToDevices === false &&
    signals.evidenceLevel === "messages_only" &&
    refinedPriority === "low"
  ) {
    refinedPriority = maxPriority(refinedPriority, "medium");
  }

  if (result.physicalSafetyRisk) {
    refinedPriority = "critical";
  }

  if (result.financialAssetRisk || result.attackerHasPasswords) {
    refinedPriority = maxPriority(refinedPriority, "high");
  }

  return finalizeDecision({
    ...baseline,
    priority: refinedPriority,
    actionCode: actionCodeFromPriority(refinedPriority),
  });
}

export function decideIntake(result: WizardResult): IntakeDecision {
  let score: number = 0;
  const flags: IntakeFlag[] = [];

  let route: string = INTAKE_ROUTE_BY_TONE.basic;

  if (result.urgency === "critical") {
    route = INTAKE_ROUTE_BY_TONE.critical;
  } else if (result.clientProfile === "family_inheritance_conflict") {
    route = INTAKE_ROUTE_BY_TONE.family;
  } else if (
    result.clientProfile === "legal_professional" ||
    result.clientProfile === "court_related"
  ) {
    route = INTAKE_ROUTE_BY_TONE.legal;
  }

  if (result.clientProfile === "family_inheritance_conflict") {
    score += 3;
    flags.push("family_conflict");
  }

  if (result.clientProfile === "court_related") {
    score += 4;
    flags.push("active_procedure");
  }

  if (result.clientProfile === "legal_professional") {
    score += 2;
    flags.push("legal_professional");
  }

  if (result.urgency === "time_sensitive") score += 2;
  if (result.urgency === "legal_risk") score += 4;
  if (result.urgency === "critical") score += 6;

  if (result.hasEmotionalDistress) {
    score += 2;
    flags.push("emotional_distress");
  }

  if (result.physicalSafetyRisk) {
    score += 5;
    flags.push("physical_risk" as any);
  }

  if (result.financialAssetRisk) {
    score += 3;
    flags.push("financial_risk" as any);
  }

  if (result.attackerHasPasswords) {
    score += 4;
    flags.push("access_compromised" as any);
  }

  if (result.evidenceIsAutoDeleted) {
    score += 3;
    flags.push("evidence_volatility" as any);
  }

  if (score >= 8) {
    return finalizeDecision({
      route,
      priority: "critical",
      flags,
      actionCode: "IMMEDIATE_HUMAN_CONTACT",
      decisionModelVersion: DECISION_MODEL_VERSION,
    });
  }

  if (score >= 5) {
    return finalizeDecision({
      route,
      priority: "high",
      flags,
      actionCode: "PRIORITY_REVIEW_24_48H",
      decisionModelVersion: DECISION_MODEL_VERSION,
    });
  }

  if (score >= 3) {
    return finalizeDecision({
      route,
      priority: "medium",
      flags,
      actionCode: "STANDARD_REVIEW",
      decisionModelVersion: DECISION_MODEL_VERSION,
    });
  }

  return finalizeDecision({
    route,
    priority: "low",
    flags,
    actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
    decisionModelVersion: DECISION_MODEL_VERSION,
  });
}

export function decideIntakeV2(result: WizardResult): IntakeDecision {
  const baseline: IntakeDecision = decideIntake(result);
  const refinedDecision: IntakeDecision = applySignalRefinements(
    baseline,
    result,
  );

  return finalizeDecision({
    ...refinedDecision,
    decisionModelVersion: DECISION_MODEL_VERSION_V2,
  });
}

export function isDecisionModelV2(
  decision: IntakeDecision,
): decision is IntakeDecision & {
  decisionModelVersion: typeof DECISION_MODEL_VERSION_V2;
} {
  return decision.decisionModelVersion === DECISION_MODEL_VERSION_V2;
}

export function decideIntakeWithExplanation(
  result: WizardResult,
  useV2: boolean = false,
): {
  decision: IntakeDecision;
  explanation: DecisionExplanation;
} {
  const baseline: IntakeDecision = decideIntake(result);
  const decision: IntakeDecision = useV2 ? decideIntakeV2(result) : baseline;

  return Object.freeze({
    decision,
    explanation: buildDecisionExplanation(baseline, decision, result),
  });
}
