import ContactForm from '@/components/ContactForm';

export default function FamilyContactPage({
  searchParams,
}: {
  searchParams?: { context?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <ContactForm tone="family" context={searchParams?.context} />
    </main>
  );
}
