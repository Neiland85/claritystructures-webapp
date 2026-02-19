import { describe, it, expect, vi, beforeEach } from "vitest";
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

describe("Wizard", () => {
  const onComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the TRIAGE phase initially", () => {
    render(<Wizard onComplete={onComplete} />);

    expect(
      screen.getByText("Triage de Emergencia Técnica"),
    ).toBeInTheDocument();
    expect(screen.getByText("Situación Actual")).toBeInTheDocument();
    expect(screen.getByText("Nivel de Urgencia")).toBeInTheDocument();
  });

  it("should show client profile options", () => {
    render(<Wizard onComplete={onComplete} />);

    expect(
      screen.getByText("Particular afectado directamente"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Conflicto familiar / herencia"),
    ).toBeInTheDocument();
    expect(screen.getByText("Abogado / despacho legal")).toBeInTheDocument();
  });

  it("should disable next button when step 1 is incomplete", () => {
    render(<Wizard onComplete={onComplete} />);

    const nextBtn = screen.getByText("Siguiente Paso: Evaluación de Contexto");
    expect(nextBtn).toBeDisabled();
  });

  it("should enable next button when profile and urgency are selected", () => {
    render(<Wizard onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));

    const nextBtn = screen.getByText("Siguiente Paso: Evaluación de Contexto");
    expect(nextBtn).not.toBeDisabled();
  });

  it("should navigate to COGNITIVE phase on next", () => {
    render(<Wizard onComplete={onComplete} />);

    // Complete step 1
    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

    expect(screen.getByText("Evaluación de Estabilidad")).toBeInTheDocument();
  });

  it("should navigate back from COGNITIVE to TRIAGE", () => {
    render(<Wizard onComplete={onComplete} />);

    // Go to cognitive
    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

    // Go back
    fireEvent.click(screen.getByText("Volver"));

    expect(
      screen.getByText("Triage de Emergencia Técnica"),
    ).toBeInTheDocument();
  });

  it("should navigate to TRACE phase from COGNITIVE", () => {
    render(<Wizard onComplete={onComplete} />);

    // Go to cognitive
    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

    // Go to trace
    fireEvent.click(screen.getByText("Continuar Trazado Forense"));

    expect(
      screen.getByText("Trazado de Narrativa Forense"),
    ).toBeInTheDocument();
  });

  it("should call onComplete when submitting from TRACE phase", () => {
    render(<Wizard onComplete={onComplete} />);

    // Complete triage
    fireEvent.click(screen.getByText("Particular afectado directamente"));
    fireEvent.click(screen.getByText("Consulta informativa / preventiva"));
    fireEvent.click(screen.getByText("Siguiente Paso: Evaluación de Contexto"));

    // Go to trace
    fireEvent.click(screen.getByText("Continuar Trazado Forense"));

    // Submit
    fireEvent.click(screen.getByText("Finalizar Informe Triage"));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        clientProfile: "private_individual",
        urgency: "informational",
      }),
    );
  });

  it("should set physicalSafetyRisk via radio buttons", () => {
    render(<Wizard onComplete={onComplete} />);

    const threatBtn = screen.getByText("AMENAZA REAL");
    fireEvent.click(threatBtn);

    expect(threatBtn.closest("button")).toHaveAttribute("aria-checked", "true");
  });

  it("should have proper ARIA attributes on radiogroups", () => {
    render(<Wizard onComplete={onComplete} />);

    const radiogroups = screen.getAllByRole("radiogroup");
    expect(radiogroups.length).toBeGreaterThanOrEqual(2);

    // Client profiles group
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(0);
  });

  it("should show form step progress indicator", () => {
    render(<Wizard onComplete={onComplete} />);

    const nav = screen.getByLabelText("Progreso del formulario");
    expect(nav).toBeInTheDocument();
  });
});
