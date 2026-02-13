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
  prisma,
} from "@claritystructures/infra-persistence";
import {
  MailNotifier,
  ConsoleAuditTrail,
} from "@claritystructures/infra-notifications";
import { SubmitIntakeUseCase } from "./use-cases";

/**
 * Factory for SubmitIntakeUseCase with all dependencies injected
 */
export function createSubmitIntakeUseCase(): SubmitIntakeUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  const notifier = new MailNotifier();
  const audit = new ConsoleAuditTrail();

  return new SubmitIntakeUseCase(repository, notifier, audit);
}

/**
 * Cleanup function for graceful shutdown
 */
export async function closeDependencies(): Promise<void> {
  await prisma.$disconnect();
}
