export const INTAKE_TONES = ["basic", "family", "legal", "critical"] as const;
export type IntakeTone = (typeof INTAKE_TONES)[number];
