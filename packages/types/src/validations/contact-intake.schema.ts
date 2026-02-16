import { z } from "zod";

export const UrgencySchema = z.enum([
  "informational",
  "time_sensitive",
  "legal_risk",
  "critical",
]);

export const ClientProfileSchema = z.enum([
  "private_individual",
  "family_inheritance_conflict",
  "legal_professional",
  "court_related",
  "other",
]);

export const ContactIntakeSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name contains invalid characters")
      .transform((val) => val.trim()),

    email: z
      .string()
      .email("Invalid email format")
      .toLowerCase()
      .transform((val) => val.trim()),

    phone: z
      .string()
      .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format")
      .min(10, "Phone number too short")
      .max(20, "Phone number too long")
      .optional()
      .transform((val) => val?.replace(/\s/g, "")),

    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(5000, "Message is too long")
      .transform((val) => val.trim()),

    urgency: UrgencySchema,
    clientProfile: ClientProfileSchema,
    hasEmotionalDistress: z.boolean().optional().default(false),

    consentToContact: z
      .boolean()
      .refine((val) => val === true, "You must consent to be contacted"),

    consentToPrivacy: z
      .boolean()
      .refine((val) => val === true, "You must accept the privacy policy"),

    website: z.string().max(0).optional(),
    referralSource: z.string().max(200).optional(),
  })
  .strict();

export type ContactIntakeInput = z.infer<typeof ContactIntakeSchema>;

export const IntakeStatusSchema = z.enum([
  "pending",
  "in_progress",
  "resolved",
  "closed",
  "spam",
]);

export type IntakeStatus = z.infer<typeof IntakeStatusSchema>;

export const PrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export type Priority = z.infer<typeof PrioritySchema>;
