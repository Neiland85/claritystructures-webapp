import type { WizardResult } from '@/types/wizard';

export type IntakePriority = 'low' | 'medium' | 'high' | 'critical';

export type IntakeAssessment = {
  priority: IntakePriority;
  flags: string[];
  recommendedAction: string;
};

export function assessIntake(result: WizardResult): IntakeAssessment {
  let score = 0;
  const flags: string[] = [];

  // Perfil del cliente
  if (result.clientProfile === 'family_inheritance_conflict') {
    score += 3;
    flags.push('family_conflict');
  }

  if (result.clientProfile === 'court_related') {
    score += 4;
    flags.push('active_procedure');
  }

  if (result.clientProfile === 'legal_professional') {
    score += 2;
    flags.push('legal_professional');
  }

  // Urgencia declarada
  if (result.urgency === 'time_sensitive') score += 2;
  if (result.urgency === 'legal_risk') score += 4;
  if (result.urgency === 'critical') score += 6;

  // Impacto emocional
  if (result.hasEmotionalDistress) {
    score += 2;
    flags.push('emotional_distress');
  }

  // Decisión final
  if (score >= 8) {
    return {
      priority: 'critical',
      flags,
      recommendedAction: 'Immediate human contact and evidence preservation guidance',
    };
  }

  if (score >= 5) {
    return {
      priority: 'high',
      flags,
      recommendedAction: 'Priority review within 24–48h',
    };
  }

  if (score >= 3) {
    return {
      priority: 'medium',
      flags,
      recommendedAction: 'Standard review',
    };
  }

  return {
    priority: 'low',
    flags,
    recommendedAction: 'Deferred or informational response',
  };
}
