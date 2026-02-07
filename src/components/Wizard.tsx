'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

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

export default function Wizard({
  onComplete,
}: {
  onComplete: (data: WizardResult) => void;
}) {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'es';

  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<WizardResult>>({});
  const [devicesInput, setDevicesInput] = useState('');

  const next = () => setStep((s) => s + 1);

  return (
    <section className="max-w-xl mx-auto p-6 space-y-6">
      {step === 0 && (
        <Select
          label={lang === 'en' ? 'Incident type' : 'Tipo de incidente'}
          options={['whatsapp', 'email', 'sms', 'other']}
          onSelect={(v) => {
            setData({ ...data, incidentType: v as any });
            next();
          }}
        />
      )}

      {step === 1 && (
        <Select
          label={lang === 'en' ? 'Urgency' : 'Urgencia'}
          options={['low', 'medium', 'high']}
          onSelect={(v) => {
            setData({ ...data, urgency: v as any });
            next();
          }}
        />
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="font-medium">
            {lang === 'en' ? 'Affected devices' : 'Dispositivos afectados'}
          </label>
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
            {lang === 'en' ? 'Next' : 'Siguiente'}
          </button>
        </div>
      )}

      {step === 3 && (
        <AutoMultiSelect
          label={lang === 'en' ? 'Actions taken' : 'Acciones realizadas'}
          options={ACTIONS}
          onSelect={(v) => {
            setData({ ...data, actionsTaken: v });
            next();
          }}
        />
      )}

      {step === 4 && (
        <AutoMultiSelect
          label={lang === 'en' ? 'Evidence sources' : 'Fuentes de evidencia'}
          options={SOURCES}
          onSelect={(v) => {
            setData({ ...data, evidenceSources: v });
            next();
          }}
        />
      )}

      {step === 5 && (
        <Select
          label={lang === 'en' ? 'Objective' : 'Objetivo'}
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
