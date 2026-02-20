import type { WizardResult } from "@claritystructures/domain";

type Props = {
  data: WizardResult;
};

export default function EvidencePreview({ data }: Props) {
  return (
    <pre
      className="text-sm opacity-80 whitespace-pre-wrap"
      aria-label="Evidence data preview"
      role="region"
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
