import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactForm from "@/components/ContactForm";

// Mock sub-forms as stubs with data-testid
vi.mock("@/components/forms/ContactFormBasic", () => ({
  default: (props: Record<string, unknown>) => (
    <div
      data-testid="basic-form"
      data-context={JSON.stringify(props.context)}
    />
  ),
}));
vi.mock("@/components/forms/ContactFormLegal", () => ({
  default: (props: Record<string, unknown>) => (
    <div
      data-testid="legal-form"
      data-context={JSON.stringify(props.context)}
    />
  ),
}));

const defaultContext = {
  clientProfile: "private_individual",
  urgency: "time_sensitive",
  hasLegalIssue: false,
  emotionalState: "calm",
  hasPriorLegalExperience: false,
};

describe("ContactForm", () => {
  it("should render BasicForm for tone='basic'", () => {
    render(<ContactForm tone="basic" />);

    expect(screen.getByTestId("basic-form")).toBeInTheDocument();
    expect(screen.queryByTestId("legal-form")).not.toBeInTheDocument();
  });

  it("should render LegalForm for tone='legal'", () => {
    render(<ContactForm tone="legal" />);

    expect(screen.getByTestId("legal-form")).toBeInTheDocument();
    expect(screen.queryByTestId("basic-form")).not.toBeInTheDocument();
  });

  it("should render LegalForm for tone='critical'", () => {
    render(<ContactForm tone="critical" />);

    expect(screen.getByTestId("legal-form")).toBeInTheDocument();
    expect(screen.queryByTestId("basic-form")).not.toBeInTheDocument();
  });

  it("should render BasicForm for tone='family'", () => {
    render(<ContactForm tone="family" />);

    expect(screen.getByTestId("basic-form")).toBeInTheDocument();
    expect(screen.queryByTestId("legal-form")).not.toBeInTheDocument();
  });

  it("should parse URL-encoded context correctly", () => {
    const wizardData = { clientProfile: "law_firm", urgency: "critical" };
    const encoded = encodeURIComponent(JSON.stringify(wizardData));

    render(<ContactForm tone="basic" context={encoded} />);

    const form = screen.getByTestId("basic-form");
    expect(JSON.parse(form.getAttribute("data-context")!)).toEqual(wizardData);
  });

  it("should use default context when context prop is undefined", () => {
    render(<ContactForm tone="basic" />);

    const form = screen.getByTestId("basic-form");
    expect(JSON.parse(form.getAttribute("data-context")!)).toEqual(
      defaultContext,
    );
  });

  it("should use default context when context is malformed JSON", () => {
    render(<ContactForm tone="legal" context="not-valid-json" />);

    const form = screen.getByTestId("legal-form");
    expect(JSON.parse(form.getAttribute("data-context")!)).toEqual(
      defaultContext,
    );
  });
});
