'use client';

import { useState } from 'react';

/* =========================
   Types
========================= */

type Tone = 'basic' | 'family' | 'legal' | 'critical';

type Props = {
  tone: Tone;
  context?: string;
};

type CopyBase = {
  title: string;
  hint: string;
  cta: string;
};

type CopyWithWarning = CopyBase & {
  warning: string;
};

type Copy = CopyBase | CopyWithWarning;

/* =========================
   Copy by tone
========================= */

const COPY_BY_TONE: Record<Tone, Copy> = {
  basic: {
    title: 'Consulta inicial',
    hint:
      'Esta evaluación es informativa. Si el caso evoluciona, podrás solicitar custodia técnica.',
    cta: 'Enviar consulta',
  },

  family: {
    title: 'Conflicto familiar / herencia',
    hint:
      'Este tipo de situaciones suelen implicar riesgos de pérdida o manipulación de pruebas.',
    warning:
      'Recomendamos no acceder ni modificar dispositivos hasta recibir asesoramiento técnico.',
    cta: 'Solicitar evaluación',
  },

  legal: {
    title: 'Procedimiento judicial en curso',
    hint:
      'Este formulario está orientado a contextos con actuaciones legales ya iniciadas.',
    warning:
      'La preservación de la cadena de custodia puede ser determinante en sede judicial.',
    cta: 'Contactar equipo técnico',
  },

  critical: {
    title: 'Situación crítica',
    hint:
      'Hemos detectado un contexto de alta sensibilidad legal o emocional.',
    warning:
      'Si existe riesgo inmediato para personas o pruebas, actúa con la máxima urgencia.',
    cta: 'Contactar de inmediato',
  },
};

/* =========================
   Component
========================= */

export default function ContactForm({ tone, context }: Props) {
  const copy = COPY_BY_TONE[tone];

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(context ?? '');
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
          email,
          message,
          tone,
          context,
        }),
      });

      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
    }
  }

  if (sent) {
    return (
      <div className="text-neutral-400 max-w-xl">
        Hemos recibido tu mensaje. Revisaremos la información con atención.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl w-full"
    >
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">{copy.title}</h1>
        <p className="text-sm text-neutral-400">{copy.hint}</p>

        {'warning' in copy && (
          <p className="text-sm text-red-400">{copy.warning}</p>
        )}
      </header>

      <div className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="w-full p-3 border border-neutral-700 bg-black"
        />

        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Cuéntanos brevemente lo que está ocurriendo"
          rows={5}
          className="w-full p-3 border border-neutral-700 bg-black"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        className="px-6 py-3 bg-white text-black"
      >
        {copy.cta}
      </button>
    </form>
  );
}
