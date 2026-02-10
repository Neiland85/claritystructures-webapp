import type { IntakeTone } from '@/domain/intake-records';

export type ConsentPayload = {
  consent: boolean;
  consentVersion: 'v1';
  consentTone: IntakeTone;
};
