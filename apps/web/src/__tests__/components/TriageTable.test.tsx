import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TriageTable from "@/components/TriageTable";

// Mock CSRF
vi.mock("@/lib/csrf/get-csrf-token", () => ({
  getCsrfToken: vi.fn().mockReturnValue("mock-csrf-token"),
}));

const mockIntakes = [
  {
    id: "int-001",
    name: "Ana García",
    email: "ana@example.com",
    message: "Necesito ayuda con un incidente",
    phone: null,
    tone: "legal",
    route: "legal",
    priority: "high" as const,
    status: "pending" as const,
    meta: null,
    createdAt: new Date("2026-01-15").toISOString(),
    updatedAt: new Date("2026-01-15").toISOString(),
  },
  {
    id: "int-002",
    name: "Carlos López",
    email: "carlos@example.com",
    message: "Consulta informativa",
    phone: null,
    tone: "basic",
    route: "basic",
    priority: "low" as const,
    status: "accepted" as const,
    meta: null,
    createdAt: new Date("2026-01-20").toISOString(),
    updatedAt: new Date("2026-01-20").toISOString(),
  },
];

describe("TriageTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("should show loading spinner initially", () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    );
    const { container } = render(<TriageTable token="test-token" />);

    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  it("should render intakes after successful fetch", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ intakes: mockIntakes }),
    });

    render(<TriageTable token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Ana García")).toBeInTheDocument();
    });

    expect(screen.getByText("Carlos López")).toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 2 intakes")).toBeInTheDocument();
  });

  it("should show error on unauthorized response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 401,
      ok: false,
      json: async () => ({}),
    });

    render(<TriageTable token="bad-token" />);

    await waitFor(() => {
      expect(
        screen.getByText("Unauthorized — invalid token"),
      ).toBeInTheDocument();
    });
  });

  it("should show error on network failure", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error"),
    );

    render(<TriageTable token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("should filter intakes by search query", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ intakes: mockIntakes }),
    });

    render(<TriageTable token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Ana García")).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(
      "Buscar intakes por nombre, email o mensaje",
    );
    fireEvent.change(searchInput, { target: { value: "carlos" } });

    expect(screen.queryByText("Ana García")).not.toBeInTheDocument();
    expect(screen.getByText("Carlos López")).toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 2 intakes")).toBeInTheDocument();
  });

  it("should show detail panel when intake row is clicked", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ intakes: mockIntakes }),
    });

    render(<TriageTable token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Ana García")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Ana García"));

    expect(screen.getByText("Intake Detail")).toBeInTheDocument();
    expect(screen.getByText("int-001")).toBeInTheDocument();
  });

  it("should close detail panel when close button is clicked", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ intakes: mockIntakes }),
    });

    render(<TriageTable token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Ana García")).toBeInTheDocument();
    });

    // Open detail
    fireEvent.click(screen.getByText("Ana García"));
    expect(screen.getByText("Intake Detail")).toBeInTheDocument();

    // Close detail
    fireEvent.click(screen.getByLabelText("Cerrar panel de detalle"));
    expect(screen.queryByText("Intake Detail")).not.toBeInTheDocument();
  });

  it("should have accessible search input", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ intakes: mockIntakes }),
    });

    render(<TriageTable token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Ana García")).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(
      "Buscar intakes por nombre, email o mensaje",
    );
    expect(searchInput).toHaveAttribute("type", "search");
  });

  it("should have aria-live on results counter", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ intakes: mockIntakes }),
    });

    render(<TriageTable token="test-token" />);

    await waitFor(() => {
      const counter = screen.getByText("Showing 2 of 2 intakes");
      expect(counter).toHaveAttribute("aria-live", "polite");
    });
  });

  it("should send Authorization header with fetch", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ intakes: [] }),
    });

    render(<TriageTable token="my-secret-token" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/triage",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-secret-token",
          }),
        }),
      );
    });
  });
});
