import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EvidencePreview from "@/components/EvidencePreview";
import type { WizardResult } from "@claritystructures/domain";

const MINIMAL_WIZARD: WizardResult = {
  clientProfile: "private_individual",
  urgency: "informational",
  incident: "Test incident",
  devices: 1,
  actionsTaken: [],
  evidenceSources: [],
  objective: "informational",
};

describe("EvidencePreview", () => {
  it("should render wizard data as formatted JSON", () => {
    render(<EvidencePreview data={MINIMAL_WIZARD} />);

    expect(screen.getByText(/private_individual/)).toBeInTheDocument();
    expect(screen.getByText(/Test incident/)).toBeInTheDocument();
  });

  it("should render in a pre element for monospace formatting", () => {
    const { container } = render(<EvidencePreview data={MINIMAL_WIZARD} />);

    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
  });

  it("should display all wizard fields", () => {
    const fullWizard: WizardResult = {
      ...MINIMAL_WIZARD,
      physicalSafetyRisk: true,
      cognitiveProfile: {
        coherenceScore: 3,
        cognitiveDistortion: false,
        perceivedOmnipotenceOfAttacker: true,
        isInformationVerifiable: true,
        emotionalShockLevel: "high",
      },
    };

    render(<EvidencePreview data={fullWizard} />);

    expect(screen.getByText(/physicalSafetyRisk/)).toBeInTheDocument();
    expect(screen.getByText(/coherenceScore/)).toBeInTheDocument();
  });
});
