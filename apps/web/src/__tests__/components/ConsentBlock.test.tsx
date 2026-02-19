import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConsentBlock from "@/components/ConsentBlock";

describe("ConsentBlock", () => {
  it("should render the basic tone consent text", () => {
    render(<ConsentBlock tone="basic" checked={false} onChange={vi.fn()} />);

    expect(screen.getByText(/consulta es informativa/i)).toBeInTheDocument();
  });

  it("should render warning text for critical tone", () => {
    render(<ConsentBlock tone="critical" checked={false} onChange={vi.fn()} />);

    expect(
      screen.getByText(/riesgo para personas o pruebas/i),
    ).toBeInTheDocument();
  });

  it("should render warning text for legal tone", () => {
    render(<ConsentBlock tone="legal" checked={false} onChange={vi.fn()} />);

    expect(
      screen.getByText(/invalidar pruebas en sede judicial/i),
    ).toBeInTheDocument();
  });

  it("should NOT render warning for basic tone", () => {
    const { container } = render(
      <ConsentBlock tone="basic" checked={false} onChange={vi.fn()} />,
    );

    expect(container.querySelector(".text-red-400")).not.toBeInTheDocument();
  });

  it("should call onChange when checkbox is toggled", () => {
    const onChange = vi.fn();
    render(<ConsentBlock tone="basic" checked={false} onChange={onChange} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("should reflect checked state", () => {
    render(<ConsentBlock tone="basic" checked={true} onChange={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should mark checkbox as required", () => {
    render(<ConsentBlock tone="basic" checked={false} onChange={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeRequired();
  });
});
