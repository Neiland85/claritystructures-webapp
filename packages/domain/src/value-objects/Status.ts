/**
 * Status - Value Object
 * Type-safe status values
 */
export class Status {
  private static readonly VALID_STATUSES = [
    "pending",
    "in_progress",
    "resolved",
    "closed",
    "spam",
  ] as const;

  private readonly value: (typeof Status.VALID_STATUSES)[number];

  private constructor(value: (typeof Status.VALID_STATUSES)[number]) {
    this.value = value;
  }

  static create(value: string): Status {
    const normalized = value.toLowerCase();
    if (!Status.isValid(normalized)) {
      throw new Error(`Invalid status: ${value}`);
    }
    return new Status(normalized as (typeof Status.VALID_STATUSES)[number]);
  }

  static isValid(value: string): boolean {
    return (Status.VALID_STATUSES as ReadonlyArray<string>).includes(value);
  }

  static pending(): Status {
    return new Status("pending");
  }

  static inProgress(): Status {
    return new Status("in_progress");
  }

  static resolved(): Status {
    return new Status("resolved");
  }

  static closed(): Status {
    return new Status("closed");
  }

  static spam(): Status {
    return new Status("spam");
  }

  isPending(): boolean {
    return this.value === "pending";
  }

  isClosed(): boolean {
    return this.value === "closed" || this.value === "spam";
  }

  toString(): string {
    return this.value;
  }

  equals(other: Status): boolean {
    return this.value === other.value;
  }

  toJSON(): string {
    return this.value;
  }
}
