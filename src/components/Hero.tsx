'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Wizard, { WizardResult } from '@/components/Wizard';
import EvidencePreview from '@/components/EvidencePreview';

type Lang = 'es' | 'en';

const COPY: Record<Lang, {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  note: string;
}> = {
  es: {
    eyebrow: 'TRAZABILIDAD TÉCNICA PARA INCIDENTES DIGITALES',
    title: 'Convierte un incidente en un Evidence Pack defendible',
    subtitle:
      'En menos de un minuto, estructura la información mínima necesaria para documentar, preservar y explicar un incidente digital.',
    cta: 'Iniciar diagnóstico (60s)',
    note: 'Vista técnica preliminar. No constituye asesoramiento legal ni pericial.',
  },
  en: {
    eyebrow: 'TECHNICAL TRACEABILITY FOR DIGITAL INCIDENTS',
    title: 'Turn an incident into a defensible Evidence Pack',
    subtitle:
      'In under one minute, structure the minimal information required to document, preserve, and explain a digital incident.',
    cta: 'Start diagnosis (60s)',
    note: 'Preliminary technical view. Not legal or forensic advice.',
  },
};

export default function Hero() {
  const pathname = usePathname();
  const lang: Lang = pathname.startsWith('/en') ? 'en' : 'es';
  const t = COPY[lang];

  const [started, setStarted] = useState(false);
  const [data, setData] = useState<WizardResult | null>(null);

  if (data) {
    return <EvidencePreview data={data} lang={lang} />;
  }

  return (
    <section className="max-w-4xl mx-auto p-8 space-y-8">
      {!started ? (
        <>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-gray-500">
              {t.eyebrow}
            </p>
            <h1 className="text-3xl font-semibold">
              {t.title}
            </h1>
            <p className="text-lg text-gray-700">
              {t.subtitle}
            </p>
          </div>

          <button
            className="px-6 py-3 bg-black text-white rounded"
            onClick={() => setStarted(true)}
          >
            {t.cta}
          </button>

          <p className="text-xs text-gray-500 max-w-xl">
            {t.note}
          </p>
        </>
      ) : (
        <Wizard onComplete={setData} />
      )}
    </section>
  );
}
