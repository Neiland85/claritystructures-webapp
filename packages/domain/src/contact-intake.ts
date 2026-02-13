import type { WizardResult } from '@claritystructures/types';
import type { IntakeTone } from './intake-records';

export type ContactIntakeInput = WizardResult & {
  email: string;
  message: string;
  tone: IntakeTone;
  consent: boolean;
};
