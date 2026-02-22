import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Wizard from "@/components/Wizard";
import { LanguageProvider } from "@/components/LanguageProvider";

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

// Mock AnimatedLogo
vi.mock("@/components/AnimatedLogo", () => ({
  default: () => <div data-testid="animated-logo" />,
}));

// Mock LanguageSwitcher
vi.mock("@/components/LanguageSwitcher", () => ({
  default: () => <div data-testid="language-switcher" />,
}));

// Mock next/navigation for LanguageProvider
const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

function renderEnglish(onComplete = vi.fn()) {
  mockUsePathname.mockReturnValue("/en");
  render(
    <LanguageProvider>
      <Wizard onComplete={onComplete} />
    </LanguageProvider>,
  );
  return onComplete;
}

function renderSpanish(onComplete = vi.fn()) {
  mockUsePathname.mockReturnValue("/es");
  render(
    <LanguageProvider>
      <Wizard onComplete={onComplete} />
    </LanguageProvider>,
  );
  return onComplete;
}

describe("Wizard i18n — English locale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders English triage title", () => {
    renderEnglish();
    expect(screen.getByText("Technical Emergency Triage")).toBeInTheDocument();
  });

  it("renders English section headings", () => {
    renderEnglish();
    expect(screen.getByText("Current Situation")).toBeInTheDocument();
    expect(screen.getByText("Urgency Level")).toBeInTheDocument();
  });

  it("renders English client profile options", () => {
    renderEnglish();
    expect(
      screen.getByText("Directly affected individual"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Family conflict / inheritance"),
    ).toBeInTheDocument();
    expect(screen.getByText("Lawyer / legal firm")).toBeInTheDocument();
    expect(screen.getByText("Ongoing court proceedings")).toBeInTheDocument();
    expect(screen.getByText("Other context")).toBeInTheDocument();
  });

  it("renders English urgency levels", () => {
    renderEnglish();
    expect(
      screen.getByText("Informational / preventive inquiry"),
    ).toBeInTheDocument();
    expect(screen.getByText("Immediate legal risk")).toBeInTheDocument();
  });

  it("renders English risk assessment buttons", () => {
    renderEnglish();
    expect(screen.getByText("REAL THREAT")).toBeInTheDocument();
    expect(screen.getByText("SAFE ZONE")).toBeInTheDocument();
    expect(screen.getByText("AT RISK")).toBeInTheDocument();
    expect(screen.getByText("PROTECTED")).toBeInTheDocument();
    expect(screen.getByText("PASSWORDS EXPOSED")).toBeInTheDocument();
    expect(screen.getByText("CREDENTIALS SAFE")).toBeInTheDocument();
    expect(screen.getByText("AUTO-DELETING ACTIVE")).toBeInTheDocument();
    expect(screen.getByText("EVIDENCE STABLE")).toBeInTheDocument();
  });

  it("renders English next button", () => {
    renderEnglish();
    expect(
      screen.getByText("Next Step: Context Assessment"),
    ).toBeInTheDocument();
  });

  it("renders English progress nav labels", () => {
    renderEnglish();
    const nav = screen.getByLabelText("Form progress");
    expect(nav).toBeInTheDocument();

    const items = nav.querySelectorAll("li");
    expect(items).toHaveLength(4);
    expect(items[0].textContent).toContain("Triage");
    expect(items[1].textContent).toContain("Assessment");
    expect(items[2].textContent).toContain("Context");
    expect(items[3].textContent).toContain("Tracing");
  });

  it("navigates full English flow to COGNITIVE", () => {
    renderEnglish();

    fireEvent.click(screen.getByText("Directly affected individual"));
    fireEvent.click(screen.getByText("Informational / preventive inquiry"));
    fireEvent.click(screen.getByText("Next Step: Context Assessment"));

    expect(screen.getByText("Stability Assessment")).toBeInTheDocument();
    expect(screen.getByText("TOTAL SURVEILLANCE")).toBeInTheDocument();
    expect(screen.getByText("RESTRICTED TECH")).toBeInTheDocument();
    // New emotional distress + shock level fields
    expect(screen.getByText("SEVERE DISTRESS")).toBeInTheDocument();
    expect(screen.getByText("EMOTIONALLY STABLE")).toBeInTheDocument();
    expect(screen.getByText("LOW")).toBeInTheDocument();
    expect(screen.getByText("MODERATE")).toBeInTheDocument();
    expect(screen.getByText("SEVERE")).toBeInTheDocument();
  });

  it("navigates COGNITIVE → CONTEXT in English", () => {
    renderEnglish();

    // TRIAGE
    fireEvent.click(screen.getByText("Directly affected individual"));
    fireEvent.click(screen.getByText("Informational / preventive inquiry"));
    fireEvent.click(screen.getByText("Next Step: Context Assessment"));

    // COGNITIVE → CONTEXT
    fireEvent.click(screen.getByText("Next Step: Context"));

    expect(screen.getByText("Incident Context")).toBeInTheDocument();
    expect(
      screen.getByText("Is the incident still active right now?"),
    ).toBeInTheDocument();
    expect(screen.getByText("ACTIVE NOW")).toBeInTheDocument();
    expect(screen.getByText("ALREADY RESOLVED")).toBeInTheDocument();
  });

  it("navigates full English flow through all 4 phases and submits", () => {
    const handler = vi.fn();
    renderEnglish(handler);

    // TRIAGE — including new credential/evidence toggles
    fireEvent.click(screen.getByText("Directly affected individual"));
    fireEvent.click(screen.getByText("Immediate legal risk"));
    fireEvent.click(screen.getByText("PASSWORDS EXPOSED"));
    fireEvent.click(screen.getByText("AUTO-DELETING ACTIVE"));
    fireEvent.click(screen.getByText("Next Step: Context Assessment"));

    // COGNITIVE — including emotional distress + shock
    fireEvent.click(screen.getByText("SEVERE DISTRESS"));
    fireEvent.click(screen.getByText("SEVERE"));
    fireEvent.click(screen.getByText("Next Step: Context"));

    // Fill CONTEXT
    fireEvent.click(screen.getByText("ACTIVE NOW"));
    fireEvent.click(screen.getByText("WEEKS"));
    fireEvent.click(screen.getByText("HIGH"));
    fireEvent.click(screen.getByText("NO ACCESS"));
    fireEvent.click(screen.getByText("YES, THIRD PARTIES"));

    // CONTEXT → TRACE
    fireEvent.click(screen.getByText("Continue Forensic Tracing"));

    // TRACE
    expect(screen.getByText("Forensic Narrative Tracing")).toBeInTheDocument();

    // Submit
    fireEvent.click(screen.getByText("Finalize Triage Report"));

    expect(handler).toHaveBeenCalledTimes(1);
    const result = handler.mock.calls[0][0];
    expect(result.clientProfile).toBe("private_individual");
    expect(result.urgency).toBe("legal_risk");
    expect(result.isOngoing).toBe(true);
    expect(result.estimatedIncidentStart).toBe("weeks");
    expect(result.dataSensitivityLevel).toBe("high");
    expect(result.hasAccessToDevices).toBe(false);
    expect(result.thirdPartiesInvolved).toBe(true);
  });
});

describe("Wizard i18n — Spanish locale (explicit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Spanish triage title when lang is es", () => {
    renderSpanish();
    expect(
      screen.getByText("Triage de Emergencia Técnica"),
    ).toBeInTheDocument();
  });

  it("renders Spanish client profile options", () => {
    renderSpanish();
    expect(
      screen.getByText("Particular afectado directamente"),
    ).toBeInTheDocument();
    expect(screen.getByText("Abogado / despacho legal")).toBeInTheDocument();
  });
});
