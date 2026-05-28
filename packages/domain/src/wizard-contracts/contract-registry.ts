import { WIZARD_PHASES, canonicalWizardV1 } from "./canonical-wizard.v1";

import type {
  CanonicalQuestionId,
  CanonicalSignal,
  QuestionContract,
  QuestionOptionContract,
  WizardPhase,
} from "./question-contract";

import type { SnippetContract, SnippetId } from "./snippet-contract";
import type { WizardEventContract, WizardEventName } from "./event-contract";

export type WizardContractRegistry = typeof canonicalWizardV1;

export function getWizardQuestions(
  registry: WizardContractRegistry = canonicalWizardV1,
): readonly QuestionContract[] {
  return registry.questions;
}

export function getWizardQuestionsByPhase(
  phase: WizardPhase,
  registry: WizardContractRegistry = canonicalWizardV1,
): readonly QuestionContract[] {
  return registry.questions.filter((question) => question.phase === phase);
}

export function getWizardQuestion(
  questionId: CanonicalQuestionId,
  registry: WizardContractRegistry = canonicalWizardV1,
): QuestionContract | undefined {
  return registry.questions.find((question) => question.id === questionId);
}

export function requireWizardQuestion(
  questionId: CanonicalQuestionId,
  registry: WizardContractRegistry = canonicalWizardV1,
): QuestionContract {
  const question = getWizardQuestion(questionId, registry);

  if (!question) {
    throw new Error(`Wizard question not found: ${questionId}`);
  }

  return question;
}

export function getWizardQuestionOptions(
  questionId: CanonicalQuestionId,
  registry: WizardContractRegistry = canonicalWizardV1,
): readonly QuestionOptionContract[] {
  return requireWizardQuestion(questionId, registry).options ?? [];
}

export function getWizardSnippet(
  snippetId: SnippetId | string,
  registry: WizardContractRegistry = canonicalWizardV1,
): SnippetContract | undefined {
  return registry.snippets.find((snippet) => snippet.id === snippetId);
}

export function requireWizardSnippet(
  snippetId: SnippetId | string,
  registry: WizardContractRegistry = canonicalWizardV1,
): SnippetContract {
  const snippet = getWizardSnippet(snippetId, registry);

  if (!snippet) {
    throw new Error(`Wizard snippet not found: ${snippetId}`);
  }

  return snippet;
}

export function getWizardEvent(
  eventName: WizardEventName | string,
  registry: WizardContractRegistry = canonicalWizardV1,
): WizardEventContract | undefined {
  return registry.events.find((event) => event.name === eventName);
}

export function requireWizardEvent(
  eventName: WizardEventName | string,
  registry: WizardContractRegistry = canonicalWizardV1,
): WizardEventContract {
  const event = getWizardEvent(eventName, registry);

  if (!event) {
    throw new Error(`Wizard event not found: ${eventName}`);
  }

  return event;
}

export function listWizardSignalsFromQuestion(
  question: QuestionContract,
): readonly CanonicalSignal[] {
  return question.signalMapping?.signals ?? [];
}

export function listWizardSignalsFromOption(
  option: QuestionOptionContract,
): readonly CanonicalSignal[] {
  return option.signalMapping?.signals ?? [];
}

export function listWizardSnippetIdsFromQuestion(
  question: QuestionContract,
): readonly string[] {
  return (question.snippets ?? []).map((snippet) => snippet.snippetId);
}

export function getWizardPhaseIndex(phase: WizardPhase): number {
  return WIZARD_PHASES.indexOf(phase);
}

export function getNextWizardPhase(phase: WizardPhase): WizardPhase | null {
  const index = getWizardPhaseIndex(phase);
  return WIZARD_PHASES[index + 1] ?? null;
}

export function getPreviousWizardPhase(phase: WizardPhase): WizardPhase | null {
  const index = getWizardPhaseIndex(phase);
  return index > 0 ? WIZARD_PHASES[index - 1] : null;
}
