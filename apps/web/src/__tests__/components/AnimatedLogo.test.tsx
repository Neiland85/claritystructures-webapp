import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AnimatedLogo from "@/components/AnimatedLogo";

describe("AnimatedLogo", () => {
  it("should render without crashing", () => {
    const { container } = render(<AnimatedLogo />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should mark the SVG as aria-hidden (decorative)", () => {
    const { container } = render(<AnimatedLogo />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("should render the brand text CLARITY", () => {
    render(<AnimatedLogo />);
    expect(screen.getByText("CLARITY")).toBeInTheDocument();
    expect(screen.getByText("STRUCTURES SLU")).toBeInTheDocument();
  });
});
