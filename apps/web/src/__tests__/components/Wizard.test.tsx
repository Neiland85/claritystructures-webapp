import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Wizard from "@/components/Wizard";
import { trackEvent } from "@/lib/analytics";

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

// Mock AnimatedLogo
vi.mock("@/components/AnimatedLogo", () => ({
  default: () => <div data-testid="animated-logo" />,
}));

// Mock LanguageSwitcher (uses usePathname from next/navigation)
vi.mock("@/components/LanguageSwitcher", () => ({
  default: () => <div data-testid="language-switcher" />,
}));

// Suppress ReactDOM.render warnings in tests
const originalError = console.error;
beforeEach(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

function goToPhase(
  phase: "COGNITIVE" | "CONTEXT" | "DETAILS",
  onComplete = vi.fn(),
) {
  render(<Wizard onComplete={onComplete} />);

  // Complete TRIAGE
  fireEvent.click(screen.getByText("Particular afectado directamente"));
  fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
  fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

  if (phase === "COGNITIVE") return onComplete;

  // COGNITIVE → CONTEXT
  fireEvent.click(screen.getByText("Siguiente Paso: Contexto"));

  if (phase === "CONTEXT") return onComplete;

  // CONTEXT → DETAILS
  fireEvent.click(screen.getByText("Siguiente Paso: Detalles"));

  return onComplete;
}

describe("Wizard", () => {
  const onComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- TRIAGE phase ---

  it("should render the TRIAGE phase initially", () => {
    render(<Wizard onComplete={onComplete} />);

    expect(
      screen.getByText("Triage de Emergencia Técnica"),
    ).toBeInTheDocument();
    expect(screen.getByText("Situación Actual")).toBeInTheDocument();
    expect(screen.getByText("Nivel de Urgencia")).toBeInTheDocument();
  }, 10000);

  it("should show client profile options", () => {
    render(<Wizard onComplete={onComplete} />);

    expect(
      screen.getByText("Particular afectado directamente"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Conflicto familiar / herencia"),
    ).toBeInTheDocument();
    expect(screen.getByText("Abogado / despacho legal")).toBeInTheDocument();
  }, 10000);

  it("should disable next button when step 1 is incomplete", () => {
    render(<Wizard onComplete={onComplete} />);

    const nextBtn = screen.getByText("Siguiente Paso: Evaluación de Contexto");
    expect(nextBtn).toBeDisabled();
  }, 10000);

  it("should enable next button when profile and urgency are selected", () => {
    render(<Wizard onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));

    const nextBtn = screen.getByText("Siguiente Paso: Evaluación de Contexto");
    expect(nextBtn).not.toBeDisabled();
  }, 10000);

  it("should navigate to COGNITIVE phase on next", () => {
    render(<Wizard onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

    expect(screen.getByText("Evaluación de Estabilidad")).toBeInTheDocument();
  }, 10000);

  it("should navigate back from COGNITIVE to TRIAGE", () => {
    goToPhase("COGNITIVE");

    fireEvent.click(screen.getByText("Volver"));

    expect(
      screen.getByText("Triage de Emergencia Técnica"),
    ).toBeInTheDocument();
  }, 10000);

  it("should set physicalSafetyRisk via radio buttons", () => {
    render(<Wizard onComplete={onComplete} />);

    const threatBtn = screen.getByText("AMENAZA REAL");
    fireEvent.click(threatBtn);

    expect(threatBtn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should set attackerHasPasswords via radio buttons", () => {
    render(<Wizard onComplete={onComplete} />);

    const btn = screen.getByText("CONTRASEÑAS EXPUESTAS");
    fireEvent.click(btn);

    expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should set evidenceIsAutoDeleted via radio buttons", () => {
    render(<Wizard onComplete={onComplete} />);

    const btn = screen.getByText("AUTOBORRADO ACTIVO");
    fireEvent.click(btn);

    expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should set hasEmotionalDistress in COGNITIVE phase", () => {
    goToPhase("COGNITIVE");

    const btn = screen.getByText("ANGUSTIA SEVERA");
    fireEvent.click(btn);

    expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should set shockLevel in COGNITIVE phase", () => {
    goToPhase("COGNITIVE");

    const btn = screen.getByText("SEVERO");
    fireEvent.click(btn);

    expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should have proper ARIA attributes on radiogroups", () => {
    render(<Wizard onComplete={onComplete} />);

    const radiogroups = screen.getAllByRole("radiogroup");
    expect(radiogroups.length).toBeGreaterThanOrEqual(2);

    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(0);
  }, 10000);

  it("should show form step progress indicator with 4 steps", () => {
    render(<Wizard onComplete={onComplete} />);

    const nav = screen.getByLabelText("Progreso del formulario");
    expect(nav).toBeInTheDocument();

    const items = nav.querySelectorAll("li");
    expect(items).toHaveLength(4);
    expect(items[0].textContent).toContain("Triage");
    expect(items[1].textContent).toContain("Evaluación");
    expect(items[2].textContent).toContain("Contexto");
    expect(items[3].textContent).toContain("Detalles");
  }, 10000);

  // --- COGNITIVE → CONTEXT navigation ---

  it("should navigate from COGNITIVE to CONTEXT phase", () => {
    goToPhase("CONTEXT");

    expect(screen.getByText("Contexto del Incidente")).toBeInTheDocument();
  }, 10000);

  it("should navigate back from CONTEXT to COGNITIVE", () => {
    goToPhase("CONTEXT");

    fireEvent.click(screen.getByText("Volver"));

    expect(screen.getByText("Evaluación de Estabilidad")).toBeInTheDocument();
  }, 10000);

  // --- CONTEXT phase rendering ---

  it("should render all 5 CONTEXT questions", () => {
    goToPhase("CONTEXT");

    expect(
      screen.getByText("¿El incidente sigue activo en este momento?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("¿Cuándo comenzó aproximadamente el incidente?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "¿Qué nivel de sensibilidad tienen los datos afectados?",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("¿Tienes acceso físico a los dispositivos afectados?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "¿Hay terceros involucrados o afectados por el incidente?",
      ),
    ).toBeInTheDocument();
  }, 10000);

  it("should render CONTEXT radiogroups with proper ARIA", () => {
    goToPhase("CONTEXT");

    const radiogroups = screen.getAllByRole("radiogroup");
    // 5 questions = 5 radiogroups
    expect(radiogroups).toHaveLength(5);

    // Each should have aria-labelledby
    for (const group of radiogroups) {
      expect(group).toHaveAttribute("aria-labelledby");
    }
  }, 10000);

  it("should select isOngoing option", () => {
    goToPhase("CONTEXT");

    const activeBtn = screen.getByText("ACTIVO AHORA");
    fireEvent.click(activeBtn);

    expect(activeBtn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should select dataSensitivityLevel option", () => {
    goToPhase("CONTEXT");

    const highBtn = screen.getByText("ALTA");
    fireEvent.click(highBtn);

    expect(highBtn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should select estimatedIncidentStart option", () => {
    goToPhase("CONTEXT");

    const weeksBtn = screen.getByText("SEMANAS");
    fireEvent.click(weeksBtn);

    expect(weeksBtn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should select hasAccessToDevices option", () => {
    goToPhase("CONTEXT");

    const noAccessBtn = screen.getByText("NO TENGO ACCESO");
    fireEvent.click(noAccessBtn);

    expect(noAccessBtn.closest("button")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  }, 10000);

  it("should select thirdPartiesInvolved option", () => {
    goToPhase("CONTEXT");

    const yesBtn = screen.getByText("SÍ, HAY TERCEROS");
    fireEvent.click(yesBtn);

    expect(yesBtn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  // --- CONTEXT → DETAILS navigation ---

  it("should navigate from CONTEXT to DETAILS phase", () => {
    goToPhase("DETAILS");

    expect(screen.getByText("Detalles del Incidente")).toBeInTheDocument();
  }, 10000);

  it("should navigate back from DETAILS to CONTEXT", () => {
    goToPhase("DETAILS");

    fireEvent.click(screen.getByText("Volver"));

    expect(screen.getByText("Contexto del Incidente")).toBeInTheDocument();
  }, 10000);

  // --- DETAILS phase rendering ---

  it("should render all 5 DETAILS questions", () => {
    goToPhase("DETAILS");

    expect(
      screen.getByText("¿Qué tipo de incidente describes?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("¿Cuántos dispositivos están involucrados o afectados?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "¿De qué fuentes dispones como evidencia? (selecciona todas las que apliquen)",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "¿Qué acciones has tomado hasta ahora? (selecciona todas las que apliquen)",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("¿Cuál es tu objetivo principal?"),
    ).toBeInTheDocument();
  }, 10000);

  it("should select incident type", () => {
    goToPhase("DETAILS");

    const btn = screen.getByText("Acoso / hostigamiento");
    fireEvent.click(btn);

    expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should select device count", () => {
    goToPhase("DETAILS");

    const btn = screen.getByText("2 dispositivos");
    fireEvent.click(btn);

    expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should toggle evidence sources (multi-select)", () => {
    goToPhase("DETAILS");

    const phoneBtn = screen.getByText("Teléfono móvil");
    const emailBtn = screen.getByText("Correos electrónicos");

    // Select both
    fireEvent.click(phoneBtn);
    fireEvent.click(emailBtn);

    expect(phoneBtn.closest("button")).toHaveAttribute("aria-checked", "true");
    expect(emailBtn.closest("button")).toHaveAttribute("aria-checked", "true");

    // Deselect phone
    fireEvent.click(phoneBtn);
    expect(phoneBtn.closest("button")).toHaveAttribute("aria-checked", "false");
    expect(emailBtn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should toggle actions taken (multi-select)", () => {
    goToPhase("DETAILS");

    const securedBtn = screen.getByText("Aseguré / bloqueé accesos");
    const reportBtn = screen.getByText("Denuncié / informé");

    fireEvent.click(securedBtn);
    fireEvent.click(reportBtn);

    expect(securedBtn.closest("button")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(reportBtn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  it("should select objective", () => {
    goToPhase("DETAILS");

    const btn = screen.getByText("Prevenir daño futuro");
    fireEvent.click(btn);

    expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
  }, 10000);

  // --- Full flow submission ---

  it("should call onComplete with all fields when fully answered", () => {
    const handler = vi.fn();
    render(<Wizard onComplete={handler} />);

    // TRIAGE — profile, urgency, and all risk toggles
    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("CONTRASEÑAS EXPUESTAS"));
    fireEvent.click(screen.getByText("AUTOBORRADO ACTIVO"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

    // COGNITIVE — emotional distress + shock level
    fireEvent.click(screen.getByText("ANGUSTIA SEVERA"));
    fireEvent.click(screen.getByText("SEVERO"));
    fireEvent.click(screen.getByText("Siguiente Paso: Contexto"));

    // Fill CONTEXT fields
    fireEvent.click(screen.getByText("ACTIVO AHORA"));
    fireEvent.click(screen.getByText("SEMANAS"));
    fireEvent.click(screen.getByText("ALTA"));
    fireEvent.click(screen.getByText("NO TENGO ACCESO"));
    fireEvent.click(screen.getByText("SÍ, HAY TERCEROS"));

    // CONTEXT → DETAILS
    fireEvent.click(screen.getByText("Siguiente Paso: Detalles"));

    // Fill DETAILS fields
    fireEvent.click(screen.getByText("Stalking / persecución"));
    fireEvent.click(screen.getByText("2 dispositivos"));
    fireEvent.click(screen.getByText("Teléfono móvil"));
    fireEvent.click(screen.getByText("Correos electrónicos"));
    fireEvent.click(screen.getByText("Aseguré / bloqueé accesos"));
    fireEvent.click(screen.getByText("Prevenir daño futuro"));

    // Submit from DETAILS
    fireEvent.click(screen.getByText("Finalizar Informe Triage"));

    expect(handler).toHaveBeenCalledTimes(1);
    const result = handler.mock.calls[0][0];
    expect(result.clientProfile).toBe("private_individual");
    expect(result.urgency).toBe("informational");
    // TRIAGE fields
    expect(result.attackerHasPasswords).toBe(true);
    expect(result.evidenceIsAutoDeleted).toBe(true);
    // COGNITIVE fields
    expect(result.hasEmotionalDistress).toBe(true);
    expect(result.cognitiveProfile.emotionalShockLevel).toBe("high");
    // CONTEXT fields
    expect(result.isOngoing).toBe(true);
    expect(result.estimatedIncidentStart).toBe("weeks");
    expect(result.dataSensitivityLevel).toBe("high");
    expect(result.hasAccessToDevices).toBe(false);
    expect(result.thirdPartiesInvolved).toBe(true);
    // DETAILS fields
    expect(result.incident).toBe("stalking");
    expect(result.devices).toBe(2);
    expect(result.evidenceSources).toEqual(["phone device", "email message"]);
    expect(result.actionsTaken).toEqual(["secured contained blocked"]);
    expect(result.objective).toBe("prevent");
  }, 10000);

  it("should use default values for optional DETAILS fields", () => {
    const handler = vi.fn();
    render(<Wizard onComplete={handler} />);

    // TRIAGE
    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

    // COGNITIVE → CONTEXT → DETAILS (skip all)
    fireEvent.click(screen.getByText("Siguiente Paso: Contexto"));
    fireEvent.click(screen.getByText("Siguiente Paso: Detalles"));

    // Select only required fields (incident + objective)
    fireEvent.click(screen.getByText("Acoso / hostigamiento"));
    fireEvent.click(screen.getByText("Documentar / preservar pruebas"));

    // Submit
    fireEvent.click(screen.getByText("Finalizar Informe Triage"));

    expect(handler).toHaveBeenCalledTimes(1);
    const result = handler.mock.calls[0][0];
    expect(result.incident).toBe("harassment");
    expect(result.devices).toBe(0);
    expect(result.actionsTaken).toEqual([]);
    expect(result.evidenceSources).toEqual([]);
    expect(result.objective).toBe("document");
  }, 10000);

  it("should show correct step aria-label for CONTEXT phase", () => {
    goToPhase("CONTEXT");

    const form = screen.getByRole("form");
    expect(form).toHaveAttribute("aria-label", "Paso 3 de 4: Contexto");
  }, 10000);

  it("should show correct step aria-label for DETAILS phase", () => {
    goToPhase("DETAILS");

    const form = screen.getByRole("form");
    expect(form).toHaveAttribute("aria-label", "Paso 4 de 4: Detalles");
  }, 10000);

  it("should include derived contract context metadata when submitting", () => {
    const handler = vi.fn();
    render(<Wizard onComplete={handler} />);

    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("CONTRASEÑAS EXPUESTAS"));
    fireEvent.click(screen.getByText("AUTOBORRADO ACTIVO"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

    fireEvent.click(screen.getByText("Siguiente Paso: Contexto"));

    fireEvent.click(screen.getByText("ALTA"));
    fireEvent.click(screen.getByText("Siguiente Paso: Detalles"));

    fireEvent.click(screen.getByText("Acoso / hostigamiento"));
    fireEvent.click(screen.getByText("Documentar / preservar pruebas"));

    fireEvent.click(screen.getByText("Finalizar Informe Triage"));

    const submitEvent = vi
      .mocked(trackEvent)
      .mock.calls.map(([event]) => event)
      .find((event) => event.name === "wizard.step_submit");

    expect(submitEvent).toBeDefined();

    if (!submitEvent?.payload) {
      throw new Error("wizard.step_submit event payload not found");
    }

    expect(submitEvent.payload).toMatchObject({
      hasEvidenceVolatilitySignal: true,
      hasCredentialCompromiseSignal: true,
      hasSensitivePrivacySignal: true,
    });

    expect(submitEvent.payload.contractSignalCount).toBeGreaterThan(0);
    expect(submitEvent.payload.contractSnippetCount).toBeGreaterThan(0);
  }, 10000);

  // --- UX polish: progress bar, disabled submit, submitting state ---

  it("should render visual progress bar with 4 segments", () => {
    const { container } = render(<Wizard onComplete={onComplete} />);

    // Progress bar is aria-hidden, find the container with 4 segments
    const progressBar = container.querySelector("[aria-hidden='true']");
    expect(progressBar).toBeInTheDocument();

    const segments = progressBar!.querySelectorAll("div");
    expect(segments).toHaveLength(4);
  }, 10000);

  it("should highlight correct progress segments per phase", () => {
    const { container } = render(<Wizard onComplete={onComplete} />);

    const progressBar = container.querySelector("[aria-hidden='true']");
    const segments = progressBar!.querySelectorAll("div");

    // TRIAGE = index 0 → first segment lit, rest dim
    expect(segments[0].className).toContain("bg-white/80");
    expect(segments[1].className).toContain("bg-white/10");
    expect(segments[2].className).toContain("bg-white/10");
    expect(segments[3].className).toContain("bg-white/10");
  }, 10000);

  it("should disable submit button when incident and objective are not selected", () => {
    goToPhase("DETAILS");

    const submitBtn = screen.getByText("Finalizar Informe Triage");
    expect(submitBtn).toBeDisabled();
  }, 10000);

  it("should enable submit button when incident and objective are selected", () => {
    goToPhase("DETAILS");

    fireEvent.click(screen.getByText("Acoso / hostigamiento"));
    fireEvent.click(screen.getByText("Documentar / preservar pruebas"));

    const submitBtn = screen.getByText("Finalizar Informe Triage");
    expect(submitBtn).not.toBeDisabled();
  }, 10000);

  it("should show submitting text after submit is clicked", () => {
    // Use a handler that never resolves to keep isSubmitting=true
    const handler = vi.fn();
    render(<Wizard onComplete={handler} />);

    // Navigate to DETAILS
    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));
    fireEvent.click(screen.getByText("Siguiente Paso: Contexto"));
    fireEvent.click(screen.getByText("Siguiente Paso: Detalles"));

    // Select required fields
    fireEvent.click(screen.getByText("Acoso / hostigamiento"));
    fireEvent.click(screen.getByText("Documentar / preservar pruebas"));

    // Submit
    fireEvent.click(screen.getByText("Finalizar Informe Triage"));

    // After submitting, button should show submitting text
    expect(screen.getByText("Procesando...")).toBeInTheDocument();
  }, 10000);
});
