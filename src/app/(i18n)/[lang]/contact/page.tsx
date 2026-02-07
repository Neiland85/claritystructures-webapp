import ContactForm from '@/components/ContactForm';
import type { Lang } from '@/types/lang';

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: { lang: Lang };
  searchParams: Promise<{ context?: string }>;
}) {
  const sp = await searchParams;
  const context = sp?.context ? decodeURIComponent(sp.context) : undefined;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <ContactForm lang={params.lang} context={context} />
    </main>
  );
}
