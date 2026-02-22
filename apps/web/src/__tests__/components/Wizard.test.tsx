import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Wizard from "@/components/Wizard";

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
  phase: "COGNITIVE" | "CONTEXT" | "TRACE",
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

  // CONTEXT → TRACE
  fireEvent.click(screen.getByText("Continuar Trazado Forense"));

  return onComplete;
}

describe("Wizard", () => {
  const onComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- TRIAGE phase ---

  it(
    "should render the TRIAGE phase initially",
    () => {
      render(<Wizard onComplete={onComplete} />);

      expect(
        screen.getByText("Triage de Emergencia Técnica"),
      ).toBeInTheDocument();
      expect(screen.getByText("Situación Actual")).toBeInTheDocument();
      expect(screen.getByText("Nivel de Urgencia")).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  it(
    "should show client profile options",
    () => {
      render(<Wizard onComplete={onComplete} />);

      expect(
        screen.getByText("Particular afectado directamente"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Conflicto familiar / herencia"),
      ).toBeInTheDocument();
      expect(screen.getByText("Abogado / despacho legal")).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  it(
    "should disable next button when step 1 is incomplete",
    () => {
      render(<Wizard onComplete={onComplete} />);

      const nextBtn = screen.getByText(
        "Siguiente Paso: Evaluación de Contexto",
      );
      expect(nextBtn).toBeDisabled();
    },
    { timeout: 10000 },
  );

  it(
    "should enable next button when profile and urgency are selected",
    () => {
      render(<Wizard onComplete={onComplete} />);

      fireEvent.click(screen.getByText("Particular afectado directamente"));
      fireEvent.click(screen.getByText("Consulta informativa / preventiva"));

      const nextBtn = screen.getByText(
        "Siguiente Paso: Evaluación de Contexto",
      );
      expect(nextBtn).not.toBeDisabled();
    },
    { timeout: 10000 },
  );

  it(
    "should navigate to COGNITIVE phase on next",
    () => {
      render(<Wizard onComplete={onComplete} />);

      fireEvent.click(screen.getByText("Particular afectado directamente"));
      fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
      fireEvent.click(
        screen.getByText("Siguiente Paso: Evaluación de Contexto"),
      );

      expect(screen.getByText("Evaluación de Estabilidad")).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  it(
    "should navigate back from COGNITIVE to TRIAGE",
    () => {
      goToPhase("COGNITIVE");

      fireEvent.click(screen.getByText("Volver"));

      expect(
        screen.getByText("Triage de Emergencia Técnica"),
      ).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  it(
    "should set physicalSafetyRisk via radio buttons",
    () => {
      render(<Wizard onComplete={onComplete} />);

      const threatBtn = screen.getByText("AMENAZA REAL");
      fireEvent.click(threatBtn);

      expect(threatBtn.closest("button")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    },
    { timeout: 10000 },
  );

  it(
    "should set attackerHasPasswords via radio buttons",
    () => {
      render(<Wizard onComplete={onComplete} />);

      const btn = screen.getByText("CONTRASEÑAS EXPUESTAS");
      fireEvent.click(btn);

      expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
    },
    { timeout: 10000 },
  );

  it(
    "should set evidenceIsAutoDeleted via radio buttons",
    () => {
      render(<Wizard onComplete={onComplete} />);

      const btn = screen.getByText("AUTOBORRADO ACTIVO");
      fireEvent.click(btn);

      expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
    },
    { timeout: 10000 },
  );

  it(
    "should set hasEmotionalDistress in COGNITIVE phase",
    () => {
      goToPhase("COGNITIVE");

      const btn = screen.getByText("ANGUSTIA SEVERA");
      fireEvent.click(btn);

      expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
    },
    { timeout: 10000 },
  );

  it(
    "should set shockLevel in COGNITIVE phase",
    () => {
      goToPhase("COGNITIVE");

      const btn = screen.getByText("SEVERO");
      fireEvent.click(btn);

      expect(btn.closest("button")).toHaveAttribute("aria-checked", "true");
    },
    { timeout: 10000 },
  );

  it(
    "should have proper ARIA attributes on radiogroups",
    () => {
      render(<Wizard onComplete={onComplete} />);

      const radiogroups = screen.getAllByRole("radiogroup");
      expect(radiogroups.length).toBeGreaterThanOrEqual(2);

      const radios = screen.getAllByRole("radio");
      expect(radios.length).toBeGreaterThan(0);
    },
    { timeout: 10000 },
  );

  it(
    "should show form step progress indicator with 4 steps",
    () => {
      render(<Wizard onComplete={onComplete} />);

      const nav = screen.getByLabelText("Progreso del formulario");
      expect(nav).toBeInTheDocument();

      const items = nav.querySelectorAll("li");
      expect(items).toHaveLength(4);
      expect(items[0].textContent).toContain("Triage");
      expect(items[1].textContent).toContain("Evaluación");
      expect(items[2].textContent).toContain("Contexto");
      expect(items[3].textContent).toContain("Trazado");
    },
    { timeout: 10000 },
  );

  // --- COGNITIVE → CONTEXT navigation ---

  it(
    "should navigate from COGNITIVE to CONTEXT phase",
    () => {
      goToPhase("CONTEXT");

      expect(screen.getByText("Contexto del Incidente")).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  it(
    "should navigate back from CONTEXT to COGNITIVE",
    () => {
      goToPhase("CONTEXT");

      fireEvent.click(screen.getByText("Volver"));

      expect(screen.getByText("Evaluación de Estabilidad")).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  // --- CONTEXT phase rendering ---

  it(
    "should render all 5 CONTEXT questions",
    () => {
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
    },
    { timeout: 10000 },
  );

  it(
    "should render CONTEXT radiogroups with proper ARIA",
    () => {
      goToPhase("CONTEXT");

      const radiogroups = screen.getAllByRole("radiogroup");
      // 5 questions = 5 radiogroups
      expect(radiogroups).toHaveLength(5);

      // Each should have aria-labelledby
      for (const group of radiogroups) {
        expect(group).toHaveAttribute("aria-labelledby");
      }
    },
    { timeout: 10000 },
  );

  it(
    "should select isOngoing option",
    () => {
      goToPhase("CONTEXT");

      const activeBtn = screen.getByText("ACTIVO AHORA");
      fireEvent.click(activeBtn);

      expect(activeBtn.closest("button")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    },
    { timeout: 10000 },
  );

  it(
    "should select dataSensitivityLevel option",
    () => {
      goToPhase("CONTEXT");

      const highBtn = screen.getByText("ALTA");
      fireEvent.click(highBtn);

      expect(highBtn.closest("button")).toHaveAttribute("aria-checked", "true");
    },
    { timeout: 10000 },
  );

  it(
    "should select estimatedIncidentStart option",
    () => {
      goToPhase("CONTEXT");

      const weeksBtn = screen.getByText("SEMANAS");
      fireEvent.click(weeksBtn);

      expect(weeksBtn.closest("button")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    },
    { timeout: 10000 },
  );

  it(
    "should select hasAccessToDevices option",
    () => {
      goToPhase("CONTEXT");

      const noAccessBtn = screen.getByText("NO TENGO ACCESO");
      fireEvent.click(noAccessBtn);

      expect(noAccessBtn.closest("button")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    },
    { timeout: 10000 },
  );

  it(
    "should select thirdPartiesInvolved option",
    () => {
      goToPhase("CONTEXT");

      const yesBtn = screen.getByText("SÍ, HAY TERCEROS");
      fireEvent.click(yesBtn);

      expect(yesBtn.closest("button")).toHaveAttribute("aria-checked", "true");
    },
    { timeout: 10000 },
  );

  // --- CONTEXT → TRACE navigation ---

  it(
    "should navigate from CONTEXT to TRACE phase",
    () => {
      goToPhase("TRACE");

      expect(
        screen.getByText("Trazado de Narrativa Forense"),
      ).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  it(
    "should navigate back from TRACE to CONTEXT",
    () => {
      goToPhase("TRACE");

      fireEvent.click(screen.getByText("Volver"));

      expect(screen.getByText("Contexto del Incidente")).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  // --- Full flow submission ---

  it(
    "should call onComplete with all fields when fully answered",
    () => {
      const handler = vi.fn();
      render(<Wizard onComplete={handler} />);

      // TRIAGE — profile, urgency, and all risk toggles
      fireEvent.click(screen.getByText("Particular afectado directamente"));
      fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
      fireEvent.click(screen.getByText("CONTRASEÑAS EXPUESTAS"));
      fireEvent.click(screen.getByText("AUTOBORRADO ACTIVO"));
      fireEvent.click(
        screen.getByText("Siguiente Paso: Evaluación de Contexto"),
      );

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

      // CONTEXT → TRACE
      fireEvent.click(screen.getByText("Continuar Trazado Forense"));

      // Submit
      fireEvent.click(screen.getByText("Finalizar Informe Triage"));

      expect(handler).toHaveBeenCalledTimes(1);
      const result = handler.mock.calls[0][0];
      expect(result.clientProfile).toBe("private_individual");
      expect(result.urgency).toBe("informational");
      // New TRIAGE fields
      expect(result.attackerHasPasswords).toBe(true);
      expect(result.evidenceIsAutoDeleted).toBe(true);
      // New COGNITIVE fields
      expect(result.hasEmotionalDistress).toBe(true);
      expect(result.cognitiveProfile.emotionalShockLevel).toBe("high");
      // V2 CONTEXT fields
      expect(result.isOngoing).toBe(true);
      expect(result.estimatedIncidentStart).toBe("weeks");
      expect(result.dataSensitivityLevel).toBe("high");
      expect(result.hasAccessToDevices).toBe(false);
      expect(result.thirdPartiesInvolved).toBe(true);
    },
    { timeout: 10000 },
  );

  it(
    "should omit V2 fields from result when CONTEXT is skipped (no answers)",
    () => {
      const handler = vi.fn();
      render(<Wizard onComplete={handler} />);

      // TRIAGE
      fireEvent.click(screen.getByText("Particular afectado directamente"));
      fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
      fireEvent.click(
        screen.getByText("Siguiente Paso: Evaluación de Contexto"),
      );

      // COGNITIVE → CONTEXT (skip all) → TRACE
      fireEvent.click(screen.getByText("Siguiente Paso: Contexto"));
      fireEvent.click(screen.getByText("Continuar Trazado Forense"));

      // Submit
      fireEvent.click(screen.getByText("Finalizar Informe Triage"));

      expect(handler).toHaveBeenCalledTimes(1);
      const result = handler.mock.calls[0][0];
      expect(result.clientProfile).toBe("private_individual");
      expect(result.urgency).toBe("informational");
      expect(result).not.toHaveProperty("isOngoing");
      expect(result).not.toHaveProperty("estimatedIncidentStart");
      expect(result).not.toHaveProperty("dataSensitivityLevel");
      expect(result).not.toHaveProperty("hasAccessToDevices");
      expect(result).not.toHaveProperty("thirdPartiesInvolved");
    },
    { timeout: 10000 },
  );

  it(
    "should show correct step aria-label for CONTEXT phase",
    () => {
      goToPhase("CONTEXT");

      const form = screen.getByRole("form");
      expect(form).toHaveAttribute("aria-label", "Paso 3 de 4: Contexto");
    },
    { timeout: 10000 },
  );
});
