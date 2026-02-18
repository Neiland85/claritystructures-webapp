import type { PrismaClient } from "../../generated/prisma/index";
import type {
  LegalDerivationRepository,
  DerivationConsentRecord,
  DerivationConsentSummary,
} from "@claritystructures/domain";

export class PrismaLegalDerivationRepository implements LegalDerivationRepository {
  constructor(
    private readonly prisma: Pick<PrismaClient, "derivationConsent">,
  ) {}

  async recordConsent(record: DerivationConsentRecord): Promise<string> {
    const row = await this.prisma.derivationConsent.create({
      data: {
        intakeId: record.intakeId,
        recipientEntity: record.recipientEntity,
        ipHash: record.ipHash ?? null,
        userAgent: record.userAgent ?? null,
      },
    });
    return row.id;
  }

  async revokeConsent(consentId: string): Promise<void> {
    await this.prisma.derivationConsent.update({
      where: { id: consentId },
      data: { revokedAt: new Date() },
    });
  }

  async findByIntakeId(
    intakeId: string,
  ): Promise<DerivationConsentSummary | null> {
    const row = await this.prisma.derivationConsent.findFirst({
      where: { intakeId, revokedAt: null },
      orderBy: { consentedAt: "desc" },
    });
    if (!row) return null;
    return {
      id: row.id,
      intakeId: row.intakeId,
      recipientEntity: row.recipientEntity,
      consentedAt: row.consentedAt,
      revokedAt: row.revokedAt,
    };
  }
}
