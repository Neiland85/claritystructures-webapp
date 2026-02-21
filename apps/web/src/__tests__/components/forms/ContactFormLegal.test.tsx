import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactFormLegal from "@/components/forms/ContactFormLegal";

// Mock dependencies
vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("@/components/ConsentBlock", () => ({
  default: ({
    checked,
    onChange,
  }: {
    tone: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label data-testid="consent-block">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-testid="consent-checkbox"
      />
      Consent
    </label>
  ),
}));

vi.mock("@/components/ContactConfirmation", () => ({
  default: ({ tone }: { tone: string }) => (
    <div data-testid="confirmation">Confirmación ({tone})</div>
  ),
}));

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

function checkConsent() {
  fireEvent.click(screen.getByTestId("consent-checkbox"));
}

function fillAndSubmit(
  email = "abogado@bufete.com",
  phone = "+34600123456",
  message = "Necesito soporte técnico forense urgente.",
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
  checkConsent();
  fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
}

describe("ContactFormLegal", () => {
  it("should render email, phone, textarea, consent, and submit button", () => {
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
    expect(screen.getByTestId("consent-block")).toBeInTheDocument();
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

  it("should show critical aria-label when tone is critical", () => {
    render(<ContactFormLegal context={mockContext} tone="critical" />);

    expect(
      screen.getByRole("form", { name: "Formulario de situación crítica" }),
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

  it("should disable submit button when consent is not checked", () => {
    render(<ContactFormLegal context={mockContext} />);

    const button = screen.getByRole("button", { name: /enviar consulta/i });
    expect(button).toBeDisabled();
  });

  it("should not call fetch when client-side validation fails (short message)", () => {
    render(<ContactFormLegal context={mockContext} />);

    fireEvent.change(screen.getByPlaceholderText("Correo profesional"), {
      target: { value: "abogado@bufete.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Describe tu situación o consulta"),
      { target: { value: "corto" } },
    );
    checkConsent();
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should submit with correct payload including consent", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.email).toBe("abogado@bufete.com");
    expect(callBody.consent).toBe(true);
    expect(callBody.tone).toBe("legal");
    expect(callBody.wizardResult).toBeDefined();
  });

  it("should show loading state during submission", async () => {
    let resolvePromise: (value: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockFetch.mockReturnValueOnce(pendingPromise);

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText("Enviando...")).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: "Enviando..." });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    expect(screen.getByPlaceholderText("Correo profesional")).toBeDisabled();
    expect(screen.getByPlaceholderText("Teléfono (opcional)")).toBeDisabled();
    expect(
      screen.getByPlaceholderText("Describe tu situación o consulta"),
    ).toBeDisabled();

    resolvePromise!({ ok: true, json: async () => ({ success: true }) });
  });

  it("should show ContactConfirmation after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactFormLegal context={mockContext} />);
    fillAndSubmit("profesional@firma.es");

    await waitFor(() => {
      expect(screen.getByTestId("confirmation")).toBeInTheDocument();
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
