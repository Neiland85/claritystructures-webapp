import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactFormBasic from "@/components/forms/ContactFormBasic";

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

describe("ContactFormBasic", () => {
  it("should render email input, message textarea, and submit button", () => {
    render(<ContactFormBasic context={mockContext} />);

    expect(
      screen.getByPlaceholderText("Correo electrónico"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar consulta" }),
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

  it("should submit with correct payload including context spread", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactFormBasic context={mockContext} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
      { target: { value: "Test message" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mockContext,
          email: "user@example.com",
          message: "Test message",
          tone: "basic",
          consent: true,
          consentVersion: "v1",
        }),
      });
    });
  });

  it("should show success message after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactFormBasic context={mockContext} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
      { target: { value: "Test message" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));

    await waitFor(() => {
      expect(
        screen.getByText("Hemos recibido tu solicitud."),
      ).toBeInTheDocument();
    });
  });

  it("should show error on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    render(<ContactFormBasic context={mockContext} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
      { target: { value: "Test message" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));

    await waitFor(() => {
      expect(
        screen.getByText("No se pudo enviar. Inténtalo de nuevo."),
      ).toBeInTheDocument();
    });

    // Verify error uses role="alert"
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should show error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ContactFormBasic context={mockContext} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
      { target: { value: "Test message" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));

    await waitFor(() => {
      expect(
        screen.getByText("No se pudo enviar. Inténtalo de nuevo."),
      ).toBeInTheDocument();
    });
  });

  it("should clear error on successful retry", async () => {
    // First attempt fails
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<ContactFormBasic context={mockContext} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Cuéntanos brevemente lo que está ocurriendo",
      ),
      { target: { value: "Test message" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));

    await waitFor(() => {
      expect(
        screen.getByText("No se pudo enviar. Inténtalo de nuevo."),
      ).toBeInTheDocument();
    });

    // Retry succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));

    await waitFor(() => {
      expect(
        screen.getByText("Hemos recibido tu solicitud."),
      ).toBeInTheDocument();
    });
  });
});
