import { canonicalWizardV1 } from "./canonical-wizard.v1";
import {
  getWizardQuestion,
  getWizardQuestionOptions,
  type WizardContractRegistry,
} from "./contract-registry";

import type {
  AnswerValue,
  CanonicalFieldKey,
  CanonicalQuestionId,
  CanonicalSignal,
  QuestionContract,
  QuestionOptionContract,
} from "./question-contract";

export type WizardAnswerMap = Partial<Record<CanonicalFieldKey, AnswerValue>>;

export type ResolvedWizardSignal = {
  readonly signal: CanonicalSignal;
  readonly questionId: CanonicalQuestionId;
  readonly source: "question" | "option";
  readonly optionId?: string;
};

function uniqueSignals(
  signals: readonly ResolvedWizardSignal[],
): readonly ResolvedWizardSignal[] {
  const seen = new Set<string>();

  return signals.filter((item) => {
    const key = `${item.signal}:${item.questionId}:${item.optionId ?? "question"}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function answerMatchesOption(
  answer: AnswerValue,
  option: QuestionOptionContract,
): boolean {
  if (Array.isArray(answer)) {
    return answer.includes(String(option.value));
  }

  return answer === option.value;
}

function resolveSignalsFromQuestion(
  question: QuestionContract,
): readonly ResolvedWizardSignal[] {
  return (question.signalMapping?.signals ?? []).map((signal) => ({
    signal,
    questionId: question.id,
    source: "question",
  }));
}

function resolveSignalsFromAnsweredOptions(
  question: QuestionContract,
  answer: AnswerValue,
): readonly ResolvedWizardSignal[] {
  const options = getWizardQuestionOptions(question.id);

  return options.flatMap((option) => {
    if (!answerMatchesOption(answer, option)) {
      return [];
    }

    return (option.signalMapping?.signals ?? []).map((signal) => ({
      signal,
      questionId: question.id,
      source: "option" as const,
      optionId: option.id,
    }));
  });
}

export function resolveSignalsForQuestionAnswer(
  questionId: CanonicalQuestionId,
  answer: AnswerValue,
  registry: WizardContractRegistry = canonicalWizardV1,
): readonly ResolvedWizardSignal[] {
  const question = getWizardQuestion(questionId, registry);

  if (!question) {
    return [];
  }

  return uniqueSignals([
    ...resolveSignalsFromQuestion(question),
    ...resolveSignalsFromAnsweredOptions(question, answer),
  ]);
}

export function resolveSignalsForAnswers(
  answers: WizardAnswerMap,
  registry: WizardContractRegistry = canonicalWizardV1,
): readonly ResolvedWizardSignal[] {
  const resolved = registry.questions.flatMap((question) => {
    const answer = answers[question.canonicalKey];

    if (answer === undefined || answer === null) {
      return [];
    }

    return resolveSignalsForQuestionAnswer(question.id, answer, registry);
  });

  return uniqueSignals(resolved);
}

export function listCanonicalSignalsForAnswers(
  answers: WizardAnswerMap,
  registry: WizardContractRegistry = canonicalWizardV1,
): readonly CanonicalSignal[] {
  return Array.from(
    new Set(
      resolveSignalsForAnswers(answers, registry).map((item) => item.signal),
    ),
  );
}
