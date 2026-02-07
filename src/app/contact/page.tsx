import ContactForm from '@/components/ContactForm';

export default function ContactPage({
  searchParams,
}: {
  searchParams: { context?: string };
}) {
  const context = searchParams?.context
    ? decodeURIComponent(searchParams.context)
    : undefined;

  return (
    <main className="min-h-screen p-8">
      <ContactForm lang="es" context={context} />
    </main>
  );
}
