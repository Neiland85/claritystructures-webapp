"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function FunnelTracker() {
  useEffect(() => {
    trackEvent({
      name: "funnel.view",
      timestamp: Date.now(),
      payload: {
        path: window.location.pathname,
      },
    });
  }, []);

  return null;
}
