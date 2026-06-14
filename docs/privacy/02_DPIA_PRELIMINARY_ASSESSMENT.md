# 02 — DPIA / EIPD Preliminary Assessment

## Estado

Evaluación preliminar de impacto en protección de datos.

No sustituye una EIPD formal firmada por DPO/legal.

## Descripción del tratamiento

`claritystructures-webapp` permite recibir, clasificar y gobernar información aportada por usuarios en contextos potencialmente sensibles.

El sistema puede intervenir en:

- intake;
- triage;
- análisis de señales;
- generación de decisiones de gobernanza;
- registro de consentimiento;
- derivación legal;
- generación de paquetes transferibles;
- auditoría;
- ejercicio de derechos.

## Naturaleza del tratamiento

Tratamiento digital de información aportada por el usuario y metadata generada por el sistema.

Puede incluir:

- información personal;
- datos de terceros;
- material sensible;
- documentos;
- capturas;
- comunicaciones;
- indicadores de riesgo;
- decisiones de sistema;
- registros de auditoría.

## Alcance

Baseline actual:

- sistema en fase de producto técnico;
- arquitectura de gobernanza e idempotencia integrada;
- privacy pack documental en construcción;
- revisión externa pendiente.

No se debe asumir despliegue masivo ni uso institucional completo sin revisión adicional.

## Finalidades preliminares

- Recibir solicitudes.
- Clasificar contexto.
- Evaluar riesgo operativo.
- Gestionar consentimiento.
- Preparar derivaciones controladas.
- Crear transfer packets auditables.
- Responder derechos de usuario.
- Mantener trazabilidad defensiva.

## Necesidad y proporcionalidad

Necesario:

- intake mínimo para entender solicitud;
- trazabilidad para evitar duplicidades;
- audit trail para responsabilidad proactiva;
- consentimiento para derivaciones;
- hash/manifest para transferencia verificable;
- separación de estados para evitar sobretratamiento.

Debe limitarse:

- recolección excesiva;
- acceso interno innecesario;
- reutilización de datos fuera de finalidad;
- exportación sin base;
- conservación indefinida;
- inferencias no verificadas.

## Riesgos preliminares

| ID      | Riesgo                                    | Nivel preliminar | Control actual                                             | Pendiente                |
| ------- | ----------------------------------------- | ---------------: | ---------------------------------------------------------- | ------------------------ |
| DPIA-01 | Recepción de datos sensibles no esperados |             Alto | Guardian decision, revisión requerida, acciones bloqueadas | Validación DPO           |
| DPIA-02 | Derivación sin consentimiento válido      |             Alto | Consent model, activeKey, bloqueo si revocado              | UI final de trazabilidad |
| DPIA-03 | Transferencia no auditada                 |             Alto | Transfer packet, manifestHash, idempotencyKey              | Export bundle avanzado   |
| DPIA-04 | Retención excesiva                        |       Medio/Alto | Política preliminar                                        | Plazos finales           |
| DPIA-05 | Duplicidad de efectos por reintentos      |            Medio | IdempotencyRecord, requestHash, responseHash               | Monitorización           |
| DPIA-06 | Acceso interno excesivo                   |             Alto | Pendiente RBAC formal                                      | Modelo roles/accesos     |
| DPIA-07 | Secreto expuesto en repo/log              |             Alto | Secret hygiene closure                                     | Rotación real si aplica  |
| DPIA-08 | Datos de terceros sin información directa |             Alto | Revisión humana, limitación de finalidad                   | Procedimiento específico |
| DPIA-09 | Confusión entre intake y evidencia        |             Alto | Governance boundary                                        | UX explícita             |
| DPIA-10 | Borrado incompatible con legal hold       |       Medio/Alto | Legal hold concept                                         | Workflow final           |

## Medidas previstas

- Data minimization en formularios.
- Separación intake/evidence/transfer.
- Consentimiento versionado.
- Idempotencia defensiva.
- Auditoría de decisiones.
- Registro de transferencias.
- Hash de paquetes.
- Retention policy.
- Procedimiento de derechos.
- Risk register.
- Revisión externa.

## Decisión preliminar

Por la naturaleza del producto, la EIPD formal debe considerarse recomendable antes de:

- uso con clientes reales a escala;
- procesamiento sistemático de categorías especiales;
- integración con terceros;
- automatización de decisiones relevantes;
- transferencia masiva de documentación;
- despliegue multiusuario con roles.

## Pendientes

- DPO/legal sign-off.
- Responsable/encargado por caso de uso.
- Mapa de proveedores.
- Riesgos residuales aceptados.
- Medidas técnicas implantadas vs documentadas.
- Prueba de ejercicio de derechos.
- Prueba de borrado/retención/legal hold.
