'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ContactForm({
  context,
}: {
  context?: string;
}) {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'es';

  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>(
    'idle'
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.email || !data.message) {
      setStatus('error');
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, context }),
    });

    setStatus(res.ok ? 'ok' : 'error');
    if (res.ok) form.reset();
  }

  return (
    <section className="max-w-xl mx-auto p-6 space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder={lang === 'en' ? 'Email' : 'Correo electrónico'}
          className="w-full border rounded p-2"
        />

        <textarea
          name="message"
          required
          placeholder={lang === 'en' ? 'Message' : 'Mensaje'}
          className="w-full border rounded p-2 h-32"
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {status === 'loading'
            ? lang === 'en'
              ? 'Sending…'
              : 'Enviando…'
            : lang === 'en'
            ? 'Send'
            : 'Enviar'}
        </button>
      </form>

      {status === 'ok' && (
        <p className="text-sm text-green-600">
          {lang === 'en'
            ? 'Message sent successfully.'
            : 'Mensaje enviado correctamente.'}
        </p>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-600">
          {lang === 'en'
            ? 'Error sending message. Please try again.'
            : 'Error al enviar el mensaje. Inténtalo de nuevo.'}
        </p>
      )}
    </section>
  );
}
