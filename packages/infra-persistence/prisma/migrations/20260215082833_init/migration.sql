-- CreateEnum
CREATE TYPE "IntakeTone" AS ENUM ('basic', 'family', 'legal', 'critical');

-- CreateEnum
CREATE TYPE "IntakePriority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "ContactIntake" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tone" "IntakeTone" NOT NULL,
    "route" TEXT NOT NULL,
    "priority" "IntakePriority" NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "phone" TEXT,
    "status" "IntakeStatus" NOT NULL DEFAULT 'pending',
    "spamScore" DOUBLE PRECISION,
    "meta" JSONB,

    CONSTRAINT "ContactIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConsentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentAcceptance" (
    "id" TEXT NOT NULL,
    "consentVersionId" TEXT NOT NULL,
    "intakeId" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "locale" TEXT,

    CONSTRAINT "ConsentAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactIntake_status_idx" ON "ContactIntake"("status");

-- CreateIndex
CREATE INDEX "ContactIntake_priority_idx" ON "ContactIntake"("priority");

-- CreateIndex
CREATE INDEX "ContactIntake_createdAt_idx" ON "ContactIntake"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "ContactIntake_status_priority_idx" ON "ContactIntake"("status", "priority");

-- CreateIndex
CREATE INDEX "ContactIntake_email_idx" ON "ContactIntake"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentVersion_version_key" ON "ConsentVersion"("version");

-- CreateIndex
CREATE INDEX "ConsentAcceptance_consentVersionId_idx" ON "ConsentAcceptance"("consentVersionId");

-- CreateIndex
CREATE INDEX "ConsentAcceptance_intakeId_idx" ON "ConsentAcceptance"("intakeId");

-- AddForeignKey
ALTER TABLE "ConsentAcceptance" ADD CONSTRAINT "ConsentAcceptance_consentVersionId_fkey" FOREIGN KEY ("consentVersionId") REFERENCES "ConsentVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentAcceptance" ADD CONSTRAINT "ConsentAcceptance_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "ContactIntake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
