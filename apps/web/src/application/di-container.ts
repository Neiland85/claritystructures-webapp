/**
 * Dependency Injection Container
 *
 * Canonical factory for creating use cases with their dependencies.
 * Implements the Dependency Inversion Principle.
 *
 * In production, this could be replaced with a DI framework like:
 * - InversifyJS
 * - TSyringe
 * - Awilix
 */

import {
  PrismaIntakeRepository,
  PrismaAuditTrail,
  PrismaConsentRepository,
  PrismaLegalDerivationRepository,
  PrismaTransferLogRepository,
  PrismaLegalHoldRepository,
  PrismaDeletionLogRepository,
  PrismaSlaRepository,
  prisma,
} from "@claritystructures/infra-persistence";
import {
  MailNotifier,
  ConsoleAuditTrail,
} from "@claritystructures/infra-notifications";
import type { AuditTrail, AuditEvent } from "@claritystructures/domain";
import {
  SubmitIntakeUseCase,
  ListIntakesUseCase,
  UpdateIntakeStatusUseCase,
  GetUserDataUseCase,
  DeleteUserDataUseCase,
  RequestLegalDerivationUseCase,
  GenerateTransferPacketUseCase,
  PurgeExpiredIntakesUseCase,
  CheckSlaBreachesUseCase,
} from "./use-cases";
import { registerEventSubscriptions } from "./event-subscriptions";

/**
 * Composite audit trail: writes to both DB (persistent) and console (observability).
 * Uses Promise.allSettled so a failure in one trail never blocks the other.
 */
class CompositeAuditTrail implements AuditTrail {
  constructor(private readonly trails: AuditTrail[]) {}
  async record(event: AuditEvent): Promise<void> {
    await Promise.allSettled(this.trails.map((t) => t.record(event)));
  }
}

// Singleton instances for stateless services
const mailNotifier = new MailNotifier();
const prismaAudit = new PrismaAuditTrail(prisma);
const consoleAudit = new ConsoleAuditTrail();
const compositeAudit = new CompositeAuditTrail([prismaAudit, consoleAudit]);

// Wire domain event handlers on first load
registerEventSubscriptions(compositeAudit);

/**
 * Factory for SubmitIntakeUseCase with all dependencies injected
 */
export function createSubmitIntakeUseCase(): SubmitIntakeUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  const consentRepo = new PrismaConsentRepository(prisma);
  return new SubmitIntakeUseCase(
    repository,
    mailNotifier,
    compositeAudit,
    consentRepo,
  );
}

/**
 * Factory for ListIntakesUseCase
 */
export function createListIntakesUseCase(): ListIntakesUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  return new ListIntakesUseCase(repository);
}

/**
 * Factory for UpdateIntakeStatusUseCase
 */
export function createUpdateIntakeStatusUseCase(): UpdateIntakeStatusUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  return new UpdateIntakeStatusUseCase(repository, compositeAudit);
}

/**
 * Factory for GetUserDataUseCase (ARCO-POL: Acceso)
 */
export function createGetUserDataUseCase(): GetUserDataUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  return new GetUserDataUseCase(repository, compositeAudit);
}

/**
 * Factory for DeleteUserDataUseCase (ARCO-POL: Supresión)
 */
export function createDeleteUserDataUseCase(): DeleteUserDataUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  return new DeleteUserDataUseCase(repository, compositeAudit);
}

/**
 * Factory for RequestLegalDerivationUseCase
 */
export function createRequestLegalDerivationUseCase(): RequestLegalDerivationUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  const derivation = new PrismaLegalDerivationRepository(prisma);
  return new RequestLegalDerivationUseCase(
    repository,
    derivation,
    compositeAudit,
  );
}

/**
 * Factory for GenerateTransferPacketUseCase
 */
export function createGenerateTransferPacketUseCase(): GenerateTransferPacketUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  const derivation = new PrismaLegalDerivationRepository(prisma);
  const transferLog = new PrismaTransferLogRepository(prisma);
  const sla = new PrismaSlaRepository(prisma);
  return new GenerateTransferPacketUseCase(
    repository,
    derivation,
    transferLog,
    sla,
    compositeAudit,
  );
}

/**
 * Factory for PurgeExpiredIntakesUseCase (Retention Enforcement)
 */
export function createPurgeExpiredIntakesUseCase(): PurgeExpiredIntakesUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  const legalHolds = new PrismaLegalHoldRepository(prisma);
  const deletionLog = new PrismaDeletionLogRepository(prisma);
  return new PurgeExpiredIntakesUseCase(
    repository,
    legalHolds,
    deletionLog,
    compositeAudit,
  );
}

/**
 * Factory for CheckSlaBreachesUseCase (SLA Monitoring)
 */
export function createCheckSlaBreachesUseCase(): CheckSlaBreachesUseCase {
  const sla = new PrismaSlaRepository(prisma);
  return new CheckSlaBreachesUseCase(sla, compositeAudit);
}

/**
 * Cleanup function for graceful shutdown
 */
export async function closeDependencies(): Promise<void> {
  await prisma.$disconnect();
}

// Automatically register graceful shutdown handlers when running in a Node.js environment
if (typeof process !== "undefined" && typeof process.on === "function") {
  const shutdown = () => {
    void closeDependencies();
  };
  process.on("beforeExit", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
