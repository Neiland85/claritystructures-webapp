/**
 * Event Subscriptions
 *
 * Wires domain event handlers to the event dispatcher.
 * Called once at application bootstrap (DI container init).
 */

import {
  eventDispatcher,
  IntakeReceivedEvent,
  IntakePriorityAssessedEvent,
  IntakeAssignedEvent,
  IntakeClosedEvent,
  LegalDerivationRequestedEvent,
  TransferPacketGeneratedEvent,
  LegalHoldPlacedEvent,
  IntakePurgedEvent,
} from "@claritystructures/domain";
import type { AuditTrail } from "@claritystructures/domain";

let subscribed = false;

/**
 * Register all domain event → audit trail handlers.
 * Idempotent: safe to call multiple times; only subscribes once.
 */
export function registerEventSubscriptions(audit: AuditTrail): void {
  if (subscribed) return;
  subscribed = true;

  eventDispatcher.subscribe<IntakeReceivedEvent>(
    "IntakeReceived",
    async (event) => {
      await audit.record({
        action: "domain_event:IntakeReceived",
        intakeId: event.intakeId,
        metadata: { email: event.email, urgency: event.urgency },
        occurredAt: event.occurredAt,
      });
    },
  );

  eventDispatcher.subscribe<IntakePriorityAssessedEvent>(
    "IntakePriorityAssessed",
    async (event) => {
      await audit.record({
        action: "domain_event:IntakePriorityAssessed",
        intakeId: event.intakeId,
        metadata: { priority: event.priority, assessedBy: event.assessedBy },
        occurredAt: event.occurredAt,
      });
    },
  );

  eventDispatcher.subscribe<IntakeAssignedEvent>(
    "IntakeAssigned",
    async (event) => {
      await audit.record({
        action: "domain_event:IntakeAssigned",
        intakeId: event.intakeId,
        metadata: { assignedTo: event.assignedTo },
        occurredAt: event.occurredAt,
      });
    },
  );

  eventDispatcher.subscribe<IntakeClosedEvent>(
    "IntakeClosed",
    async (event) => {
      await audit.record({
        action: "domain_event:IntakeClosed",
        intakeId: event.intakeId,
        metadata: { reason: event.reason },
        occurredAt: event.occurredAt,
      });
    },
  );

  eventDispatcher.subscribe<LegalDerivationRequestedEvent>(
    "LegalDerivationRequested",
    async (event) => {
      await audit.record({
        action: "domain_event:LegalDerivationRequested",
        intakeId: event.intakeId,
        metadata: {
          recipientEntity: event.recipientEntity,
          consentId: event.consentId,
        },
        occurredAt: event.occurredAt,
      });
    },
  );

  eventDispatcher.subscribe<TransferPacketGeneratedEvent>(
    "TransferPacketGenerated",
    async (event) => {
      await audit.record({
        action: "domain_event:TransferPacketGenerated",
        intakeId: event.intakeId,
        metadata: {
          manifestHash: event.manifestHash,
          recipientEntity: event.recipientEntity,
        },
        occurredAt: event.occurredAt,
      });
    },
  );

  eventDispatcher.subscribe<LegalHoldPlacedEvent>(
    "LegalHoldPlaced",
    async (event) => {
      await audit.record({
        action: "domain_event:LegalHoldPlaced",
        intakeId: event.intakeId,
        metadata: { reason: event.reason, placedBy: event.placedBy },
        occurredAt: event.occurredAt,
      });
    },
  );

  eventDispatcher.subscribe<IntakePurgedEvent>(
    "IntakePurged",
    async (event) => {
      await audit.record({
        action: "domain_event:IntakePurged",
        intakeId: event.intakeId,
        metadata: { reason: event.reason },
        occurredAt: event.occurredAt,
      });
    },
  );
}

/**
 * Reset subscription state (for testing only).
 */
export function resetEventSubscriptions(): void {
  subscribed = false;
}
