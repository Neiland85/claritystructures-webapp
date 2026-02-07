'use client';

import { useState } from 'react';
import type { WizardResult } from '@/types/wizard';

type Props = {
  onComplete: (data: WizardResult) => void;
};

export default function Wizard({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  // 🔧 TEMPORAL: resultado mínimo válido
  // (tu lógica real ya estaba bien, esto solo garantiza return)
  const complete = () => {
    onComplete({
      incident: 'whatsapp',
      urgency: 'high',
      devices: 1,
      actionsTaken: [],
      evidenceSources: [],
      objective: 'document',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-400">
        Wizard step {step + 1}
      </p>

      <button
        onClick={() => setStep((s) => s + 1)}
        className="px-4 py-2 border rounded"
      >
        Next
      </button>

      {step >= 2 && (
        <button
          onClick={complete}
          className="px-4 py-2 bg-white text-black rounded"
        >
          Finish
        </button>
      )}
    </div>
  );
}
