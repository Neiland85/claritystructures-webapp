import type { WizardResult } from "./wizard-result";
import type {
  IntakeTone,
  IntakeStatus,
  IntakePriority,
} from "./intake-records";

export type ContactIntakeInput = {
  tone: IntakeTone;
  route: string;
  priority: IntakePriority;
  name?: string;
  email: string;
  message: string;
  phone?: string;
  status: IntakeStatus;
  spamScore?: number;
  meta?: WizardResult;
};
