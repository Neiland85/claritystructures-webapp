type PrivacyBoundaryCardProps = {
  title: string;
  text: string;
};

export function PrivacyBoundaryCard({ title, text }: PrivacyBoundaryCardProps) {
  return (
    <div className="rounded-3xl border border-violet-300/30 bg-violet-300/10 p-6">
      <h2 className="text-lg font-semibold text-violet-100">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-violet-50/80">{text}</p>
    </div>
  );
}
