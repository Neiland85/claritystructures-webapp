/**
 * Priority - Value Object
 * Type-safe priority levels
 */
export class Priority {
  private static readonly VALID_LEVELS = [
    "low",
    "medium",
    "high",
    "critical",
  ] as const;
  private readonly level: (typeof Priority.VALID_LEVELS)[number];

  private constructor(level: (typeof Priority.VALID_LEVELS)[number]) {
    this.level = level;
  }

  static create(level: string): Priority {
    const normalized = level.toLowerCase();
    if (!Priority.isValid(normalized)) {
      throw new Error(`Invalid priority: ${level}`);
    }
    return new Priority(normalized as (typeof Priority.VALID_LEVELS)[number]);
  }

  static isValid(level: string): boolean {
    return Priority.VALID_LEVELS.includes(level as any);
  }

  static low(): Priority {
    return new Priority("low");
  }

  static medium(): Priority {
    return new Priority("medium");
  }

  static high(): Priority {
    return new Priority("high");
  }

  static critical(): Priority {
    return new Priority("critical");
  }

  isHigherThan(other: Priority): boolean {
    const order = { low: 0, medium: 1, high: 2, critical: 3 };
    return order[this.level] > order[other.level];
  }

  toString(): string {
    return this.level;
  }

  equals(other: Priority): boolean {
    return this.level === other.level;
  }

  toJSON(): string {
    return this.level;
  }
}
