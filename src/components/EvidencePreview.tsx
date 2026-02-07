'use client';

import type { WizardResult } from './Wizard';

type EvidencePreviewProps = {
  data: WizardResult;
};

export default function EvidencePreview({ data }: EvidencePreviewProps) {
  return (
    <section className="max-w-2xl mx-auto p-6 space-y-6 border rounded">
      <h2 className="text-xl font-semibold">
        Evidence Pack Preview (v0.1)
      </h2>

      <p className="text-sm text-gray-600">
        Documento preliminar generado a partir de la información declarada.
        No constituye asesoramiento legal ni pericial.
      </p>

      <div className="space-y-4">
        <Block title="1. Hechos declarados (no verificados)">
          <ul>
            <li><strong>Tipo de incidente:</strong> {data.incidentType}</li>
            <li><strong>Urgencia:</strong> {data.urgency}</li>
            <li><strong>Dispositivos afectados:</strong> {data.devices}</li>
          </ul>
        </Block>

        <Block title="2. Acciones ya realizadas">
          <ul>
            {data.actionsTaken.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Block>

        <Block title="3. Fuentes de evidencia identificadas">
          <ul>
            {data.evidenceSources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Block>

        <Block title="4. Objetivo declarado">
          <p>{data.objective}</p>
        </Block>

        <Block title="5. Notas de alcance y límites">
          <p>
            Este documento es una vista previa técnica generada automáticamente.
            La preservación, custodia y uso legal de la evidencia requiere
            intervención profesional especializada.
          </p>
        </Block>
      </div>
    </section>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{title}</h3>
      <div className="pl-4 text-sm">{children}</div>
    </div>
  );
}
