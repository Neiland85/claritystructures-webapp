import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CookieConsent from "@/components/CookieConsent";

// Mock consent lib
const { mockGetConsent, mockSetConsent } = vi.hoisted(() => ({
  mockGetConsent: vi.fn().mockReturnValue(null),
  mockSetConsent: vi.fn(),
}));
vi.mock("@/lib/consent", () => ({
  getConsent: mockGetConsent,
  setConsent: mockSetConsent,
  DEFAULT_CONSENT: { necessary: true, analytical: false, marketing: false },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("CookieConsent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetConsent.mockReturnValue(null);
  });

  it("should show banner when no consent is stored", () => {
    render(<CookieConsent />);

    expect(screen.getByText(/Privacidad y Transparencia/i)).toBeInTheDocument();
    expect(screen.getByText("Aceptar todas")).toBeInTheDocument();
    expect(screen.getByText("Rechazar no esenciales")).toBeInTheDocument();
    expect(screen.getByText("Configurar")).toBeInTheDocument();
  });

  it("should NOT show banner when consent already exists", () => {
    mockGetConsent.mockReturnValue({
      necessary: true,
      analytical: true,
      marketing: false,
    });

    render(<CookieConsent />);

    expect(
      screen.queryByText(/Privacidad y Transparencia/i),
    ).not.toBeInTheDocument();
  });

  it("should save all consent on Accept All", () => {
    render(<CookieConsent />);

    fireEvent.click(screen.getByText("Aceptar todas"));

    expect(mockSetConsent).toHaveBeenCalledWith({
      necessary: true,
      analytical: true,
      marketing: true,
    });
  });

  it("should save reject-all on Reject", () => {
    render(<CookieConsent />);

    fireEvent.click(screen.getByText("Rechazar no esenciales"));

    expect(mockSetConsent).toHaveBeenCalledWith({
      necessary: true,
      analytical: false,
      marketing: false,
    });
  });

  it("should show configuration panel when Configure is clicked", () => {
    render(<CookieConsent />);

    fireEvent.click(screen.getByText("Configurar"));

    expect(screen.getByText("Configuración de Cookies")).toBeInTheDocument();
    expect(screen.getByText(/Técnicas y Necesarias/i)).toBeInTheDocument();
    expect(screen.getByText("Analíticas")).toBeInTheDocument();
    expect(
      screen.getByText(/Marketing y Personalización/i),
    ).toBeInTheDocument();
  });

  it("should save custom preferences from config panel", () => {
    render(<CookieConsent />);

    // Open config
    fireEvent.click(screen.getByText("Configurar"));

    // Save defaults (analytical=false, marketing=false)
    fireEvent.click(screen.getByText("Guardar preferencias"));

    expect(mockSetConsent).toHaveBeenCalledWith({
      necessary: true,
      analytical: false,
      marketing: false,
    });
  });

  it("should hide banner after accepting", async () => {
    render(<CookieConsent />);

    expect(screen.getByText(/Privacidad y Transparencia/i)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Aceptar todas"));
    });

    expect(
      screen.queryByText(/Privacidad y Transparencia/i),
    ).not.toBeInTheDocument();
  });

  it("should link to privacy policy", () => {
    render(<CookieConsent />);

    const link = screen.getByText("Política de Privacidad");
    expect(link).toHaveAttribute("href", "/privacy");
  });
});
