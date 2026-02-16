import { DomainEvent } from "./DomainEvent";
import type { IntakePriority } from "../intake-records";

/**
 * IntakeReceivedEvent
 * Fired when a new intake is received
 */
export class IntakeReceivedEvent extends DomainEvent {
  constructor(
    public readonly intakeId: string,
    public readonly email: string,
    public readonly urgency: string,
  ) {
    super();
  }

  get eventName(): string {
    return "IntakeReceived";
  }

  protected eventData() {
    return {
      intakeId: this.intakeId,
      email: this.email,
      urgency: this.urgency,
    };
  }
}

/**
 * IntakePriorityAssessedEvent
 * Fired when intake priority is assessed
 */
export class IntakePriorityAssessedEvent extends DomainEvent {
  constructor(
    public readonly intakeId: string,
    public readonly priority: IntakePriority,
    public readonly assessedBy: string,
  ) {
    super();
  }

  get eventName(): string {
    return "IntakePriorityAssessed";
  }

  protected eventData() {
    return {
      intakeId: this.intakeId,
      priority: this.priority,
      assessedBy: this.assessedBy,
    };
  }
}

/**
 * IntakeAssignedEvent
 * Fired when intake is assigned to someone
 */
export class IntakeAssignedEvent extends DomainEvent {
  constructor(
    public readonly intakeId: string,
    public readonly assignedTo: string,
  ) {
    super();
  }

  get eventName(): string {
    return "IntakeAssigned";
  }

  protected eventData() {
    return {
      intakeId: this.intakeId,
      assignedTo: this.assignedTo,
    };
  }
}

/**
 * IntakeClosedEvent
 * Fired when intake is closed
 */
export class IntakeClosedEvent extends DomainEvent {
  constructor(
    public readonly intakeId: string,
    public readonly reason: string,
  ) {
    super();
  }

  get eventName(): string {
    return "IntakeClosed";
  }

  protected eventData() {
    return {
      intakeId: this.intakeId,
      reason: this.reason,
    };
  }
}
