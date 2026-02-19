import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TriageGate from "@/components/TriageGate";

// Mock TriageTable to avoid its complex dependencies
vi.mock("@/components/TriageTable", () => ({
  default: ({ token }: { token: string }) => (
    <div data-testid="triage-table">TriageTable(token={token})</div>
  ),
}));

describe("TriageGate", () => {
  it("should render the login form initially", () => {
    render(<TriageGate />);

    expect(screen.getByText("Authentication Required")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Access token")).toBeInTheDocument();
    expect(screen.getByText("Unlock Dashboard")).toBeInTheDocument();
  });

  it("should disable submit button when token is empty", () => {
    render(<TriageGate />);

    const button = screen.getByText("Unlock Dashboard");
    expect(button).toBeDisabled();
  });

  it("should enable submit button when token is entered", () => {
    render(<TriageGate />);

    const input = screen.getByPlaceholderText("Access token");
    fireEvent.change(input, { target: { value: "my-secret-token" } });

    const button = screen.getByText("Unlock Dashboard");
    expect(button).not.toBeDisabled();
  });

  it("should render TriageTable after submitting a valid token", () => {
    render(<TriageGate />);

    const input = screen.getByPlaceholderText("Access token");
    fireEvent.change(input, { target: { value: "my-secret-token" } });

    const form = input.closest("form")!;
    fireEvent.submit(form);

    expect(screen.getByTestId("triage-table")).toBeInTheDocument();
    expect(
      screen.getByText("TriageTable(token=my-secret-token)"),
    ).toBeInTheDocument();
  });

  it("should NOT submit when token is whitespace only", () => {
    render(<TriageGate />);

    const input = screen.getByPlaceholderText("Access token");
    fireEvent.change(input, { target: { value: "   " } });

    const form = input.closest("form")!;
    fireEvent.submit(form);

    expect(screen.queryByTestId("triage-table")).not.toBeInTheDocument();
    expect(screen.getByText("Authentication Required")).toBeInTheDocument();
  });

  it("should lock dashboard and return to login form", () => {
    render(<TriageGate />);

    // Authenticate
    const input = screen.getByPlaceholderText("Access token");
    fireEvent.change(input, { target: { value: "token123" } });
    fireEvent.submit(input.closest("form")!);

    expect(screen.getByTestId("triage-table")).toBeInTheDocument();

    // Lock
    fireEvent.click(screen.getByText("Lock Dashboard"));

    expect(screen.queryByTestId("triage-table")).not.toBeInTheDocument();
    expect(screen.getByText("Authentication Required")).toBeInTheDocument();
  });

  it("should use password input type for token field", () => {
    render(<TriageGate />);

    const input = screen.getByPlaceholderText("Access token");
    expect(input).toHaveAttribute("type", "password");
  });
});
