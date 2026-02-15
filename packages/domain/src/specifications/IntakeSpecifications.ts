import { Specification } from './Specification';
import type { IntakeDecision } from '../decision';

/**
 * HighPrioritySpecification
 * Checks if intake has high or critical priority
 */
export class HighPrioritySpecification extends Specification<IntakeDecision> {
  isSatisfiedBy(intake: IntakeDecision): boolean {
    return intake.priority === 'high' || intake.priority === 'critical';
  }
}

/**
 * CriticalPrioritySpecification
 * Checks if intake is critical
 */
export class CriticalPrioritySpecification extends Specification<IntakeDecision> {
  isSatisfiedBy(intake: IntakeDecision): boolean {
    return intake.priority === 'critical';
  }
}

/**
 * HasFlagSpecification
 * Checks if intake has specific flag
 */
export class HasFlagSpecification extends Specification<IntakeDecision> {
  constructor(private flag: string) {
    super();
  }

  isSatisfiedBy(intake: IntakeDecision): boolean {
    return intake.flags.includes(this.flag as any);
  }
}

/**
 * RequiresImmediateActionSpecification
 * Combines multiple criteria for immediate action
 */
export class RequiresImmediateActionSpecification extends Specification<IntakeDecision> {
  private spec: Specification<IntakeDecision>;

  constructor() {
    super();
    this.spec = new CriticalPrioritySpecification().or(
      new HasFlagSpecification('legal_risk')
    );
  }

  isSatisfiedBy(intake: IntakeDecision): boolean {
    return this.spec.isSatisfiedBy(intake);
  }
}
