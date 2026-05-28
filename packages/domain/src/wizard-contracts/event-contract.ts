import type {
  PrivacyClassification,
  WizardContractVersion,
} from "./question-contract";

export type WizardEventName =
  | "WizardStarted"
  | "WizardQuestionViewed"
  | "WizardQuestionAnswered"
  | "WizardPhaseCompleted"
  | "WizardSignalDerived"
  | "WizardSnippetShown"
  | "WizardDecisionComputed"
  | "WizardCompleted"
  | "WizardAbandoned"
  | "ConsentCaptured"
  | "ContactSubmitted";

export type WizardEventPrivacyContract = {
  readonly allowPii: boolean;
  readonly allowFreeText: boolean;
  readonly classification: PrivacyClassification;
};

export type WizardEventContract = {
  readonly name: WizardEventName;
  readonly version: WizardContractVersion;
  readonly description: string;
  readonly privacy: WizardEventPrivacyContract;
};
