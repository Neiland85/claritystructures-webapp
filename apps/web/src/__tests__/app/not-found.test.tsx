import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("should render 404 heading", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("should show descriptive message", () => {
    render(<NotFound />);

    expect(
      screen.getByText(
        "The page you are looking for does not exist or has been moved.",
      ),
    ).toBeInTheDocument();
  });

  it("should have a link to home page", () => {
    render(<NotFound />);

    const link = screen.getByRole("link", { name: "Return to home" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/es");
  });
});
