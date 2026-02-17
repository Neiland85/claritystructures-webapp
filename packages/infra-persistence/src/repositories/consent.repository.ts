import { PrismaClient } from "../../generated/prisma/index";
import type {
  ConsentRecord,
  ConsentRepository,
} from "@claritystructures/domain";

/**
 * PrismaConsentRepository — records consent acceptances linked to intake records.
 *
 * Implements the ConsentRepository port for:
 * - Linking intakes to their consent version at submission time
 * - Finding the currently active consent policy version
 */
export class PrismaConsentRepository implements ConsentRepository {
  constructor(
    private readonly prisma: Pick<
      PrismaClient,
      "consentAcceptance" | "consentVersion"
    >,
  ) {}

  async recordAcceptance(record: ConsentRecord): Promise<void> {
    const version = await this.prisma.consentVersion.findUnique({
      where: { version: record.consentVersion },
      select: { id: true },
    });

    if (!version) {
      console.warn(
        `[ConsentRepository] Unknown consent version: ${record.consentVersion}`,
      );
      return;
    }

    await this.prisma.consentAcceptance.create({
      data: {
        intakeId: record.intakeId,
        consentVersionId: version.id,
        ipHash: record.ipHash ?? null,
        userAgent: record.userAgent ?? null,
        locale: record.locale ?? null,
      },
    });
  }

  async findActiveVersion(): Promise<{ id: string; version: string } | null> {
    const active = await this.prisma.consentVersion.findFirst({
      where: { isActive: true },
      select: { id: true, version: true },
      orderBy: { createdAt: "desc" },
    });

    return active;
  }
}
