import { describe, it, expect } from "vitest";
import {
  ContactIntakeSchema,
  UrgencySchema,
  ClientProfileSchema,
} from "../validations/contact-intake.schema";

describe("Contact Intake Schema", () => {
  describe("ContactIntakeSchema", () => {
    const validInput = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      message: "This is a test message that is long enough",
      urgency: "informational",
      clientProfile: "private_individual",
      hasEmotionalDistress: false,
      consentToContact: true,
      consentToPrivacy: true,
    };

    it("should validate correct input", () => {
      const result = ContactIntakeSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should trim name and email", () => {
      const input = {
        ...validInput,
        name: "  John Doe  ",
        email: "  JOHN@EXAMPLE.COM  ",
      };

      const result = ContactIntakeSchema.safeParse(input);

      if (result.success) {
        expect(result.data.name).toBe("John Doe");
        expect(result.data.email).toBe("john@example.com");
      }
    });

    it("should reject name that is too short", () => {
      const input = { ...validInput, name: "J" };
      const result = ContactIntakeSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "at least 2 characters",
        );
      }
    });

    it("should reject invalid email", () => {
      const input = { ...validInput, email: "invalid-email" };
      const result = ContactIntakeSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Invalid email");
      }
    });

    it("should reject message that is too short", () => {
      const input = { ...validInput, message: "Short" };
      const result = ContactIntakeSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "at least 10 characters",
        );
      }
    });

    it("should reject message that is too long", () => {
      const input = { ...validInput, message: "a".repeat(5001) };
      const result = ContactIntakeSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it("should reject without consent to contact", () => {
      const input = { ...validInput, consentToContact: false };
      const result = ContactIntakeSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("must consent");
      }
    });

    it("should reject without privacy consent", () => {
      const input = { ...validInput, consentToPrivacy: false };
      const result = ContactIntakeSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it("should detect bot via honeypot", () => {
      const input = { ...validInput, website: "http://spam.com" };
      const result = ContactIntakeSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it("should reject invalid phone format", () => {
      const input = { ...validInput, phone: "abc123" };
      const result = ContactIntakeSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it("should accept valid urgency levels", () => {
      const urgencies = [
        "informational",
        "time_sensitive",
        "legal_risk",
        "critical",
      ];

      urgencies.forEach((urgency) => {
        const input = { ...validInput, urgency };
        const result = ContactIntakeSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("UrgencySchema", () => {
    it("should accept valid urgency values", () => {
      expect(UrgencySchema.safeParse("informational").success).toBe(true);
      expect(UrgencySchema.safeParse("time_sensitive").success).toBe(true);
      expect(UrgencySchema.safeParse("legal_risk").success).toBe(true);
      expect(UrgencySchema.safeParse("critical").success).toBe(true);
    });

    it("should reject invalid urgency values", () => {
      expect(UrgencySchema.safeParse("invalid").success).toBe(false);
    });
  });

  describe("ClientProfileSchema", () => {
    it("should accept valid client profiles", () => {
      const profiles = [
        "private_individual",
        "family_inheritance_conflict",
        "legal_professional",
        "court_related",
        "other",
      ];

      profiles.forEach((profile) => {
        expect(ClientProfileSchema.safeParse(profile).success).toBe(true);
      });
    });

    it("should reject invalid client profiles", () => {
      expect(ClientProfileSchema.safeParse("invalid").success).toBe(false);
    });
  });
});
