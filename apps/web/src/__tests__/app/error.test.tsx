import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "@/app/error";

describe("GlobalError", () => {
  it("should render error message", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<GlobalError error={error} reset={reset} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("An unexpected error occurred. Please try again."),
    ).toBeInTheDocument();
  });

  it("should call reset when Try again button is clicked", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<GlobalError error={error} reset={reset} />);

    fireEvent.click(screen.getByText("Try again"));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("should display error digest when present", () => {
    const error = Object.assign(new Error("Test error"), {
      digest: "abc123",
    });
    const reset = vi.fn();

    render(<GlobalError error={error} reset={reset} />);

    expect(screen.getByText("Error ID: abc123")).toBeInTheDocument();
  });

  it("should not display digest when not present", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<GlobalError error={error} reset={reset} />);

    expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument();
  });
});
