'use client';

import { useState } from 'react';
import type { WizardResult } from '@/types/wizard';

type Props = {
  context: WizardResult;
};

export default function ContactFormLegal({ context }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
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
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3"
      />

      <input
        placeholder="Rol (abogado, perito, fiscal, etc.)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border p-3"
      />

      <textarea
        rows={4}
        placeholder="Contexto técnico o procesal"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-3"
      />

      <button className="bg-white text-black px-4 py-2 rounded">
        Enviar
      </button>
    </form>
  );
}
