'use client';

import { useState } from 'react';
import type { WizardResult, ClientProfile, UrgencyLevel } from '@claritystructures/types';
import { clientProfiles, urgencyLevels } from '@/constants/wizardOptions';

type Props = {
  onComplete: (data: WizardResult) => void;
};

export default function Wizard({ onComplete }: Props) {
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [urgency, setUrgency] = useState<UrgencyLevel | null>(null);
  const [hasEmotionalDistress, setHasEmotionalDistress] = useState<boolean | null>(null);

  function submit() {
    if (!clientProfile || !urgency) return;

    onComplete({
      clientProfile,
      urgency,
      hasEmotionalDistress: hasEmotionalDistress ?? false,
      incident: 'unspecified',
      devices: 0,
      actionsTaken: [],
      evidenceSources: [],
      objective: 'document'
    });
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Client profile */}
      <div>
        <h2 className="font-semibold">Tu situación actual</h2>
        {clientProfiles.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => setClientProfile(opt.value)}
            className={`block w-full text-left p-3 border ${
              clientProfile === opt.value ? 'border-white' : 'border-neutral-700'
            }`}
          >
            <div>{opt.label}</div>
            {opt.description && (
              <div className="text-sm text-neutral-400">{opt.description}</div>
            )}
          </button>
        ))}
      </div>

      {/* Urgency */}
      <div>
        <h2 className="font-semibold">Nivel de urgencia</h2>
        {urgencyLevels.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => setUrgency(opt.value)}
            className={`block w-full text-left p-3 border ${
              urgency === opt.value ? 'border-white' : 'border-neutral-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Emotional distress */}
      <div>
        <h2 className="font-semibold">¿Te está afectando emocionalmente?</h2>
        <div className="flex gap-4">
          <button onClick={() => setHasEmotionalDistress(true)}>Sí</button>
          <button onClick={() => setHasEmotionalDistress(false)}>No</button>
          <button onClick={() => setHasEmotionalDistress(null)}>Prefiero no responder</button>
        </div>
      </div>

      <button
        onClick={submit}
        className="mt-6 px-4 py-2 bg-white text-black"
      >
        Continuar
      </button>
    </div>
  );
}
