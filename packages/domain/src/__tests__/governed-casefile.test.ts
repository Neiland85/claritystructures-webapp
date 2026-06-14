import { describe, expect, it } from "vitest";

import { governedCaseFileFixture } from "../governed-casefile";

describe("GovernedCaseFile", () => {
  it("models a governed operational case container", () => {
    expect(governedCaseFileFixture.caseRef).toBe("EV-2026-DEMO");
    expect(governedCaseFileFixture.readinessState).toBe("under_review");
    expect(governedCaseFileFixture.contextBoundaryState).toBe("unclear");
    expect(governedCaseFileFixture.sensitivity).toBe("legal_sensitive");
    expect(governedCaseFileFixture.scopeMatrix.length).toBeGreaterThan(0);
    expect(governedCaseFileFixture.assuranceTrail.length).toBeGreaterThan(0);
  });

  it("keeps operational gates explicit instead of boolean-only state", () => {
    expect(governedCaseFileFixture.governanceSummary?.status).toBe("blocked");
    expect(
      governedCaseFileFixture.governanceSummary?.blockedActions[0]?.gate,
    ).toBe("external_transfer");
    expect(governedCaseFileFixture.transferReadiness?.status).toBe("not_ready");
    expect(governedCaseFileFixture.privacyBoundary?.status).toBe(
      "review_required",
    );
  });
});
