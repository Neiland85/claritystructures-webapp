'use client';

import { useState } from 'react';
import Wizard, { WizardResult } from '@/components/Wizard';
import EvidencePreview from '@/components/EvidencePreview';

export default function Hero() {
  const [started, setStarted] = useState(false);
  const [data, setData] = useState<WizardResult | null>(null);

  if (data) {
    return <EvidencePreview data={data} />;
  }

  return (
    <section className="max-w-4xl mx-auto p-8 space-y-8">
      {!started ? (
        <>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-gray-500">
              {/* copy resuelto internamente por pathname */}
            </p>
            <h1 className="text-3xl font-semibold">
              {/* título resuelto internamente */}
            </h1>
            <p className="text-lg text-gray-700">
              {/* subtítulo resuelto internamente */}
            </p>
          </div>

          <button
            className="px-6 py-3 bg-black text-white rounded"
            onClick={() => setStarted(true)}
          >
            {/* CTA resuelto internamente */}
          </button>

          <p className="text-xs text-gray-500 max-w-xl">
            {/* nota resuelta internamente */}
          </p>
        </>
      ) : (
        <Wizard onComplete={setData} />
      )}
    </section>
  );
}
