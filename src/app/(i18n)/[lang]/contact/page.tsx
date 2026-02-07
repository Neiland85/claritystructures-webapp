import ContactForm from '@/components/ContactForm';

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { context?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <ContactForm context={searchParams?.context} />
    </main>
  );
}
