import { describe, it, expect } from "vitest";
import { mapWizardToSignals } from "@/components/forms/ContactFormSensitive";

describe("ContactFormSensitive", () => {
  it("should re-export mapWizardToSignals as a function", () => {
    expect(typeof mapWizardToSignals).toBe("function");
  });

  it("should return signals from wizard result", () => {
    const result = mapWizardToSignals({
      clientProfile: "private_individual",
      urgency: "critical",
      incident: "Device compromised",
      devices: 2,
      actionsTaken: [],
      evidenceSources: ["logs"],
      objective: "legal_action",
      physicalSafetyRisk: true,
    });

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });
});
