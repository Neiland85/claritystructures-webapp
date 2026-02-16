import ContactForm from "@/components/ContactForm";

export default function BasicContactPage({
  searchParams,
}: {
  searchParams?: { context?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <ContactForm tone="basic" context={searchParams?.context} />
    </main>
  );
}
