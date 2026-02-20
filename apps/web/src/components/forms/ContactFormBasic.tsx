"use client";

import { useState } from "react";
import type { WizardResult } from "@claritystructures/domain";
import { ContactIntakeSchema } from "@claritystructures/types";
import ConsentBlock from "../ConsentBlock";
import ContactConfirmation from "../ContactConfirmation";
import { trackEvent } from "@/lib/analytics";

type Props = {
  context: WizardResult;
  tone?: "basic" | "family";
};

export default function ContactFormBasic({ context, tone = "basic" }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateLocally() {
    const payload = {
      email,
      message,
      tone,
      wizardResult: context,
      consent,
      consentVersion: "v1",
    };

    const result = ContactIntakeSchema.safeParse(payload);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const mapped: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(flat)) {
        if (msgs && msgs.length > 0) mapped[key] = msgs[0];
      }
      setFieldErrors(mapped);
      return null;
    }

    setFieldErrors({});
    return result.data;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validated = validateLocally();
    if (!validated) return;

    setLoading(true);

    trackEvent({
      name: "contact.submit_attempt",
      timestamp: Date.now(),
      payload: { tone },
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al enviar");
      }

      trackEvent({
        name: "contact.submit_success",
        timestamp: Date.now(),
        payload: { tone },
      });

      setSent(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "No se pudo enviar. Inténtalo de nuevo.";

      trackEvent({
        name: "contact.submit_error",
        timestamp: Date.now(),
        payload: { tone, error: errorMessage },
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return <ContactConfirmation tone={tone} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Formulario de consulta básica"
      className="space-y-4 max-w-xl"
      noValidate
    >
      <p className="text-sm text-neutral-400">
        {tone === "family"
          ? "Canal para conflictos familiares que requieren cautela técnica y preservación de evidencia."
          : "Consulta informativa / preventiva."}
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="basic-email" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="basic-email"
          type="email"
          required
          placeholder="Correo electrónico"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
          }}
          className="w-full border p-3 bg-black"
          disabled={loading}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "basic-email-error" : undefined}
        />
        {fieldErrors.email && (
          <p id="basic-email-error" className="text-xs text-red-400 mt-1">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="basic-message" className="sr-only">
          Mensaje
        </label>
        <textarea
          id="basic-message"
          required
          rows={4}
          placeholder="Cuéntanos brevemente lo que está ocurriendo"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setMessage(e.target.value);
            if (fieldErrors.message)
              setFieldErrors((p) => ({ ...p, message: "" }));
          }}
          className="w-full border p-3 bg-black"
          disabled={loading}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={
            fieldErrors.message ? "basic-message-error" : undefined
          }
        />
        {fieldErrors.message && (
          <p id="basic-message-error" className="text-xs text-red-400 mt-1">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <ConsentBlock tone={tone} checked={consent} onChange={setConsent} />

      <button
        type="submit"
        aria-busy={loading}
        className="px-6 py-3 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50 transition"
        disabled={loading || !consent}
      >
        {loading ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}
