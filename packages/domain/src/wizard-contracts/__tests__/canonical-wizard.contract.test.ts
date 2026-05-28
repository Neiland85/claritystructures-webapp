import { describe, expect, it } from "vitest";

import {
  CANONICAL_SIGNALS,
  WIZARD_EVENTS,
  WIZARD_PHASES,
  canonicalWizardV1,
} from "../canonical-wizard.v1";

describe("canonical wizard contract v1", () => {
  it("has a stable id and semantic version", () => {
    expect(canonicalWizardV1.id).toBe("clarity.intake.wizard");
    expect(canonicalWizardV1.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("has unique question ids", () => {
    const ids = canonicalWizardV1.questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique snippet ids", () => {
    const ids = canonicalWizardV1.snippets.map((snippet) => snippet.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique event names", () => {
    const names = canonicalWizardV1.events.map((event) => event.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("only uses known phases", () => {
    const knownPhases = new Set(WIZARD_PHASES);

    for (const question of canonicalWizardV1.questions) {
      expect(knownPhases.has(question.phase)).toBe(true);
    }
  });

  it("contains at least one question per phase", () => {
    for (const phase of WIZARD_PHASES) {
      expect(
        canonicalWizardV1.questions.some(
          (question) => question.phase === phase,
        ),
      ).toBe(true);
    }
  });

  it("has Spanish and English labels for every question", () => {
    for (const question of canonicalWizardV1.questions) {
      expect(question.title.es).toBeTruthy();
      expect(question.title.en).toBeTruthy();
    }
  });

  it("has Spanish and English labels for every option", () => {
    for (const question of canonicalWizardV1.questions) {
      for (const option of question.options ?? []) {
        expect(option.label.es).toBeTruthy();
        expect(option.label.en).toBeTruthy();
      }
    }
  });

  it("does not use duplicate option ids inside a question", () => {
    for (const question of canonicalWizardV1.questions) {
      const optionIds = (question.options ?? []).map((option) => option.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
    }
  });

  it("does not emit unknown wizard events", () => {
    const knownEvents = new Set(WIZARD_EVENTS.map((event) => event.name));

    for (const question of canonicalWizardV1.questions) {
      for (const event of question.emits ?? []) {
        expect(knownEvents.has(event.name as never)).toBe(true);
      }
    }
  });

  it("does not reference unknown snippets", () => {
    const knownSnippets = new Set(
      canonicalWizardV1.snippets.map((snippet) => snippet.id),
    );

    for (const question of canonicalWizardV1.questions) {
      for (const snippet of question.snippets ?? []) {
        expect(knownSnippets.has(snippet.snippetId as never)).toBe(true);
      }
    }
  });

  it("does not map to unknown canonical signals", () => {
    const knownSignals = new Set(CANONICAL_SIGNALS);

    for (const question of canonicalWizardV1.questions) {
      for (const signal of question.signalMapping?.signals ?? []) {
        expect(knownSignals.has(signal)).toBe(true);
      }

      for (const option of question.options ?? []) {
        for (const signal of option.signalMapping?.signals ?? []) {
          expect(knownSignals.has(signal)).toBe(true);
        }
      }
    }
  });

  it("marks free text questions as not analytics-safe", () => {
    const freeTextQuestions = canonicalWizardV1.questions.filter(
      (question) => question.kind === "text",
    );

    expect(freeTextQuestions.length).toBeGreaterThan(0);

    for (const question of freeTextQuestions) {
      expect(question.privacy.freeText).toBe(true);
      expect(question.privacy.analyticsAllowed).toBe(false);
    }
  });

  it("keeps high-risk or sensitive questions out of analytics", () => {
    const sensitiveQuestions = canonicalWizardV1.questions.filter(
      (question) => question.privacy.sensitive,
    );

    expect(sensitiveQuestions.length).toBeGreaterThan(0);

    for (const question of sensitiveQuestions) {
      expect(question.privacy.analyticsAllowed).toBe(false);
    }
  });
});
