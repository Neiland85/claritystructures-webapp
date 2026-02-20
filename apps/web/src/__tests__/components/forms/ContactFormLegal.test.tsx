import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactFormLegal from "@/components/forms/ContactFormLegal";

const originalFetch = global.fetch;
const mockFetch = vi.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockReset();
});

afterAll(() => {
  global.fetch = originalFetch;
});

const mockContext = {
  clientProfile: "legal_professional" as const,
  urgency: "critical" as const,
  incident: "Unauthorized access to corporate devices",
  devices: 3,
  actionsTaken: ["isolated_network"],
  evidenceSources: ["logs"],
  objective: "legal_action",
};

function fillAndSubmit(
  email = "abogado@bufete.com",
  phone = "+34600123456",
  message = "Necesito soporte técnico forense.",
) {
  fireEvent.change(screen.getByPlaceholderText("Correo profesional"), {
    target: { value: email },
  });
  if (phone) {
    fireEvent.change(screen.getByPlaceholderText("Teléfono (opcional)"), {
      target: { value: phone },
    });
  }
  fireEvent.change(
    screen.getByPlaceholderText("Describe tu situación o consulta"),
    { target: { value: message } },
  );
  fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
}

describe("ContactFormLegal", () => {
  it("should render email, phone, textarea, and submit button", () => {
    render(<ContactFormLegal context={mockContext} />);

    expect(
      screen.getByPlaceholderText("Correo profesional"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Teléfono (opcional)"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Describe tu situación o consulta"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enviar consulta/i }),
    ).toBeInTheDocument();
  });

  it("should have aria-label on the form", () => {
    render(<ContactFormLegal context={mockContext} />);

    expect(
      screen.getByRole("form", { name: "Formulario de consulta legal" }),
    ).toBeInTheDocument();
  });

  it("should have sr-only labels for accessibility", () => {
    render(<ContactFormLegal context={mockContext} />);

    expect(screen.getByLabelText("Correo profesional")).toBeInTheDocument();
    expect(screen.getByLabelText("Teléfono (opcional)")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Descripción de la consulta"),
    ).toBeInTheDocument();
  });

  it("should submit with correct payload including wizardResult", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "abogado@bufete.com",
          phone: "+34600123456",
          message: "Necesito soporte técnico forense.",
          tone: "legal",
          wizardResult: mockContext,
        }),
      });
    });
  });

  it("should show loading state during submission", async () => {
    // Create a promise we can control
    let resolvePromise: (value: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockFetch.mockReturnValueOnce(pendingPromise);

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit();

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText("Enviando...")).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: "Enviando..." });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    // Inputs should be disabled
    expect(screen.getByPlaceholderText("Correo profesional")).toBeDisabled();
    expect(screen.getByPlaceholderText("Teléfono (opcional)")).toBeDisabled();
    expect(
      screen.getByPlaceholderText("Describe tu situación o consulta"),
    ).toBeDisabled();

    // Resolve to clean up
    resolvePromise!({ ok: true, json: async () => ({ success: true }) });
  });

  it("should show success message with email after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit("profesional@firma.es");

    await waitFor(() => {
      expect(
        screen.getByText(/Hemos recibido tu solicitud/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Te contactaremos pronto al email: profesional@firma.es/,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should show API error message from response body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid email: formato inválido" }),
    });

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit();

    await waitFor(() => {
      expect(
        screen.getByText("Invalid email: formato inválido"),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should show fallback error when API returns no error message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText("Error al enviar")).toBeInTheDocument();
    });
  });

  it("should show fallback error on network failure", async () => {
    mockFetch.mockRejectedValueOnce("network down");

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit();

    await waitFor(() => {
      expect(
        screen.getByText("No se pudo enviar. Inténtalo de nuevo."),
      ).toBeInTheDocument();
    });
  });

  it("should re-enable form after error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    });

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });

    // Form should be re-enabled
    expect(
      screen.getByPlaceholderText("Correo profesional"),
    ).not.toBeDisabled();
    expect(
      screen.getByPlaceholderText("Teléfono (opcional)"),
    ).not.toBeDisabled();
    expect(
      screen.getByPlaceholderText("Describe tu situación o consulta"),
    ).not.toBeDisabled();

    const button = screen.getByRole("button", { name: /enviar consulta/i });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "false");
  });
});
