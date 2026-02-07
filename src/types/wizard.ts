// ─────────────────────────────────────────────
// Wizard domain types
// ─────────────────────────────────────────────

export type ClientProfile =
  | 'private_individual'
  | 'family_inheritance_conflict'
  | 'legal_professional'
  | 'court_related'
  | 'other';

export type UrgencyLevel =
  | 'informational'
  | 'time_sensitive'
  | 'legal_risk'
  | 'critical';

export type WizardResult = {
  // Context classification
  clientProfile: ClientProfile;
  urgency: UrgencyLevel;
  hasEmotionalDistress?: boolean;

  // Incident data
  incident: string;
  devices: number;
  actionsTaken: string[];
  evidenceSources: string[];
  objective: string;
};
