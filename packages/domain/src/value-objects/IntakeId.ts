/**
 * IntakeId - Value Object
 * Represents a unique identifier for an intake
 */
export class IntakeId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value?: string): IntakeId {
    if (value) {
      if (!IntakeId.isValid(value)) {
        throw new Error(`Invalid IntakeId: ${value}`);
      }
      return new IntakeId(value);
    }
    return IntakeId.generate();
  }

  static generate(): IntakeId {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return new IntakeId(`intake_${timestamp}_${random}`);
  }

  static isValid(value: string): boolean {
    return /^intake_[a-z0-9_]+$/i.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: IntakeId): boolean {
    return this.value === other.value;
  }

  toJSON(): string {
    return this.value;
  }
}
