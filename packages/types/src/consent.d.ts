import type { IntakeTone } from "./intake";
export type ConsentVersion = "v1";
export type ConsentPayload = {
  tone: IntakeTone;
  consent: boolean;
  consentVersion: ConsentVersion;
};
