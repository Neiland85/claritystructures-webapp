'use client';

import { useState } from 'react';
import ConsentBlock from '@/components/ConsentBlock';

type Props = {
  context?: string;
};

export default function ContactFormBasic({ context }: Props) {
  const tone = 'basic';

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(context ?? '');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message,
          tone,
          consent: true,
          consentVersion: 'v1',
        }),
      });

      if (!res.ok) throw new Error();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
import type { WizardResult } from '@/types/wizard';

type Props = {
  context: WizardResult;
};

export default function ContactFormBasic({ context }: Props) {
  const [email, setEmail] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...context, email }),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <p className="text-sm text-gray-400">
        Evaluación informativa. Podrás solicitar custodia técnica si el caso
        evoluciona.
      </p>

      <input
        type="email"
        required
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        release/v0.1.1
        className="w-full p-3 border border-neutral-700 bg-black"
      />

      <textarea
        required
        rows={5}
        placeholder="Cuéntanos brevemente lo que está ocurriendo"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border border-neutral-700 bg-black"
      />

      <ConsentBlock
        tone={tone}
        checked={consent}
        onChange={setConsent}
      />

      <button
        type="submit"
        disabled={!consent}
        className="px-6 py-3 bg-white text-black disabled:opacity-40"
      >
        Enviar consulta
      </button>

      {status === 'sent' && (
        <p className="text-sm text-green-400">
          Hemos recibido tu solicitud.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-400">
          Error al enviar el mensaje.
        </p>
      )}
    </form>
  );
}

import ContactConfirmation from '@/components/ContactConfirmation';

        className="w-full border p-3"
      />

      <button className="bg-white text-black px-4 py-2 rounded">
        Enviar
      </button>
    </form>
  );
}
