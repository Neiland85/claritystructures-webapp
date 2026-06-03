"use client";

import type { IntakeTone } from "@claritystructures/domain";

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
    title: "Consulta recibida",
    message:
      "Hemos recibido tu consulta. Revisaremos la información y te responderemos por correo electrónico.",
    next: "Si el caso evoluciona, podrás solicitar una evaluación técnica más profunda.",
  },

  family: {
    title: "Solicitud recibida",
    message:
      "Hemos recibido tu mensaje. En conflictos familiares es importante actuar con cautela.",
    next: "Evita manipular dispositivos o cuentas hasta recibir indicaciones técnicas.",
  },

  legal: {
    title: "Contacto registrado",
    message: "Tu solicitud ha sido registrada para análisis técnico.",
    next: "La preservación de la cadena de custodia es prioritaria. Te contactaremos con instrucciones.",
  },

  critical: {
    title: "Solicitud prioritaria registrada",
    message:
      "Hemos recibido tu solicitud y la hemos clasificado para revisión prioritaria.",
    next: "Si existe riesgo inmediato para personas, dispositivos, pruebas o accesos, evita manipular sistemas, borrar archivos o actuar sin orientación técnica o legal.",
  },
};

export default function ContactConfirmation({ tone }: Props) {
  const copy = CONFIRMATION_COPY[tone];

  return (
    <div className="relative max-w-2xl space-y-5 overflow-hidden rounded-3xl border border-cyan-400/20 bg-neutral-950/90 p-6 shadow-2xl shadow-cyan-950/40 ring-1 ring-white/10 backdrop-blur md:p-8">
      <h1 className="bg-gradient-to-r from-white via-cyan-100 to-emerald-100 bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
        {copy.title}
      </h1>

      <p className="max-w-prose text-base leading-7 text-neutral-200">
        {copy.message}
      </p>

      {copy.next && (
        <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          {copy.next}
        </p>
      )}

      <p className="border-t border-white/10 pt-4 text-xs leading-6 text-neutral-400">
        Este canal no sustituye servicios de emergencia, asesoramiento jurídico
        ni intervención pericial formal. Es un servicio de trazado técnico de
        datos y evidencias digitales orientado a ordenar la información inicial,
        preservar el contexto y facilitar una revisión técnica segura.
      </p>
    </div>
  );
}
