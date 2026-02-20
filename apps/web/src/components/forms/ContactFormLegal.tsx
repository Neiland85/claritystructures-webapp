"use client";
import { useState, type FormEvent, type ChangeEvent } from "react";
import type { WizardResult } from "@claritystructures/domain";
import { ContactIntakeSchema } from "@claritystructures/types";
import ConsentBlock from "../ConsentBlock";
import ContactConfirmation from "../ContactConfirmation";
import { trackEvent } from "@/lib/analytics";

type Props = {
  context: WizardResult;
  tone?: "legal" | "critical";
};

const DESCRIPTION_COPY: Record<"legal" | "critical", string> = {
  legal:
    "Canal orientado a profesionales legales que requieren soporte técnico y trazabilidad digital.",
  critical:
    "Situación clasificada como crítica. Tu solicitud será tratada con máxima prioridad y urgencia.",
};

export default function ContactFormLegal({ context, tone = "legal" }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateLocally() {
    const payload = {
      email,
      phone: phone || undefined,
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

  async function submit(e: FormEvent<HTMLFormElement>) {
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
      onSubmit={submit}
      aria-label={
        tone === "critical"
          ? "Formulario de situación crítica"
          : "Formulario de consulta legal"
      }
      className="space-y-4 max-w-xl"
      noValidate
    >
      <p className="text-sm text-gray-400">{DESCRIPTION_COPY[tone]}</p>

      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="legal-email" className="sr-only">
          Correo profesional
        </label>
        <input
          id="legal-email"
          type="email"
          required
          placeholder="Correo profesional"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
          }}
          className="w-full border border-gray-600 p-3 bg-black text-white rounded"
          disabled={loading}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "legal-email-error" : undefined}
        />
        {fieldErrors.email && (
          <p id="legal-email-error" className="text-xs text-red-400 mt-1">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="legal-phone" className="sr-only">
          Teléfono (opcional)
        </label>
        <input
          id="legal-phone"
          type="tel"
          placeholder="Teléfono (opcional)"
          value={phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPhone(e.target.value);
            if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: "" }));
          }}
          className="w-full border border-gray-600 p-3 bg-black text-white rounded"
          disabled={loading}
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? "legal-phone-error" : undefined}
        />
        {fieldErrors.phone && (
          <p id="legal-phone-error" className="text-xs text-red-400 mt-1">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="legal-message" className="sr-only">
          Descripción de la consulta
        </label>
        <textarea
          id="legal-message"
          rows={4}
          placeholder={
            tone === "critical"
              ? "Describe tu situación con la mayor precisión posible"
              : "Describe tu situación o consulta"
          }
          value={message}
          required
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setMessage(e.target.value);
            if (fieldErrors.message)
              setFieldErrors((p) => ({ ...p, message: "" }));
          }}
          className="w-full border border-gray-600 p-3 bg-black text-white rounded"
          disabled={loading}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={
            fieldErrors.message ? "legal-message-error" : undefined
          }
        />
        {fieldErrors.message && (
          <p id="legal-message-error" className="text-xs text-red-400 mt-1">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <ConsentBlock tone={tone} checked={consent} onChange={setConsent} />

      <button
        type="submit"
        aria-busy={loading}
        className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 disabled:opacity-50 transition"
        disabled={loading || !consent}
      >
        {loading ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}
