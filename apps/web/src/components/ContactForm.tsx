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
  // Parse context from URL params
  const wizardResult = useMemo(() => {
    if (!context) return null;
    try {
      return JSON.parse(decodeURIComponent(context));
    } catch {
      return null;
    }
  }, [context]);

  // Default context
  const defaultContext = {
    clientProfile: "private_individual",
    urgency: "time_sensitive",
    hasLegalIssue: false,
    emotionalState: "calm",
    hasPriorLegalExperience: false,
  };

  const finalContext = wizardResult || defaultContext;

  // Use Legal form for legal/critical, Basic for others
  if (tone === "legal" || tone === "critical") {
    return <ContactFormLegal context={finalContext} />;
  }

  return <ContactFormBasic context={finalContext} />;
}
