"use client";
import { useState, type FormEvent, type ChangeEvent } from "react";
import type { WizardResult } from "@claritystructures/domain";

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

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          message,
          tone: "legal",
          wizardResult: context,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || "No se pudo enviar. Inténtalo de nuevo.");
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
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <p className="text-sm text-gray-400">
        Canal orientado a profesionales legales que requieren soporte técnico y
        trazabilidad digital.
      </p>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <input
        type="email"
        required
        placeholder="Correo profesional"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        className="w-full border border-gray-600 p-3 bg-black text-white rounded"
        disabled={loading}
      />

      <input
        type="tel"
        placeholder="Teléfono (opcional)"
        value={phone}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
        }
        className="w-full border border-gray-600 p-3 bg-black text-white rounded"
        disabled={loading}
      />

      <textarea
        rows={4}
        placeholder="Describe tu situación o consulta"
        value={message}
        required
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setMessage(e.target.value)
        }
        className="w-full border border-gray-600 p-3 bg-black text-white rounded"
        disabled={loading}
      />

      <button
        type="submit"
        className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 disabled:opacity-50 transition"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}
