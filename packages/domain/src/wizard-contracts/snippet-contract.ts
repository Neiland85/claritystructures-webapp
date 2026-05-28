import type {
  ConditionContract,
  LocalizedText,
  PrivacyClassification,
  WizardContractVersion,
  WizardLocale,
} from "./question-contract";

export type SnippetKind =
  | "help"
  | "warning"
  | "legal_boundary"
  | "evidence_advice"
  | "privacy_notice"
  | "operational_instruction";

export type SnippetSeverity = "info" | "warning" | "critical";

export type SnippetId = `snippet.${string}`;

export type SnippetContract = {
  readonly id: SnippetId;
  readonly version: WizardContractVersion;
  readonly kind: SnippetKind;
  readonly severity: SnippetSeverity;
  readonly title?: Partial<Record<WizardLocale, string>>;
  readonly body: LocalizedText;
  readonly appliesWhen?: readonly ConditionContract[];
  readonly privacyClassification: PrivacyClassification;
  readonly mustNotClaim?: readonly string[];
};
