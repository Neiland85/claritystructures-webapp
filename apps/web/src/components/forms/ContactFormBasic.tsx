"use client";

import { useState } from "react";
import type { WizardResult } from "@claritystructures/domain";
import { ContactIntakeSchema } from "@claritystructures/types/validations/contact-intake.schema";

const BasicFieldsSchema = ContactIntakeSchema.pick({ email: true, message: true });

type Props = {
  context: WizardResult;
};

export default function ContactFormBasic({ context }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateLocally() {
    const payload = { email, message };
    const result = BasicFieldsSchema.safeParse(payload);

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

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...context,
          ...validated,
          tone: "basic",
          consent: true,
          consentVersion: "v1",
        }),
      });

      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("No se pudo enviar. Inténtalo de nuevo.");
    }
  }

  if (sent) {
    return (
      <div className="text-sm text-green-400">Hemos recibido tu solicitud.</div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulario de consulta básica"
      className="space-y-4 max-w-xl"
    >
      <p className="text-sm text-neutral-400">
        Consulta informativa / preventiva.
      </p>

      <div>
        <label htmlFor="basic-email" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="basic-email"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "basic-email-error" : undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            setFieldErrors((prev) => {
              const { email: _, ...rest } = prev;
              return rest;
            });
          }}
          className="w-full border p-3 bg-black"
        />
        {fieldErrors.email && (
          <p id="basic-email-error" className="text-sm text-red-400 mt-1">
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
          rows={4}
          placeholder="Cuéntanos brevemente lo que está ocurriendo"
          value={message}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "basic-message-error" : undefined}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setMessage(e.target.value);
            setFieldErrors((prev) => {
              const { message: _, ...rest } = prev;
              return rest;
            });
          }}
          className="w-full border p-3 bg-black"
        />
        {fieldErrors.message && (
          <p id="basic-message-error" className="text-sm text-red-400 mt-1">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button type="submit" className="px-6 py-3 bg-white text-black">
        Enviar consulta
      </button>
    </form>
  );
}
