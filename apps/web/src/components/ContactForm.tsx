"use client";

import { useState, useEffect } from "react";
import type { IntakeTone, WizardResult } from "@claritystructures/domain";
import { trackEvent } from "@/lib/analytics";

type Props = {
  tone: IntakeTone;
  context?: string;
  wizardResult?: WizardResult | null;
};

export default function ContactForm({ tone, context, wizardResult }: Props) {
  const [loading, setLoading] = useState(false);

  // 🔵 TRACK OPEN
  useEffect(() => {
    trackEvent({
      name: "contact.open",
      timestamp: Date.now(),
      payload: { tone },
    });
  }, [tone]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 🔵 TRACK ATTEMPT
    trackEvent({
      name: "contact.submit_attempt",
      timestamp: Date.now(),
      payload: { tone },
    });

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          tone,
          wizardResult,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed");

      // 🔵 TRACK SUCCESS
      trackEvent({
        name: "contact.submit_success",
        timestamp: Date.now(),
        payload: { tone },
      });

    } catch (err) {
      // 🔵 TRACK ERROR
      trackEvent({
        name: "contact.submit_error",
        timestamp: Date.now(),
        payload: { tone },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
