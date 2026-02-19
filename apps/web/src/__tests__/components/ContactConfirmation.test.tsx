import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactConfirmation from "@/components/ContactConfirmation";

describe("ContactConfirmation", () => {
  it("should render basic tone confirmation", () => {
    render(<ContactConfirmation tone="basic" />);

    expect(screen.getByText("Consulta recibida")).toBeInTheDocument();
    expect(screen.getByText(/revisaremos la información/i)).toBeInTheDocument();
  });

  it("should render critical tone confirmation", () => {
    render(<ContactConfirmation tone="critical" />);

    expect(screen.getByText("Situación crítica detectada")).toBeInTheDocument();
    expect(screen.getByText(/se tratan con prioridad/i)).toBeInTheDocument();
  });

  it("should render family tone confirmation", () => {
    render(<ContactConfirmation tone="family" />);

    expect(screen.getByText("Solicitud recibida")).toBeInTheDocument();
    expect(
      screen.getByText(/Evita manipular dispositivos/i),
    ).toBeInTheDocument();
  });

  it("should render legal tone confirmation", () => {
    render(<ContactConfirmation tone="legal" />);

    expect(screen.getByText("Contacto registrado")).toBeInTheDocument();
    expect(
      screen.getByText(/cadena de custodia es prioritaria/i),
    ).toBeInTheDocument();
  });

  it("should always show the legal disclaimer", () => {
    render(<ContactConfirmation tone="basic" />);

    expect(
      screen.getByText(/no sustituye asesoramiento legal/i),
    ).toBeInTheDocument();
  });
});
