"use client";
import { useMemo } from "react";
import type { IntakeTone } from "@claritystructures/domain";
import ContactFormBasic from "./forms/ContactFormBasic";
import ContactFormLegal from "./forms/ContactFormLegal";

type Props = {
  tone: IntakeTone;
  context?: string;
};

export default function ContactForm({ tone, context }: Props) {
  // Parse context from URL params or sessionStorage
  const wizardResult = useMemo(() => {
    // 1. Try URL context (legacy/backward compatibility)
    if (context) {
      try {
        return JSON.parse(decodeURIComponent(context));
      } catch {
        // Fall through
      }
    }

    // 2. Try sessionStorage (prefered for privacy - DT-01)
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("wizard_result");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // Fall through
        }
      }
    }

    return null;
  }, [context]);

  // Default context
  const defaultContext = {
    clientProfile: "private_individual" as const,
    urgency: "time_sensitive" as const,
    incident: "unspecified",
    devices: 0,
    actionsTaken: [],
    evidenceSources: [],
    objective: "contact",
  };

  const finalContext = wizardResult || defaultContext;

  // Use Legal form for legal/critical, Basic for basic/family
  if (tone === "legal" || tone === "critical") {
    return <ContactFormLegal context={finalContext} tone={tone} />;
  }

  return (
    <ContactFormBasic
      context={finalContext}
      tone={tone === "family" ? "family" : "basic"}
    />
  );
}
