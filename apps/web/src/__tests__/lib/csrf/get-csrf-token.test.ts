import { describe, it, expect, vi, afterEach } from "vitest";
import { getCsrfToken } from "@/lib/csrf/get-csrf-token";

describe("getCsrfToken", () => {
  afterEach(() => {
    // Reset document.cookie mock
    vi.restoreAllMocks();
  });

  it("returns null in SSR context (no document)", () => {
    const originalDocument = globalThis.document;
    // @ts-expect-error — simulate SSR
    delete globalThis.document;
    expect(getCsrfToken()).toBeNull();
    globalThis.document = originalDocument;
  });

  it("extracts token from csrf-token cookie", () => {
    Object.defineProperty(document, "cookie", {
      value: "other=123; csrf-token=abc-def-ghi; session=xyz",
      writable: true,
      configurable: true,
    });
    expect(getCsrfToken()).toBe("abc-def-ghi");
  });

  it("returns null when csrf-token cookie is absent", () => {
    Object.defineProperty(document, "cookie", {
      value: "other=123; session=xyz",
      writable: true,
      configurable: true,
    });
    expect(getCsrfToken()).toBeNull();
  });

  it("decodes URI-encoded token values", () => {
    Object.defineProperty(document, "cookie", {
      value: `csrf-token=${encodeURIComponent("tok/en+val")}`,
      writable: true,
      configurable: true,
    });
    expect(getCsrfToken()).toBe("tok/en+val");
  });
});
