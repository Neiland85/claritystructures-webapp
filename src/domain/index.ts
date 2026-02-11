/**
 * Domain core – framework agnostic.
 *
 * Allowed dependencies:
 * - Other modules within src/domain
 * - Language/runtime primitives only (no React, Next.js, Prisma, Nodemailer, or app-layer imports)
 * - Shared wizard-result domain types via relative imports
 */
export {
  decideIntake,
  decideIntakeV2,
  decideIntakeWithExplanation,
  DECISION_MODEL_VERSION,
  DECISION_MODEL_VERSION_V1,
  DECISION_MODEL_VERSION_V2,
} from './decision';
export { resolveIntakeRoute } from './flow';
export { assessIntake, assessIntakeV2, assessIntakeWithSignals } from './priority';
export type {
  AssessIntakeWithSignalsOptions,
  IntakeAssessment,
  IntakeAssessmentWithSignals,
} from './priority';
export type { ClientProfile, UrgencyLevel, WizardResult } from './wizard-result';


export type { DecisionExplanation, DecisionReason } from './decision-explanation';
