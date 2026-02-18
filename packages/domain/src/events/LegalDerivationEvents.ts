import { DomainEvent } from "./DomainEvent";

/**
 * LegalDerivationRequestedEvent
 * Fired when a user consents to legal case derivation.
 */
export class LegalDerivationRequestedEvent extends DomainEvent {
  constructor(
    public readonly intakeId: string,
    public readonly recipientEntity: string,
    public readonly consentId: string,
  ) {
    super();
  }

  get eventName(): string {
    return "LegalDerivationRequested";
  }

  protected eventData() {
    return {
      intakeId: this.intakeId,
      recipientEntity: this.recipientEntity,
      consentId: this.consentId,
    };
  }
}

/**
 * TransferPacketGeneratedEvent
 * Fired when a transfer packet is assembled and hashed.
 */
export class TransferPacketGeneratedEvent extends DomainEvent {
  constructor(
    public readonly intakeId: string,
    public readonly manifestHash: string,
    public readonly recipientEntity: string,
  ) {
    super();
  }

  get eventName(): string {
    return "TransferPacketGenerated";
  }

  protected eventData() {
    return {
      intakeId: this.intakeId,
      manifestHash: this.manifestHash,
      recipientEntity: this.recipientEntity,
    };
  }
}

/**
 * LegalHoldPlacedEvent
 * Fired when a legal hold is placed on an intake (prevents retention purge).
 */
export class LegalHoldPlacedEvent extends DomainEvent {
  constructor(
    public readonly intakeId: string,
    public readonly reason: string,
    public readonly placedBy: string,
  ) {
    super();
  }

  get eventName(): string {
    return "LegalHoldPlaced";
  }

  protected eventData() {
    return {
      intakeId: this.intakeId,
      reason: this.reason,
      placedBy: this.placedBy,
    };
  }
}

/**
 * IntakePurgedEvent
 * Fired when an intake is purged by the retention policy.
 */
export class IntakePurgedEvent extends DomainEvent {
  constructor(
    public readonly intakeId: string,
    public readonly reason: string,
  ) {
    super();
  }

  get eventName(): string {
    return "IntakePurged";
  }

  protected eventData() {
    return {
      intakeId: this.intakeId,
      reason: this.reason,
    };
  }
}
