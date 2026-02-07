'use client';

import { useState } from 'react';
import Wizard from '@/components/Wizard';
import EvidencePreview from '@/components/EvidencePreview';
import type { WizardResult } from '@/types/wizard';

export default function Hero() {
  const [data, setData] = useState<WizardResult | null>(null);

  if (data) {
    return <EvidencePreview data={data} />;
  }

  return (
    <section className="min-h-screen flex items-center justify-center">
      <Wizard onComplete={setData} />
    </section>
  );
}
