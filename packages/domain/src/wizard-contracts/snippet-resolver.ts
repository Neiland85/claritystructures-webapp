import { canonicalWizardV1 } from "./canonical-wizard.v1";
import { evaluateConditions } from "./condition-evaluator";
import {
  getWizardQuestion,
  getWizardSnippet,
  type WizardContractRegistry,
} from "./contract-registry";

import type { CanonicalQuestionId, SnippetRef } from "./question-contract";

import type { SnippetContract } from "./snippet-contract";

import type { WizardConditionContext } from "./condition-evaluator";

export type ResolvedWizardSnippet = {
  readonly questionId: CanonicalQuestionId;
  readonly snippetRef: SnippetRef;
  readonly snippet: SnippetContract;
};

export function resolveSnippetsForQuestion(
  questionId: CanonicalQuestionId,
  context: WizardConditionContext,
  registry: WizardContractRegistry = canonicalWizardV1,
): readonly ResolvedWizardSnippet[] {
  const question = getWizardQuestion(questionId, registry);

  if (!question) {
    return [];
  }

  return (question.snippets ?? [])
    .filter((snippetRef) => evaluateConditions(snippetRef.showWhen, context))
    .map((snippetRef) => {
      const snippet = getWizardSnippet(snippetRef.snippetId, registry);

      if (!snippet) {
        return null;
      }

      if (!evaluateConditions(snippet.appliesWhen, context)) {
        return null;
      }

      return {
        questionId,
        snippetRef,
        snippet,
      };
    })
    .filter((resolved): resolved is ResolvedWizardSnippet => resolved !== null);
}

export function resolveAllSnippets(
  context: WizardConditionContext,
  registry: WizardContractRegistry = canonicalWizardV1,
): readonly ResolvedWizardSnippet[] {
  return registry.questions.flatMap((question) =>
    resolveSnippetsForQuestion(question.id, context, registry),
  );
}

export function hasApplicableSnippet(
  questionId: CanonicalQuestionId,
  snippetId: string,
  context: WizardConditionContext,
  registry: WizardContractRegistry = canonicalWizardV1,
): boolean {
  return resolveSnippetsForQuestion(questionId, context, registry).some(
    (resolved) => resolved.snippet.id === snippetId,
  );
}
