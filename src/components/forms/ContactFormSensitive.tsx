'use client';

import { useState } from 'react';
import type { WizardResult } from '@/types/wizard';

type Props = {
  context: WizardResult;
};

export default function ContactFormSensitive({ context }: Props) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...context, email, message }),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <p className="text-sm text-gray-400">
        Hemos detectado un contexto sensible. Vamos a tratar la información con
        especial cuidado y orden.
      </p>

      <input
        type="email"
        required
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3"
      />

      <textarea
        required
        rows={4}
        placeholder="Cuéntanos brevemente lo que está ocurriendo"
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
