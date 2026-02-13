'use client';

import { useRouter, useParams } from 'next/navigation';
import Wizard from './Wizard';
import { decideIntake } from '@claritystructures/domain';
import type { WizardResult } from '@claritystructures/types';

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
