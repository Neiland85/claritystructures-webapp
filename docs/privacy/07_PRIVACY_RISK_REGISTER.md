# 07 — Privacy Risk Register

## Estado

Registro preliminar de riesgos de privacidad.

## Escala

- Bajo: impacto limitado y controlado.
- Medio: impacto relevante pero mitigable.
- Alto: impacto significativo o posible afectación de derechos.
- Crítico: impacto grave, legal o reputacional si no se controla.

## Riesgos

| ID    | Riesgo                                             |      Nivel | Control actual                       | Acción pendiente                 |
| ----- | -------------------------------------------------- | ---------: | ------------------------------------ | -------------------------------- |
| PR-01 | Recepción de datos sensibles no solicitados        |       Alto | Intake gobernado, guardian decision  | UX de advertencia y revisión DPO |
| PR-02 | Confusión entre intake y evidencia                 |       Alto | Separación conceptual en governance  | UI explícita de estados          |
| PR-03 | Derivación sin consentimiento activo               |       Alto | activeKey, consent revocation checks | Prueba end-to-end                |
| PR-04 | Transferencia sin trazabilidad suficiente          |       Alto | transfer log, manifestHash           | Export bundle avanzado           |
| PR-05 | Retención excesiva                                 |       Alto | Política preliminar                  | Plazos finales                   |
| PR-06 | Borrado incompatible con legal hold                | Medio/Alto | Concepto documentado                 | Workflow técnico                 |
| PR-07 | Datos de terceros tratados sin información directa |       Alto | Revisión humana                      | Procedimiento específico         |
| PR-08 | Exposición de secretos                             |       Alto | Secret hygiene closure               | Rotación real si aplica          |
| PR-09 | Migración accidental contra DB remota              |       Alto | DB guard                             | Mantener test/guard              |
| PR-10 | Duplicidad por reintentos                          |      Medio | IdempotencyRecord                    | Observabilidad                   |
| PR-11 | Logs con información excesiva                      | Medio/Alto | Pendiente hardening                  | Redacción/minimización           |
| PR-12 | Acceso interno excesivo                            |       Alto | Pendiente RBAC                       | Modelo roles/acceso              |
| PR-13 | Exportación con material fuera de alcance          |       Alto | Scope concept                        | Scope matrix técnica             |
| PR-14 | Revocación no propagada                            |       Alto | Consent model                        | Pruebas de bloqueo               |
| PR-15 | Falta de inventario de encargados                  | Medio/Alto | Documentado pendiente                | Processor inventory              |
| PR-16 | Transferencia internacional no evaluada            |       Alto | Documentado pendiente                | Mapa proveedores                 |
| PR-17 | Automatización percibida como decisión legal       | Medio/Alto | Guardian decision boundary           | Copy/UX legal-safe               |
| PR-18 | Falta de evidencia de cumplimiento                 |      Medio | Readiness script                     | External review package          |

## Criterio de cierre

Este registro se considera baseline cuando:

- todos los riesgos altos tienen propietario;
- los riesgos críticos son cero o están bloqueados;
- existe plan para RBAC;
- existe tabla final de retención;
- existe inventario de encargados;
- se valida con DPO/legal.
