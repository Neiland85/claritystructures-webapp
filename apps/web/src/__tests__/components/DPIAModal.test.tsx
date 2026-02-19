import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DPIAModal from "@/components/DPIAModal";

describe("DPIAModal", () => {
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
  });

  it("should not render when isOpen is false", () => {
    render(<DPIAModal isOpen={false} onClose={onClose} />);

    expect(
      screen.queryByText(/Evaluación de Impacto/i),
    ).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(<DPIAModal isOpen={true} onClose={onClose} />);

    expect(
      screen.getByText(/Evaluación de Impacto en Protección de Datos/i),
    ).toBeInTheDocument();
  });

  it("should have role=dialog and aria-modal", () => {
    render(<DPIAModal isOpen={true} onClose={onClose} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "dpia-modal-title");
  });

  it("should call onClose when close button is clicked", () => {
    render(<DPIAModal isOpen={true} onClose={onClose} />);

    const closeBtn = screen.getByLabelText("Cerrar modal DPIA");
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it("should call onClose when backdrop is clicked", () => {
    render(<DPIAModal isOpen={true} onClose={onClose} />);

    // The backdrop is the aria-hidden overlay div
    const backdrop = screen
      .getByRole("dialog")
      .querySelector("[aria-hidden='true']");
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);

    expect(onClose).toHaveBeenCalled();
  });

  it("should call onClose when footer button is clicked", () => {
    render(<DPIAModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByText("Cerrar e Identificar"));

    expect(onClose).toHaveBeenCalled();
  });

  it("should display RGPD compliance sections", () => {
    render(<DPIAModal isOpen={true} onClose={onClose} />);

    expect(
      screen.getByText(/Identificación del Responsable/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Descripción del Tratamiento/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Necesidad y Proporcionalidad/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Evaluación de Alto Riesgo/i)).toBeInTheDocument();
  });

  it("should display company information", () => {
    render(<DPIAModal isOpen={true} onClose={onClose} />);

    expect(
      screen.getByText("CLARITY STRUCTURES DIGITAL, SOCIEDAD LIMITADA"),
    ).toBeInTheDocument();
    expect(screen.getByText("B26766048")).toBeInTheDocument();
  });
});
