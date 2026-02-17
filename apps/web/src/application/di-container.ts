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
import {
  SubmitIntakeUseCase,
  ListIntakesUseCase,
  UpdateIntakeStatusUseCase,
  GetUserDataUseCase,
  DeleteUserDataUseCase,
} from "./use-cases";

/**
 * Factory for SubmitIntakeUseCase with all dependencies injected
 */
// Singleton instances for stateless services
const mailNotifier = new MailNotifier();
const consoleAudit = new ConsoleAuditTrail();

/**
 * Factory for SubmitIntakeUseCase with all dependencies injected
 */
export function createSubmitIntakeUseCase(): SubmitIntakeUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  return new SubmitIntakeUseCase(repository, mailNotifier, consoleAudit);
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
  return new UpdateIntakeStatusUseCase(repository, consoleAudit);
}

/**
 * Factory for GetUserDataUseCase (ARCO-POL: Acceso)
 */
export function createGetUserDataUseCase(): GetUserDataUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  return new GetUserDataUseCase(repository, consoleAudit);
}

/**
 * Factory for DeleteUserDataUseCase (ARCO-POL: Supresión)
 */
export function createDeleteUserDataUseCase(): DeleteUserDataUseCase {
  const repository = new PrismaIntakeRepository(prisma);
  return new DeleteUserDataUseCase(repository, consoleAudit);
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
