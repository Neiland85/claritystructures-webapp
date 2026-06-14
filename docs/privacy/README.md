# Privacy Baseline — RGPD / DPIA / ROPA

## Estado

Baseline preliminar para `claritystructures-webapp`.

Este paquete no es un dictamen legal cerrado. Es una base técnica-documental para revisión por DPO, asesoría legal o responsable de privacidad.

## Propósito

Documentar la frontera de privacidad del sistema como artefacto institucional gobernado.

El sistema trata contextos potencialmente sensibles mediante:

- intake gobernado;
- clasificación de contexto;
- consentimiento y derivación;
- trazabilidad operativa;
- idempotencia;
- transferencia controlada;
- auditoría;
- límites de privacidad;
- preparación para revisión externa.

## Alcance documental

Este paquete incluye:

1. `01_GDPR_BASELINE.md` — baseline RGPD.
2. `02_DPIA_PRELIMINARY_ASSESSMENT.md` — evaluación preliminar de impacto.
3. `03_ROPA_PROCESSING_ACTIVITIES.md` — registro preliminar de actividades de tratamiento.
4. `04_RETENTION_AND_DELETION_POLICY.md` — retención y borrado.
5. `05_DATA_SUBJECT_RIGHTS_PROCEDURE.md` — procedimiento de derechos.
6. `06_LEGAL_BASIS_MATRIX.md` — matriz preliminar de bases jurídicas.
7. `07_PRIVACY_RISK_REGISTER.md` — registro de riesgos de privacidad.

## Fuentes normativas de referencia

- Reglamento (UE) 2016/679, RGPD.
- Guías y materiales AEPD sobre evaluación de impacto.
- Materiales EDPB sobre DPIA / Data Protection Impact Assessment.

## Relación con `docs/institutional`

Este paquete no sustituye la baseline institucional.

La complementa desde privacidad:

- `docs/institutional/05_SECURITY_AND_PRIVACY_BOUNDARIES.md`
- `docs/institutional/07_AUDITABILITY_MATRIX.md`
- `docs/institutional/08_RISK_REGISTER.md`
- `docs/institutional/10_EXTERNAL_REVIEW_PACKAGE.md`

## Estado de cierre

Implementado/documentado:

- privacidad como frontera institucional;
- separación intake / evidencia / derivación / transferencia;
- trazabilidad documental;
- control de consentimiento;
- readiness script.

Pendiente de validación:

- aprobación DPO/legal;
- periodos definitivos de retención;
- inventario final de encargados;
- revisión de transferencias internacionales;
- revisión final de bases jurídicas;
- revisión de roles y accesos.
