import { describe, expect, it } from "vitest";

import {
  hasApplicableSnippet,
  resolveAllSnippets,
  resolveSnippetsForQuestion,
} from "../snippet-resolver";

describe("wizard snippet resolver", () => {
  it("resolves unconditional snippets for a question", () => {
    const snippets = resolveSnippetsForQuestion("q.context.client_profile", {
      answers: {},
      signals: [],
    });

    expect(snippets.map((item) => item.snippet.id)).toContain(
      "snippet.boundary.not_legal_advice",
    );
  });

  it("does not resolve conditional snippets when signal is missing", () => {
    const snippets = resolveSnippetsForQuestion("q.context.urgency", {
      answers: {
        urgency: "informational",
      },
      signals: [],
    });

    expect(snippets.map((item) => item.snippet.id)).not.toContain(
      "snippet.evidence.do_not_modify_originals",
    );
  });

  it("resolves conditional snippets when signal is present", () => {
    const snippets = resolveSnippetsForQuestion("q.context.urgency", {
      answers: {
        urgency: "time_sensitive",
      },
      signals: ["risk.evidence_volatility"],
    });

    expect(snippets.map((item) => item.snippet.id)).toContain(
      "snippet.evidence.do_not_modify_originals",
    );
  });

  it("can resolve all applicable snippets", () => {
    const snippets = resolveAllSnippets({
      answers: {
        urgency: "time_sensitive",
        attackerHasPasswords: true,
      },
      signals: ["risk.evidence_volatility", "risk.credential_compromise"],
    });

    expect(snippets.length).toBeGreaterThan(0);
    expect(snippets.map((item) => item.snippet.id)).toContain(
      "snippet.credentials.rotate_access",
    );
  });

  it("detects whether a specific snippet applies", () => {
    expect(
      hasApplicableSnippet(
        "q.risk.credentials",
        "snippet.credentials.rotate_access",
        {
          answers: {
            attackerHasPasswords: true,
          },
          signals: ["risk.credential_compromise"],
        },
      ),
    ).toBe(true);
  });

  it("returns no snippets for unknown questions", () => {
    expect(
      resolveSnippetsForQuestion("q.unknown.missing", {
        answers: {},
        signals: [],
      }),
    ).toEqual([]);
  });
});
