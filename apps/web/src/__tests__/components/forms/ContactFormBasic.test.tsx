import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactFormBasic from "@/components/forms/ContactFormBasic";

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
    <div data-testid="confirmation">Consulta recibida ({tone})</div>
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
  clientProfile: "private_individual" as const,
  urgency: "time_sensitive" as const,
  incident: "Suspicious email received",
  devices: 1,
  actionsTaken: [],
  evidenceSources: [],
  objective: "contact",
};

function fillValidForm() {
  fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Cuéntanos brevemente lo que está ocurriendo"),
    { target: { value: "Test message with enough characters" } },
  );
  fireEvent.click(screen.getByTestId("consent-checkbox"));
}

describe("ContactFormBasic", () => {
  it("should render email input, message textarea, consent, and submit button", () => {
    render(<ContactFormBasic context={mockContext} />);

    expect(
      screen.getByPlaceholderText("Correo electrónico"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("consent-block")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enviar consulta/i }),
    ).toBeInTheDocument();
  });

  it("should have aria-label on the form", () => {
    render(<ContactFormBasic context={mockContext} />);

    expect(
      screen.getByRole("form", { name: "Formulario de consulta básica" }),
    ).toBeInTheDocument();
  });

  it("should have sr-only labels for accessibility", () => {
    render(<ContactFormBasic context={mockContext} />);

    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensaje")).toBeInTheDocument();
  });

  it("should disable submit button when consent is not checked", () => {
    render(<ContactFormBasic context={mockContext} />);

    const button = screen.getByRole("button", { name: /enviar consulta/i });
    expect(button).toBeDisabled();
  });

  it("should not call fetch when client-side validation fails (short message)", () => {
    render(<ContactFormBasic context={mockContext} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
      { target: { value: "short" } },
    );
    fireEvent.click(screen.getByTestId("consent-checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should not call fetch when client-side validation fails (invalid email)", () => {
    render(<ContactFormBasic context={mockContext} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
      { target: { value: "Valid message with enough characters" } },
    );
    fireEvent.click(screen.getByTestId("consent-checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should submit validated payload on successful validation", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactFormBasic context={mockContext} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    // Verify the payload contains expected fields
    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.email).toBe("user@example.com");
    expect(callBody.consent).toBe(true);
    expect(callBody.tone).toBe("basic");
    expect(callBody.wizardResult).toBeDefined();
  });

  it("should show ContactConfirmation after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactFormBasic context={mockContext} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByTestId("confirmation")).toBeInTheDocument();
    });
  });

  it("should show error on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Validation failed" }),
    });

    render(<ContactFormBasic context={mockContext} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByText("Validation failed")).toBeInTheDocument();
    });

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should show fallback error on non-ok response without error field", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<ContactFormBasic context={mockContext} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByText("Error al enviar")).toBeInTheDocument();
    });
  });

  it("should show error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ContactFormBasic context={mockContext} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("should show loading state during submission", async () => {
    let resolvePromise: (value: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockFetch.mockReturnValueOnce(pendingPromise);

    render(<ContactFormBasic context={mockContext} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByText("Enviando...")).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: "Enviando..." });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    resolvePromise!({ ok: true, json: async () => ({ success: true }) });
  });

  it("should clear error on successful retry", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    });

    render(<ContactFormBasic context={mockContext} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByTestId("confirmation")).toBeInTheDocument();
    });
  });
});
