'use client';

import { useState } from 'react';
import type { WizardResult } from '@claritystructures/domain';

type Props = {
  context: WizardResult;
};

export default function ContactFormBasic({ context }: Props) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...context,
          email,
          message,
          tone: 'basic',
          consent: true,
          consentVersion: 'v1',
        }),
      });

      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('No se pudo enviar. Inténtalo de nuevo.');
    }
  }

  if (sent) {
    return (
      <div className="text-sm text-green-400">
        Hemos recibido tu solicitud.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <p className="text-sm text-neutral-400">
        Consulta informativa / preventiva.
      </p>

      <input
        type="email"
        required
        placeholder="Correo electrónico"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        className="w-full border p-3 bg-black"
      />

      <textarea
        required
        rows={4}
        placeholder="Cuéntanos brevemente lo que está ocurriendo"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
        className="w-full border p-3 bg-black"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button className="px-6 py-3 bg-white text-black">
        Enviar consulta
      </button>
    </form>
  );
}
