'use client';

import type { WizardResult } from './Wizard';
import { useRouter } from 'next/navigation';

export default function EvidencePreview({ data }: { data: WizardResult }) {
  const router = useRouter();

  const context = encodeURIComponent(
    `Incident: ${data.incidentType}
Urgency: ${data.urgency}
Devices: ${data.devices}
Actions: ${data.actionsTaken.join(', ')}
Sources: ${data.evidenceSources.join(', ')}
Objective: ${data.objective}`
  );

  return (
    <section className="max-w-2xl mx-auto p-6 space-y-6 border rounded">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold">Evidence Pack Preview (v0.1)</h2>
        <p className="text-sm text-gray-600">
          Vista técnica preliminar generada a partir de la información declarada.
          No es un informe final ni asesoramiento legal.
        </p>
      </header>

      {/* bloques existentes */}

      <footer className="pt-6 flex justify-end">
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={() => router.push(`/contact?context=${context}`)}
        >
          Continuar → Contacto técnico
        </button>
      </footer>
    </section>
  );
}
