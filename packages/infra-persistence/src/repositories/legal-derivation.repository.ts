import type { PrismaClient } from "../../generated/prisma/index";
import type {
  LegalDerivationRepository,
  DerivationConsentRecord,
  DerivationConsentSummary,
} from "@claritystructures/domain";
import { sha256Hex } from "@claritystructures/domain";

function buildActiveKey(record: DerivationConsentRecord): string {
  return sha256Hex(
    `legal.derivation.consent:${record.intakeId}:${record.recipientEntity}`,
  );
}

export class PrismaLegalDerivationRepository implements LegalDerivationRepository {
  constructor(
    private readonly prisma: Pick<PrismaClient, "derivationConsent">,
  ) {}

  async recordConsent(record: DerivationConsentRecord): Promise<string> {
    const activeKey = buildActiveKey(record);

    try {
      const row = await this.prisma.derivationConsent.create({
        data: {
          intakeId: record.intakeId,
          recipientEntity: record.recipientEntity,
          ipHash: record.ipHash ?? null,
          userAgent: record.userAgent ?? null,
          activeKey,
        },
      });

      return row.id;
    } catch (error) {
      const existing = await this.prisma.derivationConsent.findFirst({
        where: { activeKey, revokedAt: null },
        select: { id: true },
      });

      if (!existing) throw error;

      return existing.id;
    }
  }

  async revokeConsent(consentId: string): Promise<void> {
    await this.prisma.derivationConsent.update({
      where: { id: consentId },
      data: {
        revokedAt: new Date(),
        activeKey: null,
      },
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
