export type ConsentPayload = {
  consent: boolean;
  consentVersion: 'v1';
  consentTone: 'basic' | 'family' | 'legal' | 'critical';
};
