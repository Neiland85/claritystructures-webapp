import type { IntakeRecord, IntakeRepository } from "@claritystructures/domain";

/**
 * List Intakes Use Case
 *
 * Retrieves all intake records for the triage dashboard.
 */
export class ListIntakesUseCase {
  constructor(private readonly repository: IntakeRepository) {}

  async execute(): Promise<IntakeRecord[]> {
    return this.repository.findAll();
  }
}
