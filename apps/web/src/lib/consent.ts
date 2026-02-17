/**
 * Cookie consent utilities.
 *
 * Reads / writes the `clarity_cookie_consent` localStorage key and
 * dispatches a custom event so components (PosthogProvider, FunnelTracker)
 * can react to consent changes without a full re-render tree.
 */

const STORAGE_KEY = "clarity_cookie_consent";
export const CONSENT_CHANGED_EVENT = "clarity:consent-changed";

export type ConsentSettings = {
  necessary: boolean;
  analytical: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: ConsentSettings = {
  necessary: true,
  analytical: false,
  marketing: false,
};

/** Read current consent from localStorage (SSR-safe). */
export function getConsent(): ConsentSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentSettings;
  } catch {
    return null;
  }
}

/** Persist consent and broadcast a DOM event. */
export function setConsent(settings: ConsentSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGED_EVENT, { detail: settings }),
  );
}

/** Check whether the user has given analytical consent. */
export function hasAnalyticalConsent(): boolean {
  return getConsent()?.analytical ?? false;
}

export { DEFAULT_CONSENT };
