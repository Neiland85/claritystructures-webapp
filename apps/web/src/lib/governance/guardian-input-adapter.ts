import type { IntakeGovernanceEnvelope } from "@/lib/governance/wizard-result-to-governance-envelope";
import type { GuardianInput } from "@/lib/governance/guardian-decision-builder";

export function createGuardianInputFromEnvelope(
  envelope: IntakeGovernanceEnvelope,
): GuardianInput {
  return {
    requestId: envelope.requestId,
    schemaVersion: envelope.schemaVersion,
    riskLevel: envelope.governanceContext.riskLevel,
    requiresHumanReview: envelope.governanceContext.requiresHumanReview,
    allowsAutomatedPreclassification:
      envelope.governanceContext.allowsAutomatedPreclassification,
    allowsEvidenceHandling: envelope.governanceContext.allowsEvidenceHandling,
    policyBundleVersion: envelope.integrity.policyBundleVersion,
  };
}
