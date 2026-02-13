'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { WizardResult } from '@claritystructures/domain';

type Props = {
  context: WizardResult;
};

export default function ContactFormLegal({ context }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...context, email, role, message }),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <p className="text-sm text-gray-400">
        Canal orientado a profesionales legales que requieren soporte técnico y
        trazabilidad digital.
      </p>

      <input
        type="email"
        required
        placeholder="Correo profesional"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        className="w-full border p-3"
      />

      {/* ⚠️ Esto es un INPUT, no un SELECT → por eso HTMLInputElement */}
      <input
        placeholder="Rol (abogado, perito, fiscal, etc.)"
        value={role}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setRole(e.target.value)
        }
        className="w-full border p-3"
      />

      <textarea
        rows={4}
        placeholder="Contexto técnico o procesal"
        value={message}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setMessage(e.target.value)
        }
        className="w-full border p-3"
      />

      <button
        type="submit"
        className="bg-white text-black px-4 py-2 rounded"
      >
        Enviar
      </button>
    </form>
  );
}
