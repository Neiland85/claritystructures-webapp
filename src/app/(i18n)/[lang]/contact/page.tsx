import ContactForm from '@/components/ContactForm';

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: { lang: 'es' | 'en' };
  searchParams: Promise<{ context?: string }>;
}) {
  const sp = await searchParams;
  const context = sp?.context ? decodeURIComponent(sp.context) : undefined;

  return (
    <main className="min-h-screen p-8 space-y-6">
      {context && (
        <section className="max-w-xl mx-auto p-4 border rounded text-sm text-gray-700">
          <h2 className="font-medium mb-2">
            {params.lang === 'es'
              ? 'Resumen del incidente'
              : 'Incident summary'}
          </h2>
          <pre className="whitespace-pre-wrap text-xs bg-black/5 p-3 rounded">
            {context}
          </pre>
        </section>
      )}

      <ContactForm lang={params.lang} context={context} />
    </main>
  );
}
