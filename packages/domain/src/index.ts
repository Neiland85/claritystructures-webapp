/**
 * Domain core – framework agnostic.
 */

export {
  decideIntake,
  decideIntakeV2,
  decideIntakeWithExplanation,
  DECISION_MODEL_VERSION,
  DECISION_MODEL_VERSION_V1,
  DECISION_MODEL_VERSION_V2,
} from './decision';

export type { IntakeDecision } from './decision';

export { resolveIntakeRoute } from './flow';

export {
  assessIntake,
  assessIntakeV2,
  assessIntakeWithSignals,
} from './priority';

export type {
  AssessIntakeWithSignalsOptions,
  IntakeAssessment,
  IntakeAssessmentWithSignals,
} from './priority';

export type {
  ClientProfile,
  UrgencyLevel,
  WizardResult
} from './wizard-result';

export type {
  DecisionExplanation,
  DecisionReason
} from './decision-explanation';

export type {
  IntakeTone,
  IntakeStatus,
  IntakePriority,
  IntakeActionCode,
  IntakeFlag
} from './intake-records';

export type { ContactIntakeInput } from './contact-intake';

export type {
  IncidentType,
  RiskLevel,
  EvidenceLevel,
  ExposureState,
  SensitivityFlag,
  IntakeSignals,
  IntakeSignalSummary
} from './intake-signals';

export { buildSummary } from './intake-signals';
