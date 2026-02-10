'use client';

import type { IntakeTone } from '@/domain/intake-records';

type Props = {
  tone: IntakeTone;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const CONSENT_COPY: Record<
  IntakeTone,
  { text: string; warning?: string }
> = {
  basic: {
    text:
      'Entiendo que esta consulta es informativa y no constituye asesoramiento legal ni pericial.',
  },

  family: {
    text:
      'Declaro que no manipularé ni accederé a dispositivos, cuentas o pruebas hasta recibir indicaciones técnicas.',
    warning:
      'La manipulación de pruebas puede afectar gravemente a su validez legal.',
  },

  legal: {
    text:
      'Confirmo que comprendo la importancia de la cadena de custodia y seguiré estrictamente las indicaciones técnicas.',
    warning:
      'Una actuación incorrecta puede invalidar pruebas en sede judicial.',
  },

  critical: {
    text:
      'Reconozco que esta es una situación crítica y acepto actuar conforme a las indicaciones técnicas inmediatas.',
    warning:
      'Si existe riesgo para personas o pruebas, actúe con la máxima urgencia.',
  },
};

export default function ConsentBlock({
  tone,
  checked,
  onChange,
}: Props) {
  const copy = CONSENT_COPY[tone];

  return (
    <div className="space-y-2 border border-neutral-700 p-4 rounded">
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1"
          required
        />
        <span>{copy.text}</span>
      </label>

      {copy.warning && (
        <p className="text-xs text-red-400">{copy.warning}</p>
      )}
    </div>
  );
}
