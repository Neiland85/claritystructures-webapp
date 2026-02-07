'use client';

import { useState } from 'react';

export type WizardResult = {
  incidentType: 'whatsapp' | 'sms' | 'email' | 'other';
  urgency: 'low' | 'medium' | 'high';
  devices: number;
  actionsTaken: string[];
  evidenceSources: string[];
  objective: 'preserve' | 'document' | 'deliver';
};

type WizardProps = {
  onComplete: (result: WizardResult) => void;
};

const ACTIONS = [
  { id: 'reinstall_app', label: 'Reinstalar la aplicación' },
  { id: 'change_sim', label: 'Cambiar SIM' },
  { id: 'delete_chats', label: 'Borrar chats' },
  { id: 'reset_device', label: 'Restablecer el dispositivo' },
  { id: 'none', label: 'Ninguna' }
];

const SOURCES = [
  { id: 'device', label: 'Dispositivo móvil' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'email', label: 'Correo electrónico' },
  { id: 'carrier', label: 'Operadora' },
  { id: 'bank', label: 'Banco' },
  { id: 'screenshots', label: 'Capturas de pantalla' }
];

export default function Wizard({ onComplete }: WizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<WizardResult>>({});

  const update = <K extends keyof WizardResult>(key: K, value: WizardResult[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleArrayValue = (
    key: 'actionsTaken' | 'evidenceSources',
    value: string
  ) => {
    const current = (data[key] ?? []) as string[];
    update(
      key as any,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!data.incidentType;
      case 1:
        return !!data.urgency;
      case 2:
        return typeof data.devices === 'number';
      case 3:
        return (data.actionsTaken ?? []).length > 0;
      case 4:
        return (data.evidenceSources ?? []).length > 0;
      case 5:
        return !!data.objective;
      default:
        return false;
    }
  };

  const submit = () => onComplete(data as WizardResult);

  return (
    <section className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">
        Incidente en 60 segundos
      </h2>

      {step === 0 && (
        <fieldset className="space-y-2">
          <legend className="font-medium">Tipo de incidente</legend>
          {(['whatsapp', 'sms', 'email', 'other'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input
                type="radio"
                name="incidentType"
                checked={data.incidentType === v}
                onChange={() => update('incidentType', v)}
              />
              <span className="capitalize">{v}</span>
            </label>
          ))}
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="space-y-2">
          <legend className="font-medium">Urgencia</legend>
          {(['low', 'medium', 'high'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input
                type="radio"
                name="urgency"
                checked={data.urgency === v}
                onChange={() => update('urgency', v)}
              />
              <span className="capitalize">{v}</span>
            </label>
          ))}
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="space-y-2">
          <legend className="font-medium">Número de dispositivos afectados</legend>
          <select
            className="border rounded p-2 w-full"
            value={data.devices ?? ''}
            onChange={(e) => update('devices', Number(e.target.value))}
          >
            <option value="" disabled>
              Selecciona
            </option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="space-y-2">
          <legend className="font-medium">Acciones ya realizadas</legend>
          {ACTIONS.map((a) => (
            <label key={a.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(data.actionsTaken ?? []).includes(a.id)}
                onChange={() => toggleArrayValue('actionsTaken', a.id)}
              />
              <span>{a.label}</span>
            </label>
          ))}
        </fieldset>
      )}

      {step === 4 && (
        <fieldset className="space-y-2">
          <legend className="font-medium">Fuentes de evidencia disponibles</legend>
          {SOURCES.map((s) => (
            <label key={s.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(data.evidenceSources ?? []).includes(s.id)}
                onChange={() => toggleArrayValue('evidenceSources', s.id)}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </fieldset>
      )}

      {step === 5 && (
        <fieldset className="space-y-2">
          <legend className="font-medium">Objetivo</legend>
          {(['preserve', 'document', 'deliver'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input
                type="radio"
                name="objective"
                checked={data.objective === v}
                onChange={() => update('objective', v)}
              />
              <span className="capitalize">{v}</span>
            </label>
          ))}
        </fieldset>
      )}

      <nav className="flex justify-between pt-4">
        {step > 0 ? (
          <button
            className="px-4 py-2 border rounded"
            onClick={() => setStep((s) => s - 1)}
          >
            Atrás
          </button>
        ) : (
          <span />
        )}

        {step < 5 ? (
          <button
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Siguiente
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            onClick={submit}
            disabled={!canProceed()}
          >
            Generar Evidence Pack Preview
          </button>
        )}
      </nav>
    </section>
  );
}
