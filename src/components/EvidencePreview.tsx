'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { WizardResult } from './Wizard';

export default function EvidencePreview({ data }: { data: WizardResult }) {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'es';

  const actions = Array.isArray(data.actionsTaken)
    ? data.actionsTaken.join(', ')
    : '-';

  const sources = Array.isArray(data.evidenceSources)
    ? data.evidenceSources.join(', ')
    : '-';

  const context = encodeURIComponent(
    `Incident: ${data.incidentType ?? '-'}
Urgency: ${data.urgency ?? '-'}
Devices: ${data.devices ?? '-'}
Actions: ${actions}
Sources: ${sources}
Objective: ${data.objective ?? '-'}`
  );

  return (
    <section className="max-w-2xl mx-auto p-6 space-y-6 border rounded">
      <h2 className="text-xl font-semibold">
        Evidence Pack Preview (v0.1)
      </h2>

      <p className="text-sm text-gray-600">
        {lang === 'en'
          ? 'Preliminary technical view generated from declared information. Not a final report nor legal advice.'
          : 'Vista técnica preliminar generada a partir de la información declarada. No es un informe final ni asesoramiento legal.'}
      </p>

      <div className="pt-6 flex justify-end">
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={() => router.push(`/${lang}/contact?context=${context}`)}
        >
          {lang === 'en'
            ? 'Continue → Technical contact'
            : 'Continuar → Contacto técnico'}
        </button>
      </div>
    </section>
  );
}
