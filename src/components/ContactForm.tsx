'use client';

import { useState } from 'react';

export default function ContactForm({ lang = 'es', context }: any) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, context }),
    });

    setStatus(res.ok ? 'ok' : 'error');
  }

  return (
    <section className="max-w-xl mx-auto p-6 space-y-4">
      {/* título y texto igual */}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* inputs iguales */}

        <button
          disabled={status === 'loading'}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {status === 'loading' ? 'Enviando…' : 'Enviar'}
        </button>
      </form>

      {status === 'ok' && (
        <p className="text-sm text-green-600">
          Mensaje enviado. Nos pondremos en contacto.
        </p>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-600">
          Error al enviar el mensaje. Inténtalo de nuevo.
        </p>
      )}
    </section>
  );
}
