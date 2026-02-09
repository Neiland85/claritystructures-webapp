CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "IntakeTone" AS ENUM ('basic', 'family', 'legal', 'critical');
CREATE TYPE "IntakeStatus" AS ENUM ('RECEIVED', 'ALERT_QUEUED', 'DONE');
CREATE TYPE "IntakePriority" AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE "InternalAlertType" AS ENUM ('CRITICAL_EMAIL');
CREATE TYPE "InternalAlertStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TABLE "consent_versions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "version" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "checksum_sha256" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "is_active" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "consent_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "consent_versions_version_key" ON "consent_versions"("version");

CREATE TABLE "contact_intakes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "tone" "IntakeTone" NOT NULL,
  "route" TEXT NOT NULL,
  "priority" "IntakePriority" NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "phone" TEXT,
  "status" "IntakeStatus" NOT NULL,
  "spam_score" DOUBLE PRECISION,
  "meta" JSONB,
  CONSTRAINT "contact_intakes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "consent_acceptances" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "consent_version_id" UUID NOT NULL,
  "intake_id" UUID NOT NULL,
  "accepted_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "ip_hash" TEXT,
  "user_agent" TEXT,
  "locale" TEXT,
  CONSTRAINT "consent_acceptances_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "consent_acceptances_consent_version_id_idx" ON "consent_acceptances"("consent_version_id");
CREATE INDEX "consent_acceptances_intake_id_idx" ON "consent_acceptances"("intake_id");

ALTER TABLE "consent_acceptances"
  ADD CONSTRAINT "consent_acceptances_consent_version_id_fkey"
  FOREIGN KEY ("consent_version_id") REFERENCES "consent_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "consent_acceptances"
  ADD CONSTRAINT "consent_acceptances_intake_id_fkey"
  FOREIGN KEY ("intake_id") REFERENCES "contact_intakes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "internal_alerts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "intake_id" UUID NOT NULL,
  "type" "InternalAlertType" NOT NULL,
  "status" "InternalAlertStatus" NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "sent_at" TIMESTAMPTZ,
  "error" TEXT,
  CONSTRAINT "internal_alerts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "internal_alerts_intake_id_idx" ON "internal_alerts"("intake_id");

ALTER TABLE "internal_alerts"
  ADD CONSTRAINT "internal_alerts_intake_id_fkey"
  FOREIGN KEY ("intake_id") REFERENCES "contact_intakes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "audit_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "entity_type" TEXT NOT NULL,
  "entity_id" UUID NOT NULL,
  "event_type" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "payload" JSONB NOT NULL,
  "hash_sha256" TEXT NOT NULL,
  CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_events_entity_type_entity_id_idx" ON "audit_events"("entity_type", "entity_id");
