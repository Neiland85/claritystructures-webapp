import type { WizardResult } from './wizard-result';
import type { IntakeTone } from './intake-records';

export type ContactIntakeInput = WizardResult & {
  tone: IntakeTone;
  email: string;
  message: string;
};
