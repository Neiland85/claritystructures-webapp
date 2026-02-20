import { z } from "zod";

export const ClientProfileSchema = z.enum([
  "private_individual",
  "family_inheritance_conflict",
  "legal_professional",
  "court_related",
  "other",
]);

export const UrgencySchema = z.enum([
  "informational",
  "time_sensitive",
  "legal_risk",
  "critical",
]);

export const WizardResultSchema = z.object({
  clientProfile: ClientProfileSchema,
  urgency: UrgencySchema,
  hasEmotionalDistress: z.boolean().optional(),
  incident: z.string(),
  devices: z.number(),
  actionsTaken: z.array(z.string()),
  evidenceSources: z.array(z.string()),
  objective: z.string(),
  physicalSafetyRisk: z.boolean().optional(),
  financialAssetRisk: z.boolean().optional(),
  attackerHasPasswords: z.boolean().optional(),
  evidenceIsAutoDeleted: z.boolean().optional(),
  cognitiveProfile: z
    .object({
      coherenceScore: z.number(),
      cognitiveDistortion: z.boolean(),
      perceivedOmnipotenceOfAttacker: z.boolean(),
      isInformationVerifiable: z.boolean(),
      emotionalShockLevel: z.enum(["low", "medium", "high"]),
    })
    .optional(),
  narrativeTracing: z
    .object({
      whatsappControlLoss: z.boolean(),
      familySuspects: z.boolean(),
      perceivedSurveillance: z.boolean(),
    })
    .optional(),
  isOngoing: z.boolean().optional(),
  hasAccessToDevices: z.boolean().optional(),
  dataSensitivityLevel: z.enum(["low", "medium", "high"]).optional(),
  estimatedIncidentStart: z
    .enum(["unknown", "recent", "weeks", "months"])
    .optional(),
  thirdPartiesInvolved: z.boolean().optional(),
});

export const IntakeToneSchema = z.enum([
  "basic",
  "family",
  "legal",
  "critical",
]);

export const ContactIntakeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .optional(),

  email: z.string().trim().toLowerCase().email("Invalid email format"),

  phone: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.replace(/<[^>]*>/g, "").replace(/\s/g, "") : undefined,
    )
    .refine(
      (val) => !val || /^[\d\-\+\(\)]*$/.test(val),
      "Invalid phone number format",
    ),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long")
    .transform((val) => val.trim()),

  tone: IntakeToneSchema.optional().default("basic"),

  wizardResult: WizardResultSchema.optional(),

  consent: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms"),

  consentVersion: z.string().optional().default("v1"),

  website: z.string().max(0, "Bot detected").optional(),
});

export type ContactIntakeInput = z.infer<typeof ContactIntakeSchema>;
export type WizardResultInput = z.infer<typeof WizardResultSchema>;

export const IntakeStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "in_progress",
  "resolved",
  "closed",
  "spam",
]);

export type IntakeStatus = z.infer<typeof IntakeStatusSchema>;

export const PrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export type Priority = z.infer<typeof PrioritySchema>;
