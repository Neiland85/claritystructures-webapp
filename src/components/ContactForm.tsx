'use client';

import { useState } from 'react';

export type ContactTone = 'basic' | 'family' | 'legal' | 'critical';

type Props = {
  context?: string;
  tone: ContactTone;
};

type CopyBlock = {
  title: string;
  hint: string;
  cta: string;
  warning?: string;
};

const COPY: Record<ContactTone, CopyBlock> = {
  basic: {
    title: 'Consulta inicial',
    hint:
      'Esta evaluación es informativa. Si el caso evoluciona, podrás solicitar custodia técnica.',
    cta: 'Enviar consulta',
  },
  family: {
    title: 'Conflicto familiar o herencia',
    hint:
      'Estos contextos requieren especial cuidado en la preservación de pruebas y la trazabilidad de la información.',
    warning:
      'Evita manipular dispositivos o cuentas antes de recibir indicaciones técnicas.',
    cta: 'Solicitar revisión técnica',
  },
  legal: {
    title: 'Contacto profesional',
    hint:
      'Canal orientado a abogados y procedimientos judiciales en curso. La intervención se realiza bajo criterios de trazabilidad técnica.',
    cta: 'Contactar como profesional',
  },
  critical: {
    title: 'Situación crítica',
    hint:
      'Hemos identificado un contexto con posible impacto legal o emocional grave. La información será tratada con máxima prioridad.',
    warning:
      'No realices acciones adicionales hasta recibir instrucciones técnicas.',
    cta: 'Enviar con prioridad',
  },
};

export default function ContactForm({ context, tone }: Props) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const copy = COPY[tone];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptedLegal) {
      setError('Debes aceptar el aviso legal para continuar.');
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        message,
        context,
        tone,
        acceptedLegal,
      }),
    });

    if (!res.ok) {
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-neutral-400">
        Hemos recibido tu mensaje. Revisaremos la información con atención.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-xl w-full">
      <h1 className="text-2xl font-semibold">{copy.title}</h1>

      <p className="text-sm text-neutral-400">{copy.hint}</p>

      {copy.warning && (
        <p className="text-sm text-red-400">{copy.warning}</p>
      )}

      <input
        type="email"
        required
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 bg-black"
      />

      <textarea
        required
        rows={5}
        placeholder="Describe brevemente la situación"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-3 bg-black"
      />

      <section className="border border-neutral-700 rounded p-4 text-sm text-neutral-400 space-y-3">
        <p>
          Este servicio ofrece una evaluación técnica preliminar orientada a la
          preservación y trazabilidad de información digital.
        </p>
        <p>
          No constituye asesoramiento legal ni pericial, ni sustituye la actuación
          de abogados o autoridades.
        </p>

        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            checked={acceptedLegal}
            onChange={(e) => setAcceptedLegal(e.target.checked)}
          />
          <span>
            He leído y acepto el aviso legal y soy responsable de la información
            aportada.
          </span>
        </label>

        {error && <p className="text-red-500 text-xs">{error}</p>}
      </section>

      <button
        type="submit"
        className="px-6 py-3 bg-white text-black disabled:opacity-50"
      >
        {copy.cta}
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
