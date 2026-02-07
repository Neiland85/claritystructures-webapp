'use client';

import { useState } from 'react';

type Props = {
  context?: string;
};

export default function ContactForm({ context }: Props) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, context }),
      });

      if (!res.ok) throw new Error();
      setStatus('sent');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded border bg-transparent px-3 py-2"
      />

      <textarea
        placeholder="Describe brevemente tu situación"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={5}
        className="w-full rounded border bg-transparent px-3 py-2"
      />

      <button
        type="submit"
        className="rounded bg-white px-4 py-2 text-black"
      >
        Enviar
      </button>

      {status === 'sent' && (
        <p className="text-green-500 text-sm">Mensaje enviado correctamente.</p>
      )}
      {status === 'error' && (
        <p className="text-red-500 text-sm">Error al enviar el mensaje.</p>
      )}
    </form>
  );
}
