/*
  Warnings:

  - A unique constraint covering the columns `[consentVersionId,intakeId]` on the table `ConsentAcceptance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "intakeId" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlaTimer" (
    "id" TEXT NOT NULL,
    "intakeId" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "deadlineAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlaTimer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DerivationConsent" (
    "id" TEXT NOT NULL,
    "intakeId" TEXT NOT NULL,
    "recipientEntity" TEXT NOT NULL,
    "consentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "ipHash" TEXT,
    "userAgent" TEXT,
    "activeKey" TEXT,

    CONSTRAINT "DerivationConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferPacket" (
    "id" TEXT NOT NULL,
    "intakeId" TEXT NOT NULL,
    "recipientEntity" TEXT NOT NULL,
    "manifestHash" TEXT NOT NULL,
    "payloadSizeBytes" INTEGER NOT NULL,
    "legalBasis" TEXT NOT NULL,
    "idempotencyKey" TEXT,
    "contentHash" TEXT,
    "transferredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),

    CONSTRAINT "TransferPacket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalHold" (
    "id" TEXT NOT NULL,
    "intakeId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "placedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liftedAt" TIMESTAMP(3),

    CONSTRAINT "LegalHold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletionLog" (
    "id" TEXT NOT NULL,
    "intakeId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "responseHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "responseBody" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "causationKey" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_intakeId_idx" ON "AuditLog"("intakeId");

-- CreateIndex
CREATE INDEX "AuditLog_occurredAt_idx" ON "AuditLog"("occurredAt" DESC);

-- CreateIndex
CREATE INDEX "SlaTimer_status_idx" ON "SlaTimer"("status");

-- CreateIndex
CREATE INDEX "SlaTimer_deadlineAt_idx" ON "SlaTimer"("deadlineAt");

-- CreateIndex
CREATE INDEX "SlaTimer_intakeId_idx" ON "SlaTimer"("intakeId");

-- CreateIndex
CREATE UNIQUE INDEX "SlaTimer_intakeId_milestone_key" ON "SlaTimer"("intakeId", "milestone");

-- CreateIndex
CREATE UNIQUE INDEX "DerivationConsent_activeKey_key" ON "DerivationConsent"("activeKey");

-- CreateIndex
CREATE INDEX "DerivationConsent_intakeId_idx" ON "DerivationConsent"("intakeId");

-- CreateIndex
CREATE INDEX "DerivationConsent_recipientEntity_idx" ON "DerivationConsent"("recipientEntity");

-- CreateIndex
CREATE UNIQUE INDEX "TransferPacket_idempotencyKey_key" ON "TransferPacket"("idempotencyKey");

-- CreateIndex
CREATE INDEX "TransferPacket_intakeId_idx" ON "TransferPacket"("intakeId");

-- CreateIndex
CREATE INDEX "TransferPacket_manifestHash_idx" ON "TransferPacket"("manifestHash");

-- CreateIndex
CREATE INDEX "TransferPacket_contentHash_idx" ON "TransferPacket"("contentHash");

-- CreateIndex
CREATE INDEX "TransferPacket_transferredAt_idx" ON "TransferPacket"("transferredAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "TransferPacket_intakeId_recipientEntity_manifestHash_key" ON "TransferPacket"("intakeId", "recipientEntity", "manifestHash");

-- CreateIndex
CREATE INDEX "LegalHold_intakeId_idx" ON "LegalHold"("intakeId");

-- CreateIndex
CREATE INDEX "LegalHold_liftedAt_idx" ON "LegalHold"("liftedAt");

-- CreateIndex
CREATE INDEX "DeletionLog_intakeId_idx" ON "DeletionLog"("intakeId");

-- CreateIndex
CREATE INDEX "DeletionLog_deletedAt_idx" ON "DeletionLog"("deletedAt" DESC);

-- CreateIndex
CREATE INDEX "DeletionLog_trigger_idx" ON "DeletionLog"("trigger");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_requestHash_idx" ON "IdempotencyRecord"("requestHash");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_status_idx" ON "IdempotencyRecord"("status");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_expiresAt_idx" ON "IdempotencyRecord"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_scope_key_key" ON "IdempotencyRecord"("scope", "key");

-- CreateIndex
CREATE UNIQUE INDEX "OutboxEvent_causationKey_key" ON "OutboxEvent"("causationKey");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_idx" ON "OutboxEvent"("status");

-- CreateIndex
CREATE INDEX "OutboxEvent_aggregateId_idx" ON "OutboxEvent"("aggregateId");

-- CreateIndex
CREATE INDEX "OutboxEvent_createdAt_idx" ON "OutboxEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentAcceptance_consentVersionId_intakeId_key" ON "ConsentAcceptance"("consentVersionId", "intakeId");

-- AddForeignKey
ALTER TABLE "SlaTimer" ADD CONSTRAINT "SlaTimer_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "ContactIntake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DerivationConsent" ADD CONSTRAINT "DerivationConsent_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "ContactIntake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferPacket" ADD CONSTRAINT "TransferPacket_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "ContactIntake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalHold" ADD CONSTRAINT "LegalHold_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "ContactIntake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeletionLog" ADD CONSTRAINT "DeletionLog_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "ContactIntake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
