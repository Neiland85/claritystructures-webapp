'use client';

import type { IntakeTone } from '@claritystructures/domain';

type Props = {
  tone: IntakeTone;
};

const CONFIRMATION_COPY: Record<
  IntakeTone,
  {
    title: string;
    message: string;
    next?: string;
  }
> = {
  basic: {
    title: 'Consulta recibida',
    message:
      'Hemos recibido tu consulta. Revisaremos la información y te responderemos por correo electrónico.',
    next:
      'Si el caso evoluciona, podrás solicitar una evaluación técnica más profunda.',
  },

  family: {
    title: 'Solicitud recibida',
    message:
      'Hemos recibido tu mensaje. En conflictos familiares es importante actuar con cautela.',
    next:
      'Evita manipular dispositivos o cuentas hasta recibir indicaciones técnicas.',
  },

  legal: {
    title: 'Contacto registrado',
    message:
      'Tu solicitud ha sido registrada para análisis técnico.',
    next:
      'La preservación de la cadena de custodia es prioritaria. Te contactaremos con instrucciones.',
  },

  critical: {
    title: 'Situación crítica detectada',
    message:
      'Hemos recibido tu solicitud. Este tipo de situaciones se tratan con prioridad.',
    next:
      'Si existe riesgo inmediato, evita actuar sin indicaciones técnicas.',
  },
};

export default function ContactConfirmation({ tone }: Props) {
  const copy = CONFIRMATION_COPY[tone];

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">{copy.title}</h1>

      <p className="text-neutral-300">{copy.message}</p>

      {copy.next && (
        <p className="text-sm text-neutral-400">{copy.next}</p>
      )}

      <p className="text-xs text-neutral-500">
        Este canal no sustituye asesoramiento legal ni actuaciones de emergencia.
      </p>
    </div>
  );
}
