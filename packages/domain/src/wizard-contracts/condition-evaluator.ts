import type {
  AnswerValue,
  CanonicalFieldKey,
  CanonicalSignal,
  ConditionContract,
} from "./question-contract";

export type WizardConditionContext = {
  readonly answers: Partial<Record<CanonicalFieldKey, AnswerValue>>;
  readonly signals?: readonly CanonicalSignal[];
};

function isSignalField(
  field: CanonicalFieldKey | CanonicalSignal,
  context: WizardConditionContext,
): field is CanonicalSignal {
  return Boolean(context.signals?.includes(field as CanonicalSignal));
}

function getConditionValue(
  condition: ConditionContract,
  context: WizardConditionContext,
): AnswerValue {
  if (isSignalField(condition.field, context)) {
    return true;
  }

  return context.answers[condition.field as CanonicalFieldKey] ?? null;
}

function isNotEmpty(value: AnswerValue): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
}

function includesValue(actual: AnswerValue, expected: AnswerValue): boolean {
  if (Array.isArray(actual)) {
    return actual.includes(String(expected));
  }

  if (typeof actual === "string") {
    return actual.includes(String(expected));
  }

  return actual === expected;
}

export function evaluateCondition(
  condition: ConditionContract,
  context: WizardConditionContext,
): boolean {
  const actual = getConditionValue(condition, context);
  const expected = condition.value ?? true;

  switch (condition.operator) {
    case "equals":
      return actual === expected;

    case "not_equals":
      return actual !== expected;

    case "includes":
      return includesValue(actual, expected);

    case "not_empty":
      return isNotEmpty(actual);

    default:
      return false;
  }
}

export function evaluateConditions(
  conditions: readonly ConditionContract[] | undefined,
  context: WizardConditionContext,
): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  return conditions.every((condition) => evaluateCondition(condition, context));
}
