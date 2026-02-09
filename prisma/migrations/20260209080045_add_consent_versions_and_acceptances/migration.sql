-- CreateEnum
CREATE TYPE "IntakeTone" AS ENUM ('basic', 'family', 'legal', 'critical');

-- CreateEnum
CREATE TYPE "IntakePriority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('RECEIVED', 'ALERT_QUEUED', 'DONE');

-- CreateTable
CREATE TABLE "ContactIntake" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tone" "IntakeTone" NOT NULL,
    "route" TEXT NOT NULL,
    "priority" "IntakePriority" NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "phone" TEXT,
    "status" "IntakeStatus" NOT NULL,
    "spamScore" DOUBLE PRECISION,
    "meta" JSONB,

    CONSTRAINT "ContactIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentVersion" (
    "id" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConsentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentAcceptance" (
    "id" UUID NOT NULL,
    "consentVersionId" UUID NOT NULL,
    "intakeId" UUID NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "locale" TEXT,

    CONSTRAINT "ConsentAcceptance_pkey" PRIMARY KEY ("id")
);

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
