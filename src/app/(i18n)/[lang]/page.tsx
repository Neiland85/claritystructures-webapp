import Hero from '@/components/Hero';

export default function Home({
  params,
}: {
  params: { lang: 'es' | 'en' };
}) {
  return (
    <main className="min-h-screen">
      <Hero lang={params.lang} />
    </main>
  );
}
