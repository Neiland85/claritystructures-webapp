import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Consent utility tests.
 * We replace globalThis.localStorage with a simple in-memory mock because the
 * jsdom implementation in this test runner lacks clear/removeItem.
 */
describe("consent utilities", () => {
  const STORAGE_KEY = "clarity_cookie_consent";
  let store: Record<string, string>;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    store = {};
    originalLocalStorage = globalThis.localStorage;

    // Replace localStorage with a simple mock
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
        get length() {
          return Object.keys(store).length;
        },
        key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "localStorage", {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  async function loadModule() {
    return import("@/lib/consent");
  }

  describe("DEFAULT_CONSENT", () => {
    it("should default to necessary only", async () => {
      const { DEFAULT_CONSENT } = await loadModule();
      expect(DEFAULT_CONSENT).toEqual({
        necessary: true,
        analytical: false,
        marketing: false,
      });
    });
  });

  describe("getConsent", () => {
    it("should return null when no consent stored", async () => {
      const { getConsent } = await loadModule();
      expect(getConsent()).toBeNull();
    });

    it("should return stored consent settings", async () => {
      const settings = {
        necessary: true,
        analytical: true,
        marketing: false,
      };
      store[STORAGE_KEY] = JSON.stringify(settings);
      const { getConsent } = await loadModule();
      expect(getConsent()).toEqual(settings);
    });

    it("should return null when stored value is invalid JSON", async () => {
      store[STORAGE_KEY] = "not-json";
      const { getConsent } = await loadModule();
      expect(getConsent()).toBeNull();
    });
  });

  describe("setConsent", () => {
    it("should persist settings to localStorage", async () => {
      const { setConsent } = await loadModule();
      const settings = {
        necessary: true,
        analytical: true,
        marketing: false,
      };
      setConsent(settings);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(settings),
      );
      expect(store[STORAGE_KEY]).toBe(JSON.stringify(settings));
    });

    it("should dispatch a custom event with settings", async () => {
      const { setConsent, CONSENT_CHANGED_EVENT } = await loadModule();
      const handler = vi.fn();
      window.addEventListener(CONSENT_CHANGED_EVENT, handler);

      const settings = {
        necessary: true,
        analytical: true,
        marketing: true,
      };
      setConsent(settings);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual(settings);

      window.removeEventListener(CONSENT_CHANGED_EVENT, handler);
    });
  });

  describe("hasAnalyticalConsent", () => {
    it("should return false when no consent stored", async () => {
      const { hasAnalyticalConsent } = await loadModule();
      expect(hasAnalyticalConsent()).toBe(false);
    });

    it("should return false when analytical is false", async () => {
      store[STORAGE_KEY] = JSON.stringify({
        necessary: true,
        analytical: false,
        marketing: false,
      });
      const { hasAnalyticalConsent } = await loadModule();
      expect(hasAnalyticalConsent()).toBe(false);
    });

    it("should return true when analytical is true", async () => {
      store[STORAGE_KEY] = JSON.stringify({
        necessary: true,
        analytical: true,
        marketing: false,
      });
      const { hasAnalyticalConsent } = await loadModule();
      expect(hasAnalyticalConsent()).toBe(true);
    });
  });

  describe("CONSENT_CHANGED_EVENT", () => {
    it("should have the correct event name", async () => {
      const { CONSENT_CHANGED_EVENT } = await loadModule();
      expect(CONSENT_CHANGED_EVENT).toBe("clarity:consent-changed");
    });
  });
});
