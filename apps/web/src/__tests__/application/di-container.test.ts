import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock all external dependencies BEFORE importing the module
vi.mock("@claritystructures/infra-persistence", () => ({
  PrismaIntakeRepository: vi.fn().mockImplementation(() => ({
    save: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
  })),
  PrismaAuditTrail: vi.fn().mockImplementation(() => ({
    record: vi.fn(),
  })),
  PrismaConsentRepository: vi.fn().mockImplementation(() => ({
    recordAcceptance: vi.fn(),
    findActiveVersion: vi.fn(),
  })),
  PrismaLegalDerivationRepository: vi.fn().mockImplementation(() => ({
    recordConsent: vi.fn(),
    findByIntakeId: vi.fn(),
    revokeConsent: vi.fn(),
  })),
  PrismaTransferLogRepository: vi.fn().mockImplementation(() => ({
    recordTransfer: vi.fn(),
    findByIntakeId: vi.fn(),
  })),
  PrismaSlaRepository: vi.fn().mockImplementation(() => ({
    findByIntakeId: vi.fn(),
    findBreached: vi.fn(),
  })),
  PrismaLegalHoldRepository: vi.fn().mockImplementation(() => ({
    place: vi.fn(),
    lift: vi.fn(),
    findActiveByIntakeId: vi.fn(),
    findAllActive: vi.fn(),
  })),
  PrismaDeletionLogRepository: vi.fn().mockImplementation(() => ({
    record: vi.fn(),
    findByIntakeId: vi.fn(),
  })),
  prisma: {
    $disconnect: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@claritystructures/infra-notifications", () => ({
  MailNotifier: vi.fn().mockImplementation(() => ({
    notify: vi.fn(),
  })),
  ConsoleAuditTrail: vi.fn().mockImplementation(() => ({
    log: vi.fn(),
  })),
}));

vi.mock("@/application/event-subscriptions", () => ({
  registerEventSubscriptions: vi.fn(),
}));

describe("DI Container", () => {
  let diContainer: typeof import("@/application/di-container");
  let persistence: typeof import("@claritystructures/infra-persistence");

  beforeEach(async () => {
    vi.clearAllMocks();
    // Dynamic import to pick up fresh mocks
    diContainer = await import("@/application/di-container");
    persistence = await import("@claritystructures/infra-persistence");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createSubmitIntakeUseCase", () => {
    it("should create a SubmitIntakeUseCase instance", () => {
      const useCase = diContainer.createSubmitIntakeUseCase();
      expect(useCase).toBeDefined();
      expect(useCase).toHaveProperty("execute");
    });

    it("should inject PrismaIntakeRepository with prisma client", () => {
      diContainer.createSubmitIntakeUseCase();
      expect(persistence.PrismaIntakeRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
    });
  });

  describe("createListIntakesUseCase", () => {
    it("should create a ListIntakesUseCase instance", () => {
      const useCase = diContainer.createListIntakesUseCase();
      expect(useCase).toBeDefined();
      expect(useCase).toHaveProperty("execute");
    });

    it("should inject PrismaIntakeRepository", () => {
      diContainer.createListIntakesUseCase();
      expect(persistence.PrismaIntakeRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
    });
  });

  describe("createUpdateIntakeStatusUseCase", () => {
    it("should create an UpdateIntakeStatusUseCase instance", () => {
      const useCase = diContainer.createUpdateIntakeStatusUseCase();
      expect(useCase).toBeDefined();
      expect(useCase).toHaveProperty("execute");
    });

    it("should inject PrismaIntakeRepository", () => {
      diContainer.createUpdateIntakeStatusUseCase();
      expect(persistence.PrismaIntakeRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
    });
  });

  describe("createRequestLegalDerivationUseCase", () => {
    it("should create a RequestLegalDerivationUseCase instance", () => {
      const useCase = diContainer.createRequestLegalDerivationUseCase();
      expect(useCase).toBeDefined();
      expect(useCase).toHaveProperty("execute");
    });

    it("should inject PrismaIntakeRepository and PrismaLegalDerivationRepository", () => {
      diContainer.createRequestLegalDerivationUseCase();
      expect(persistence.PrismaIntakeRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
      expect(persistence.PrismaLegalDerivationRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
    });
  });

  describe("createGenerateTransferPacketUseCase", () => {
    it("should create a GenerateTransferPacketUseCase instance", () => {
      const useCase = diContainer.createGenerateTransferPacketUseCase();
      expect(useCase).toBeDefined();
      expect(useCase).toHaveProperty("execute");
    });

    it("should inject all required repositories", () => {
      diContainer.createGenerateTransferPacketUseCase();
      expect(persistence.PrismaIntakeRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
      expect(persistence.PrismaLegalDerivationRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
      expect(persistence.PrismaTransferLogRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
      expect(persistence.PrismaSlaRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
    });
  });

  describe("createPurgeExpiredIntakesUseCase", () => {
    it("should create a PurgeExpiredIntakesUseCase instance", () => {
      const useCase = diContainer.createPurgeExpiredIntakesUseCase();
      expect(useCase).toBeDefined();
      expect(useCase).toHaveProperty("execute");
    });

    it("should inject all required repositories", () => {
      diContainer.createPurgeExpiredIntakesUseCase();
      expect(persistence.PrismaIntakeRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
      expect(persistence.PrismaLegalHoldRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
      expect(persistence.PrismaDeletionLogRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
    });
  });

  describe("createCheckSlaBreachesUseCase", () => {
    it("should create a CheckSlaBreachesUseCase instance", () => {
      const useCase = diContainer.createCheckSlaBreachesUseCase();
      expect(useCase).toBeDefined();
      expect(useCase).toHaveProperty("execute");
    });

    it("should inject PrismaSlaRepository", () => {
      diContainer.createCheckSlaBreachesUseCase();
      expect(persistence.PrismaSlaRepository).toHaveBeenCalledWith(
        persistence.prisma,
      );
    });
  });

  describe("closeDependencies", () => {
    it("should disconnect prisma client", async () => {
      await diContainer.closeDependencies();
      expect(persistence.prisma.$disconnect).toHaveBeenCalled();
    });
  });

  describe("graceful shutdown handlers", () => {
    it("should call closeDependencies on beforeExit", async () => {
      // The module registers process.on("beforeExit", shutdown) on import.
      // Emitting "beforeExit" triggers the shutdown callback (lines 67-69).
      vi.clearAllMocks();
      process.emit("beforeExit", 0);
      // Allow microtask (void closeDependencies()) to settle
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(persistence.prisma.$disconnect).toHaveBeenCalled();
    });
  });
});
