import Hero from '@/components/Hero';
import { Lang } from '@/types/lang';

export default function Home({
  params,
}: {
  params: { lang: Lang };
}) {
  return (
    <main className="min-h-screen">
      <Hero lang={params.lang} />
    </main>
  );
}
