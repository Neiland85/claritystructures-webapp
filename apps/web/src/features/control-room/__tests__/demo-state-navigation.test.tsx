import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DemoStateNavigation } from "../demo-state-navigation";

describe("DemoStateNavigation", () => {
  it("renders navigable demo resolver states", () => {
    render(<DemoStateNavigation activeCaseId="blocked-case" />);

    expect(
      screen.getByRole("navigation", {
        name: "Control Room demo resolver states",
      }),
    ).toBeTruthy();

    expect(screen.getByText("found")).toBeTruthy();
    expect(screen.getByText("not_found")).toBeTruthy();
    expect(screen.getByText("blocked")).toBeTruthy();
    expect(screen.getByText("unavailable")).toBeTruthy();

    expect(screen.getByText("/control/cases/EV-2026-DEMO")).toBeTruthy();
    expect(screen.getByText("/control/cases/future-real-case")).toBeTruthy();
    expect(screen.getByText("/control/cases/blocked-case")).toBeTruthy();
    expect(screen.getByText("/control/cases/unavailable-case")).toBeTruthy();
  });

  it("marks the active case as the current page", () => {
    render(<DemoStateNavigation activeCaseId="blocked-case" />);

    expect(
      screen.getByText("/control/cases/blocked-case").closest("a"),
    ).toHaveAttribute("aria-current", "page");
  });
});
