import ContactForm from '@/components/ContactForm';

export default function ContactPage({
  params,
  searchParams,
}: {
  params: { lang: 'es' | 'en' };
  searchParams: { context?: string };
}) {
  const context = searchParams?.context
    ? decodeURIComponent(searchParams.context)
    : undefined;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <ContactForm context={context} />
    </main>
  );
}
