import { describe, it, expect } from "vitest";
import {
  LegalDerivationRequestedEvent,
  TransferPacketGeneratedEvent,
  LegalHoldPlacedEvent,
  IntakePurgedEvent,
} from "../LegalDerivationEvents";

describe("Legal Derivation Events", () => {
  it("LegalDerivationRequestedEvent should carry consent data", () => {
    const event = new LegalDerivationRequestedEvent(
      "intake-001",
      "Ospina Abogados",
      "consent-abc",
    );

    expect(event.eventName).toBe("LegalDerivationRequested");
    expect(event.intakeId).toBe("intake-001");
    expect(event.recipientEntity).toBe("Ospina Abogados");
    expect(event.consentId).toBe("consent-abc");
    expect(event.occurredAt).toBeInstanceOf(Date);
    expect(event.eventId).toBeDefined();
  });

  it("TransferPacketGeneratedEvent should carry manifest hash", () => {
    const event = new TransferPacketGeneratedEvent(
      "intake-002",
      "a1b2c3d4e5f6",
      "Ospina Abogados",
    );

    expect(event.eventName).toBe("TransferPacketGenerated");
    expect(event.manifestHash).toBe("a1b2c3d4e5f6");
    expect(event.recipientEntity).toBe("Ospina Abogados");
  });

  it("LegalHoldPlacedEvent should carry reason and placer", () => {
    const event = new LegalHoldPlacedEvent(
      "intake-003",
      "Court order received",
      "admin@claritystructures.com",
    );

    expect(event.eventName).toBe("LegalHoldPlaced");
    expect(event.reason).toBe("Court order received");
    expect(event.placedBy).toBe("admin@claritystructures.com");
  });

  it("IntakePurgedEvent should carry purge reason", () => {
    const event = new IntakePurgedEvent("intake-004", "retention_policy_24m");

    expect(event.eventName).toBe("IntakePurged");
    expect(event.intakeId).toBe("intake-004");
    expect(event.reason).toBe("retention_policy_24m");
  });

  it("all events should serialize to JSON with eventId and occurredAt", () => {
    const events = [
      new LegalDerivationRequestedEvent("i1", "entity", "c1"),
      new TransferPacketGeneratedEvent("i2", "hash", "entity"),
      new LegalHoldPlacedEvent("i3", "reason", "user"),
      new IntakePurgedEvent("i4", "reason"),
    ];

    for (const event of events) {
      const json = event.toJSON();
      expect(json.eventId).toBeDefined();
      expect(json.eventName).toBeDefined();
      expect(json.occurredAt).toBeDefined();
    }
  });
});
