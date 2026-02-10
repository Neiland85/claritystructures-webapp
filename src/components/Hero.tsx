'use client';

import { useRouter, useParams } from 'next/navigation';
import Wizard from './Wizard';
import { decideIntake } from '@/domain/decision';
import type { WizardResult } from '@/types/wizard';

export default function Hero() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  function handleComplete(result: WizardResult) {
    const decision = decideIntake(result);
    router.push('/' + lang + decision.route);
  }

  return <Wizard onComplete={handleComplete} />;
}
