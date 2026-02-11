import type { IntakePriority } from './intake-records';

export type DecisionReason =
  | 'urgency_based_routing'
  | 'client_profile_routing'
  | 'family_conflict_flag'
  | 'legal_professional_flag'
  | 'active_procedure_flag'
  | 'emotional_distress_flag'
  | 'data_sensitivity_escalation'
  | 'ongoing_incident_escalation'
  | 'device_access_constraint'
  | 'long_duration_exposure_hint';

export type DecisionExplanation = {
  reasons: DecisionReason[];
  baselinePriority: IntakePriority;
  finalPriority: IntakePriority;
  modelVersion: string;
};
