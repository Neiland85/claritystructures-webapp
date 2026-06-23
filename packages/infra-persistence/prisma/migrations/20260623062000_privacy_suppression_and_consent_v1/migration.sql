-- Privacy suppression fields for ARCO/GDPR deletion requests.
-- Suppression is implemented as irreversible anonymization, not physical deletion.

ALTER TABLE "ContactIntake"
ADD COLUMN "suppressedAt" TIMESTAMP(3),
ADD COLUMN "suppressionReason" TEXT,
ADD COLUMN "suppressionTrigger" TEXT;

CREATE INDEX "ContactIntake_suppressedAt_idx"
ON "ContactIntake"("suppressedAt");

-- Ensure a baseline active consent version exists.
-- This version can be superseded later by a legal-reviewed policy bundle.

UPDATE "ConsentVersion"
SET "isActive" = false
WHERE "version" <> 'v1';

INSERT INTO "ConsentVersion" (
  "id",
  "version",
  "content",
  "checksumSha256",
  "isActive"
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'v1',
  'Consentimiento v1 para formulario de contacto de Clarity Structures Digital S.L.: el usuario acepta el tratamiento de los datos enviados para gestionar su solicitud, realizar triage operativo, aplicar medidas de seguridad y contactar en relación con la consulta, conforme a la política de privacidad vigente.',
  '41381149fccaacadb0c99b6b7b61d961ea1cfa0eccb5890fd98c33b9f45dfaf3',
  true
)
ON CONFLICT ("version")
DO UPDATE SET
  "content" = EXCLUDED."content",
  "checksumSha256" = EXCLUDED."checksumSha256",
  "isActive" = true;
