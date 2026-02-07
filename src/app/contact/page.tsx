import ContactForm from '@/components/ContactForm';

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ context?: string }>;
}) {
  const params = await searchParams;
  const context = params?.context
    ? decodeURIComponent(params.context)
    : undefined;

  return (
    <main className="min-h-screen p-8 space-y-6">
      {context && (
        <section className="max-w-xl mx-auto p-4 border rounded text-sm text-gray-700">
          <h2 className="font-medium mb-2">Resumen del incidente</h2>
          <pre className="whitespace-pre-wrap text-xs bg-black/5 p-3 rounded">
            {context}
          </pre>
        </section>
      )}

      <ContactForm lang="es" context={context} />
    </main>
  );
}
