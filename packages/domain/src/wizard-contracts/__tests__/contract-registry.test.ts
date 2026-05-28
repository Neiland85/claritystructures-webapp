import { describe, expect, it } from "vitest";

import { WIZARD_PHASES, canonicalWizardV1 } from "../canonical-wizard.v1";

import {
  getNextWizardPhase,
  getPreviousWizardPhase,
  getWizardPhaseIndex,
  getWizardQuestion,
  getWizardQuestionOptions,
  getWizardQuestions,
  getWizardQuestionsByPhase,
  getWizardEvent,
  getWizardSnippet,
  listWizardSignalsFromOption,
  listWizardSignalsFromQuestion,
  listWizardSnippetIdsFromQuestion,
  requireWizardEvent,
  requireWizardQuestion,
  requireWizardSnippet,
} from "../contract-registry";

describe("wizard contract registry helpers", () => {
  it("returns all questions", () => {
    expect(getWizardQuestions().length).toBe(
      canonicalWizardV1.questions.length,
    );
  });

  it("returns questions by phase", () => {
    for (const phase of WIZARD_PHASES) {
      expect(getWizardQuestionsByPhase(phase).length).toBeGreaterThan(0);
    }
  });

  it("finds and requires known questions", () => {
    const question = getWizardQuestion("q.context.client_profile");

    expect(question?.id).toBe("q.context.client_profile");
    expect(requireWizardQuestion("q.context.client_profile").canonicalKey).toBe(
      "clientProfile",
    );
  });

  it("throws when requiring an unknown question", () => {
    expect(() => requireWizardQuestion("q.unknown.missing")).toThrowError(
      /Wizard question not found/,
    );
  });

  it("returns options for choice questions", () => {
    const options = getWizardQuestionOptions("q.context.client_profile");

    expect(options.length).toBeGreaterThan(0);
    expect(options.map((option) => option.value)).toContain(
      "private_individual",
    );
  });

  it("returns no options for text questions", () => {
    const options = getWizardQuestionOptions("q.details.incident_summary");

    expect(options).toEqual([]);
  });

  it("finds and requires snippets", () => {
    const snippet = getWizardSnippet("snippet.boundary.not_legal_advice");

    expect(snippet?.id).toBe("snippet.boundary.not_legal_advice");
    expect(requireWizardSnippet("snippet.boundary.not_legal_advice").kind).toBe(
      "legal_boundary",
    );
  });

  it("throws when requiring an unknown snippet", () => {
    expect(() => requireWizardSnippet("snippet.unknown.missing")).toThrowError(
      /Wizard snippet not found/,
    );
  });

  it("finds and requires events", () => {
    const event = getWizardEvent("WizardQuestionAnswered");

    expect(event?.name).toBe("WizardQuestionAnswered");
    expect(requireWizardEvent("WizardCompleted").name).toBe("WizardCompleted");
  });

  it("throws when requiring an unknown event", () => {
    expect(() => requireWizardEvent("UnknownEvent")).toThrowError(
      /Wizard event not found/,
    );
  });

  it("lists signals from question mappings", () => {
    const question = requireWizardQuestion("q.risk.credentials");

    expect(listWizardSignalsFromQuestion(question)).toContain(
      "risk.credential_compromise",
    );
  });

  it("lists signals from option mappings", () => {
    const options = getWizardQuestionOptions("q.details.evidence_sources");
    const phoneDevice = options.find(
      (option) => option.id === "evidence.phone_device",
    );

    expect(phoneDevice).toBeDefined();

    if (!phoneDevice) {
      throw new Error("phone device option not found");
    }

    expect(listWizardSignalsFromOption(phoneDevice)).toContain(
      "evidence.full_device",
    );
  });

  it("lists snippet ids referenced by a question", () => {
    const question = requireWizardQuestion("q.context.client_profile");

    expect(listWizardSnippetIdsFromQuestion(question)).toContain(
      "snippet.boundary.not_legal_advice",
    );
  });

  it("resolves phase navigation", () => {
    expect(getWizardPhaseIndex("TRIAGE")).toBe(0);
    expect(getNextWizardPhase("TRIAGE")).toBe("COGNITIVE");
    expect(getPreviousWizardPhase("TRIAGE")).toBeNull();
    expect(getNextWizardPhase("DETAILS")).toBeNull();
  });
});
