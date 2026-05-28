export type WizardContractVersion = `${number}.${number}.${number}`;

export type WizardLocale = "es" | "en";

export type WizardPhase = "TRIAGE" | "COGNITIVE" | "CONTEXT" | "DETAILS";

export type QuestionKind =
  | "single_choice"
  | "multi_choice"
  | "boolean"
  | "text"
  | "number"
  | "scale";

export type CanonicalQuestionId = `q.${string}`;

export type CanonicalOptionId = `${string}.${string}`;

export type CanonicalFieldKey =
  | "clientProfile"
  | "urgency"
  | "hasEmotionalDistress"
  | "physicalSafetyRisk"
  | "financialAssetRisk"
  | "attackerHasPasswords"
  | "evidenceIsAutoDeleted"
  | "perceivedOmnipotence"
  | "isVerifiable"
  | "distortionIndicator"
  | "shockLevel"
  | "isOngoing"
  | "hasAccessToDevices"
  | "dataSensitivityLevel"
  | "estimatedIncidentStart"
  | "thirdPartiesInvolved"
  | "incident"
  | "devices"
  | "evidenceSources"
  | "actionsTaken"
  | "objective";

export type CanonicalSignal =
  | "routing.private_case"
  | "routing.family_dispute"
  | "routing.legal_professional"
  | "routing.court_related"
  | "risk.time_sensitive"
  | "risk.legal"
  | "risk.critical"
  | "risk.physical_safety"
  | "risk.financial_asset"
  | "risk.credential_compromise"
  | "risk.evidence_volatility"
  | "risk.emotional_distress"
  | "risk.cognitive_distortion"
  | "evidence.none"
  | "evidence.full_device"
  | "evidence.screenshots"
  | "evidence.messages_only"
  | "evidence.mixed"
  | "exposure.active"
  | "exposure.potential"
  | "exposure.contained"
  | "privacy.high_sensitivity"
  | "privacy.personal_data"
  | "legal.derivation_candidate"
  | "consent.contact_permission";

export type RiskLevelMapping = "low" | "medium" | "high" | "imminent";

export type EvidenceLevelMapping =
  | "none"
  | "screenshots"
  | "messages_only"
  | "full_device"
  | "mixed";

export type ExposureStateMapping =
  | "unknown"
  | "potential"
  | "active"
  | "contained";

export type PrivacyClassification =
  | "none"
  | "personal"
  | "sensitive"
  | "special_category";

export type RetentionPolicyKey =
  | "none"
  | "short_lived"
  | "standard"
  | "legal_hold_candidate";

export type AnswerValue = string | number | boolean | string[] | null;

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "includes"
  | "not_empty";

export type ConditionContract = {
  readonly field: CanonicalFieldKey | CanonicalSignal;
  readonly operator: ConditionOperator;
  readonly value?: AnswerValue;
};

export type ValidationContract = {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly min?: number;
  readonly max?: number;
  readonly allowedValues?: readonly AnswerValue[];
};

export type SignalMappingContract = {
  readonly signals?: readonly CanonicalSignal[];
  readonly riskLevel?: RiskLevelMapping;
  readonly evidenceLevel?: EvidenceLevelMapping;
  readonly exposureState?: ExposureStateMapping;
};

export type SnippetRef = {
  readonly snippetId: string;
  readonly showWhen?: readonly ConditionContract[];
};

export type EventEmissionTrigger =
  | "on_view"
  | "on_answer"
  | "on_phase_complete";

export type EventEmissionContract = {
  readonly name: string;
  readonly trigger: EventEmissionTrigger;
  readonly includeAnswer?: boolean;
  readonly includeSignals?: boolean;
};

export type LocalizedText = Readonly<Record<WizardLocale, string>>;

export type QuestionOptionContract = {
  readonly id: CanonicalOptionId;
  readonly value: string | number | boolean;
  readonly label: LocalizedText;
  readonly description?: Partial<Record<WizardLocale, string>>;
  readonly signalMapping?: SignalMappingContract;
};

export type QuestionPrivacyContract = {
  readonly pii: boolean;
  readonly sensitive: boolean;
  readonly classification: PrivacyClassification;
  readonly retention: RetentionPolicyKey;
  readonly analyticsAllowed: boolean;
  readonly freeText: boolean;
};

export type QuestionContract = {
  readonly id: CanonicalQuestionId;
  readonly version: WizardContractVersion;
  readonly phase: WizardPhase;
  readonly kind: QuestionKind;
  readonly canonicalKey: CanonicalFieldKey;
  readonly required: boolean;
  readonly title: LocalizedText;
  readonly description?: Partial<Record<WizardLocale, string>>;
  readonly helper?: Partial<Record<WizardLocale, string>>;
  readonly options?: readonly QuestionOptionContract[];
  readonly validation?: ValidationContract;
  readonly signalMapping?: SignalMappingContract;
  readonly snippets?: readonly SnippetRef[];
  readonly emits?: readonly EventEmissionContract[];
  readonly privacy: QuestionPrivacyContract;
};
