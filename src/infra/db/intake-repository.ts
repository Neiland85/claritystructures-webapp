import type {
  AuditEventInput,
  ConsentAcceptanceInput,
  ContactIntakeInput,
  InternalAlertInput,
  IntakeStatus,
} from '@/domain/intake-records';
import type { IntakeRepository } from '@/domain/repositories/intake-repository';

import { prisma } from '@/infra/db/client';
import { hashSha256, stableStringify } from '@/infra/db/hash';

export const intakeRepository: IntakeRepository = {
  async createIntake(input: ContactIntakeInput) {
    return prisma.contactIntake.create({
      data: {
        tone: input.tone,
        route: input.route,
        priority: input.priority,
        name: input.name ?? null,
        email: input.email,
        message: input.message,
        phone: input.phone ?? null,
        status: input.status,
        spamScore: input.spamScore ?? null,
        meta: input.meta ?? undefined,
      },
      select: { id: true },
    });
  },

  async updateIntakeStatus(id: string, status: IntakeStatus) {
    await prisma.contactIntake.update({
      where: { id },
      data: { status },
    });
  },

  async createConsentAcceptance(input: ConsentAcceptanceInput) {
    const consentVersion = await prisma.consentVersion.findUnique({
      where: { version: input.consentVersion },
      select: { id: true },
    });

    if (!consentVersion) {
      throw new Error(`Unknown consent version: ${input.consentVersion}`);
    }

    return prisma.consentAcceptance.create({
      data: {
        consentVersionId: consentVersion.id,
        intakeId: input.intakeId,
        acceptedAt: input.acceptedAt,
        ipHash: input.ipHash ?? null,
        userAgent: input.userAgent ?? null,
        locale: input.locale ?? null,
      },
      select: { id: true },
    });
  },

  async createInternalAlert(input: InternalAlertInput) {
    return prisma.internalAlert.create({
      data: {
        intakeId: input.intakeId,
        type: input.type,
        status: input.status,
        createdAt: input.createdAt,
        sentAt: input.sentAt ?? null,
        error: input.error ?? null,
      },
      select: { id: true },
    });
  },

  async createAuditEvent(input: AuditEventInput) {
    const payloadString = stableStringify(input.payload);
    const hash = hashSha256(payloadString);

    return prisma.auditEvent.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        eventType: input.eventType,
        createdAt: input.createdAt,
        payload: input.payload,
        hashSha256: hash,
      },
      select: { id: true },
    });
  },
};
