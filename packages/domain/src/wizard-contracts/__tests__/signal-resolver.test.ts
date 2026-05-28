import { describe, expect, it } from "vitest";

import {
  listCanonicalSignalsForAnswers,
  resolveSignalsForAnswers,
  resolveSignalsForQuestionAnswer,
} from "../signal-resolver";

describe("wizard signal resolver", () => {
  it("resolves option signals for a single-choice answer", () => {
    const signals = resolveSignalsForQuestionAnswer(
      "q.context.client_profile",
      "legal_professional",
    );

    expect(signals.map((item) => item.signal)).toContain(
      "routing.legal_professional",
    );
    expect(signals.map((item) => item.signal)).toContain(
      "legal.derivation_candidate",
    );
  });

  it("resolves option signals for urgency", () => {
    const signals = resolveSignalsForQuestionAnswer(
      "q.context.urgency",
      "time_sensitive",
    );

    expect(signals.map((item) => item.signal)).toContain("risk.time_sensitive");
    expect(signals.map((item) => item.signal)).toContain(
      "risk.evidence_volatility",
    );
  });

  it("resolves question-level boolean risk signals", () => {
    const signals = resolveSignalsForQuestionAnswer("q.risk.credentials", true);

    expect(signals.map((item) => item.signal)).toContain(
      "risk.credential_compromise",
    );
  });

  it("resolves multi-choice evidence source signals", () => {
    const signals = resolveSignalsForQuestionAnswer(
      "q.details.evidence_sources",
      ["phone_device", "screenshots"],
    );

    expect(signals.map((item) => item.signal)).toContain(
      "evidence.full_device",
    );
    expect(signals.map((item) => item.signal)).toContain(
      "evidence.screenshots",
    );
  });

  it("resolves signals from an answer map", () => {
    const signals = resolveSignalsForAnswers({
      clientProfile: "court_related",
      urgency: "legal_risk",
      attackerHasPasswords: true,
      evidenceSources: ["messages", "email"],
    });

    expect(signals.map((item) => item.signal)).toContain(
      "routing.court_related",
    );
    expect(signals.map((item) => item.signal)).toContain(
      "legal.derivation_candidate",
    );
    expect(signals.map((item) => item.signal)).toContain(
      "risk.credential_compromise",
    );
    expect(signals.map((item) => item.signal)).toContain(
      "evidence.messages_only",
    );
  });

  it("returns unique canonical signals for answers", () => {
    const signals = listCanonicalSignalsForAnswers({
      clientProfile: "court_related",
      urgency: "legal_risk",
      objective: "legal_derivation",
    });

    expect(signals).toContain("legal.derivation_candidate");

    const derivationSignals = signals.filter(
      (signal) => signal === "legal.derivation_candidate",
    );

    expect(derivationSignals).toHaveLength(1);
  });

  it("returns no signals for unknown questions", () => {
    expect(resolveSignalsForQuestionAnswer("q.unknown.missing", true)).toEqual(
      [],
    );
  });
});
