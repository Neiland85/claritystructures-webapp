import ContactForm from '@/components/ContactForm';
import type { Lang } from '../../../../types/lang';

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: { lang: Lang };
  searchParams?: { context?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <ContactForm
        lang={params.lang}
        context={searchParams?.context}
      />
    </main>
  );
}
