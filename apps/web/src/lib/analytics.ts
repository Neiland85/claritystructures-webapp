import type { FunnelEvent } from "@claritystructures/types";
import { hasAnalyticalConsent } from "@/lib/consent";

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function trackEvent(event: FunnelEvent) {
  if (typeof window === "undefined") return;

  // Respect RGPD: only track when analytical consent is given
  if (!hasAnalyticalConsent()) return;

  if (process.env.NODE_ENV !== "production") {
    console.debug("[ANALYTICS]", event);
  }

  if (window.posthog) {
    window.posthog.capture(event.name, {
      ...event.payload,
      requestId: event.requestId,
      timestamp: event.timestamp,
    });
  }
}
