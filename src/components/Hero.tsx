'use client';

import { useState } from 'react';
import Wizard from './Wizard';
import EvidencePreview from './EvidencePreview';

export default function Hero() {
  const [data, setData] = useState<any>(null);

  if (data) {
    return <EvidencePreview data={data} />;
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-6">
      <Wizard onComplete={setData} />

      <p className="text-xs text-gray-500 max-w-xl text-center">
        Evaluación técnica preliminar.  
        No constituye asesoramiento legal ni pericial.
      </p>
    </section>
  );
}
