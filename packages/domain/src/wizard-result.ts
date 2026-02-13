export type ClientProfile =
  | "private_individual"
  | "family_inheritance_conflict"
  | "legal_professional"
  | "court_related"
  | "other";

export type UrgencyLevel =
  | "informational"
  | "time_sensitive"
  | "legal_risk"
  | "critical";

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

  // Urgent/Dangerous signals
  physicalSafetyRisk?: boolean;
  financialAssetRisk?: boolean;
  attackerHasPasswords?: boolean;
  evidenceIsAutoDeleted?: boolean;

  // Psychological screening
  cognitiveProfile?: {
    coherenceScore: number; // 1-5
    cognitiveDistortion: boolean;
    perceivedOmnipotenceOfAttacker: boolean; // Indicators of psychosis/paranoia
    isInformationVerifiable: boolean;
    emotionalShockLevel: "low" | "medium" | "high";
  };

  // Narrative Tracing (Phase 3)
  narrativeTracing?: {
    whatsappControlLoss: boolean;
    familySuspects: boolean;
    perceivedSurveillance: boolean;
  };

  // Extended context signals (optional)
  isOngoing?: boolean;
  hasAccessToDevices?: boolean;
  dataSensitivityLevel?: "low" | "medium" | "high";
  estimatedIncidentStart?: "unknown" | "recent" | "weeks" | "months";
  thirdPartiesInvolved?: boolean;
};
