"use client";

import { useRouter, useParams } from "next/navigation";
import Wizard from "./Wizard";

import { decideIntake } from "@claritystructures/domain";
import type { WizardResult } from "@claritystructures/domain";

export default function Hero() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  function handleComplete(result: WizardResult) {
    const decision = decideIntake(result);
    const encodedData = encodeURIComponent(JSON.stringify(result));
    router.push(`/${lang}${decision.route}?data=${encodedData}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-24 sm:py-32">
      <div className="w-full max-w-2xl">
        <Wizard onComplete={handleComplete} />
      </div>
    </div>
  );
}
