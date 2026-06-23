import { PrismaClient } from "../../generated/prisma/index";
import type {
  ConsentRecord,
  ConsentRepository,
} from "@claritystructures/domain";

export class UnknownConsentVersionError extends Error {
  constructor(readonly consentVersion: string) {
    super(`Unknown consent version: ${consentVersion}`);
    this.name = "UnknownConsentVersionError";
  }
}

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
      throw new UnknownConsentVersionError(record.consentVersion);
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
