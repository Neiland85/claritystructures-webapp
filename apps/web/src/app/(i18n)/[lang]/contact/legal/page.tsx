import ContactForm from "@/components/ContactForm";

export default function LegalContactPage({
  searchParams,
}: {
  searchParams?: { context?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <ContactForm tone="legal" context={searchParams?.context} />
    </main>
  );
}
