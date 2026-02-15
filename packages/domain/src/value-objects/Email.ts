/**
 * Email - Value Object
 * Represents a validated email address
 */
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    const normalized = value.toLowerCase().trim();
    if (!Email.isValid(normalized)) {
      throw new Error(`Invalid email: ${value}`);
    }
    return new Email(normalized);
  }

  static isValid(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) && value.length <= 254;
  }

  toString(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toJSON(): string {
    return this.value;
  }
}
