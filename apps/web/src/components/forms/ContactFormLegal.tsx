"use client";
import { useState, type FormEvent, type ChangeEvent } from "react";
import type { WizardResult } from "@claritystructures/domain";
import { ContactIntakeSchema } from "@claritystructures/types/validations/contact-intake.schema";

const LegalFieldsSchema = ContactIntakeSchema.pick({
  email: true,
  phone: true,
  message: true,
});

type Props = {
  context: WizardResult;
};

export default function ContactFormLegal({ context }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateLocally() {
    const payload: Record<string, unknown> = { email, message };
    if (phone) payload.phone = phone;

    const result = LegalFieldsSchema.safeParse(payload);

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

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validated,
          tone: "legal",
          wizardResult: context,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar");
      }

      setSent(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo enviar. Inténtalo de nuevo.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-green-400 text-lg">
          ✅ Hemos recibido tu solicitud.
        </p>
        <p className="text-sm text-gray-400">
          Te contactaremos pronto al email: {email}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Formulario de consulta legal"
      className="space-y-4 max-w-xl"
    >
      <p className="text-sm text-gray-400">
        Canal orientado a profesionales legales que requieren soporte técnico y
        trazabilidad digital.
      </p>

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
          placeholder="Correo profesional"
          value={email}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "legal-email-error" : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            setFieldErrors((prev) => {
              const { email: _, ...rest } = prev;
              return rest;
            });
          }}
          className="w-full border border-gray-600 p-3 bg-black text-white rounded"
          disabled={loading}
        />
        {fieldErrors.email && (
          <p id="legal-email-error" className="text-sm text-red-400 mt-1">
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
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? "legal-phone-error" : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPhone(e.target.value);
            setFieldErrors((prev) => {
              const { phone: _, ...rest } = prev;
              return rest;
            });
          }}
          className="w-full border border-gray-600 p-3 bg-black text-white rounded"
          disabled={loading}
        />
        {fieldErrors.phone && (
          <p id="legal-phone-error" className="text-sm text-red-400 mt-1">
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
          placeholder="Describe tu situación o consulta"
          value={message}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "legal-message-error" : undefined}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setMessage(e.target.value);
            setFieldErrors((prev) => {
              const { message: _, ...rest } = prev;
              return rest;
            });
          }}
          className="w-full border border-gray-600 p-3 bg-black text-white rounded"
          disabled={loading}
        />
        {fieldErrors.message && (
          <p id="legal-message-error" className="text-sm text-red-400 mt-1">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        aria-busy={loading}
        className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 disabled:opacity-50 transition"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}
