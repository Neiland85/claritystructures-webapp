'use client';

import { useRouter, usePathname } from 'next/navigation';
import Wizard from './Wizard';
import type { WizardResult } from '@/types/wizard';
import { resolveIntakeRoute } from '@/domain/flow';

export default function Hero() {
  const router = useRouter();
  const pathname = usePathname();

  // Extrae el idioma desde /[lang]
  const lang = pathname.split('/')[1] || 'es';

  function handleComplete(result: WizardResult) {
    const route = resolveIntakeRoute(result);

    const params = new URLSearchParams({
      context: JSON.stringify({
        clientProfile: result.clientProfile,
        urgency: result.urgency,
        hasEmotionalDistress: result.hasEmotionalDistress,
      }),
    });

    router.push(`/${lang}/contact/${route}?${params.toString()}`);
  }

  return (
    <section className="min-h-screen flex items-center justify-center">
      <Wizard onComplete={handleComplete} />
    </section>
  );
}
