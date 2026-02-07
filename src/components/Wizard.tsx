'use client';

import { useState } from 'react';
import type { Lang } from '@/types/lang';

export type WizardResult = {
  incidentType: 'whatsapp' | 'email' | 'sms' | 'other';
  urgency: 'low' | 'medium' | 'high';
  devices: number;
  actionsTaken: string[];
  evidenceSources: string[];
  objective: 'preserve' | 'document' | 'deliver';
};

const ACTIONS = [
  'change_sim',
  'reinstall_app',
  'delete_chats',
  'reset_device',
];

const SOURCES = [
  'whatsapp',
  'email',
  'device',
  'carrier',
  'bank',
];

type WizardProps = {
  lang: Lang;
  onComplete: (data: WizardResult) => void;
};

export default function Wizard({ lang, onComplete }: WizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<WizardResult>>({});
  const [devicesInput, setDevicesInput] = useState('');

  const next = () => setStep((s) => s + 1);

  const t = {
    es: {
      incident: 'Tipo de incidente',
      urgency: 'Urgencia',
      devices: 'Dispositivos afectados',
      actions: 'Acciones realizadas',
      sources: 'Fuentes de evidencia',
      objective: 'Objetivo',
      next: 'Siguiente',
      finish: 'Finalizar',
    },
    en: {
      incident: 'Incident type',
      urgency: 'Urgency',
      devices: 'Affected devices',
      actions: 'Actions taken',
      sources: 'Evidence sources',
      objective: 'Objective',
      next: 'Next',
      finish: 'Finish',
    },
  }[lang];

  return (
    <section className="max-w-xl mx-auto p-6 space-y-6">
      {step === 0 && (
        <Select
          label={t.incident}
          options={['whatsapp', 'email', 'sms', 'other']}
          onSelect={(v) => {
            setData({ ...data, incidentType: v as any });
            next();
          }}
        />
      )}

      {step === 1 && (
        <Select
          label={t.urgency}
          options={['low', 'medium', 'high']}
          onSelect={(v) => {
            setData({ ...data, urgency: v as any });
            next();
          }}
        />
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="font-medium">{t.devices}</label>
          <input
            type="number"
            value={devicesInput}
            onChange={(e) => setDevicesInput(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            className="px-4 py-2 bg-black text-white rounded"
            disabled={!devicesInput || Number(devicesInput) <= 0}
            onClick={() => {
              setData({ ...data, devices: Number(devicesInput) });
              next();
            }}
          >
            {t.next}
          </button>
        </div>
      )}

      {step === 3 && (
        <AutoMultiSelect
          label={t.actions}
          options={ACTIONS}
          onSelect={(v) => {
            setData({ ...data, actionsTaken: v });
            next();
          }}
        />
      )}

      {step === 4 && (
        <AutoMultiSelect
          label={t.sources}
          options={SOURCES}
          onSelect={(v) => {
            setData({ ...data, evidenceSources: v });
            next();
          }}
        />
      )}

      {step === 5 && (
        <Select
          label={t.objective}
          options={['preserve', 'document', 'deliver']}
          onSelect={(v) =>
            onComplete({ ...(data as WizardResult), objective: v as any })
          }
        />
      )}
    </section>
  );
}

function Select({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o}
            className="px-3 py-1 border rounded"
            onClick={() => onSelect(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function AutoMultiSelect({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: string[];
  onSelect: (v: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              className={`px-3 py-1 border rounded ${
                active ? 'bg-black text-white' : ''
              }`}
              onClick={() => {
                const next = active
                  ? selected.filter((x) => x !== o)
                  : [...selected, o];
                setSelected(next);
                onSelect(next);
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
