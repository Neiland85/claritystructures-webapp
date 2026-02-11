-- CreateTable
CREATE TABLE "intakes" (
  "id" UUID NOT NULL,
  "wizardResult" JSONB NOT NULL,
  "decision" JSONB NOT NULL,
  "explanation" JSONB NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "contactPhone" TEXT NOT NULL,
  "needsReview" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "intakes_pkey" PRIMARY KEY ("id")
);
