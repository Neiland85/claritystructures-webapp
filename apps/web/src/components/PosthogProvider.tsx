"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import {
  hasAnalyticalConsent,
  CONSENT_CHANGED_EVENT,
  type ConsentSettings,
} from "@/lib/consent";

let posthogInitialized = false;

function initPosthog() {
  if (posthogInitialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: false,
  });

  if (typeof window !== "undefined") {
    (window as any).posthog = posthog;
  }
  posthogInitialized = true;
}

export default function PosthogProvider() {
  useEffect(() => {
    // Only initialise if the user has already given analytical consent
    if (hasAnalyticalConsent()) {
      initPosthog();
    }

    // Listen for consent changes (fired by CookieConsent via setConsent)
    function onConsentChange(e: Event) {
      const settings = (e as CustomEvent<ConsentSettings>).detail;
      if (settings.analytical) {
        initPosthog();
      }
      // If analytical is revoked we don't tear down the SDK mid-session,
      // but we stop capturing on next page load (consent check on mount).
    }

    window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChange);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChange);
    };
  }, []);

  return null;
}
