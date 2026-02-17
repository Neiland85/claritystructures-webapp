import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock all external dependencies BEFORE importing the module
vi.mock("@claritystructures/infra-persistence", () => ({
  PrismaIntakeRepository: vi.fn().mockImplementation(() => ({
    save: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
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

  describe("closeDependencies", () => {
    it("should disconnect prisma client", async () => {
      await diContainer.closeDependencies();
      expect(persistence.prisma.$disconnect).toHaveBeenCalled();
    });
  });
});
