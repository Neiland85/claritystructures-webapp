"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PosthogProvider() {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      capture_pageview: false,
    });

    // Expose globally for our analytics wrapper
    if (typeof window !== "undefined") {
      (window as any).posthog = posthog;
    }
  }, []);

  return null;
}
