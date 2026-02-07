export type WizardResult = {
  incident: string;
  urgency: 'low' | 'medium' | 'high';
  devices: number;
  actionsTaken: string[];
  evidenceSources: string[];
  objective: string;
};
