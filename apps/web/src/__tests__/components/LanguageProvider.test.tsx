import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageProvider, useLang } from "@/components/LanguageProvider";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

/** Helper component that displays the current lang */
function LangDisplay() {
  const lang = useLang();
  return <span data-testid="lang">{lang}</span>;
}

describe("LanguageProvider", () => {
  it("should provide 'es' for Spanish paths", () => {
    mockUsePathname.mockReturnValue("/es/contact");

    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("lang").textContent).toBe("es");
  });

  it("should provide 'en' for English paths", () => {
    mockUsePathname.mockReturnValue("/en/contact");

    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("lang").textContent).toBe("en");
  });

  it("should default to 'es' for root or unknown paths", () => {
    mockUsePathname.mockReturnValue("/");

    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("lang").textContent).toBe("es");
  });
});
