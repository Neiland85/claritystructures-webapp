import ContactForm from '@/components/ContactForm';

export default function CriticalContactPage({
  searchParams,
}: {
  searchParams?: { context?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <ContactForm tone="critical" context={searchParams?.context} />
    </main>
  );
}
