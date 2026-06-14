# 06 — Legal Basis Matrix

## Estado

Matriz preliminar.

No usar como conclusión legal definitiva sin validación DPO/legal.

## Criterio

La base jurídica no se deduce solo del tipo de dato.

Depende de:

- finalidad;
- relación con el usuario;
- expectativa razonable;
- sensibilidad;
- necesidad;
- destinatario;
- transferencia;
- obligación aplicable;
- estado del expediente.

## Matriz

| Tratamiento                              | Base candidata                                               |     Riesgo | Validación requerida |
| ---------------------------------------- | ------------------------------------------------------------ | ---------: | -------------------- |
| Intake inicial                           | Medidas precontractuales / consentimiento / interés legítimo |      Medio | Sí                   |
| Clasificación de contexto                | Interés legítimo / responsabilidad proactiva                 |      Medio | Sí                   |
| Tratamiento de datos sensibles aportados | Consentimiento explícito / excepción aplicable               |       Alto | DPO/legal            |
| Derivación legal                         | Consentimiento / ejecución de encargo / obligación           |       Alto | DPO/legal            |
| Transfer packet a tercero                | Consentimiento / contrato / obligación / interés legítimo    |       Alto | DPO/legal            |
| Auditoría técnica                        | Interés legítimo / seguridad / responsabilidad proactiva     |      Medio | Sí                   |
| Logs de seguridad                        | Interés legítimo / seguridad                                 |      Medio | Sí                   |
| Ejercicio de derechos                    | Obligación legal                                             |      Medio | Sí                   |
| Legal hold                               | Obligación legal / defensa de reclamaciones                  |       Alto | DPO/legal            |
| Comunicaciones operativas                | Contrato / interés legítimo / consentimiento                 | Bajo/Medio | Sí                   |

## Reglas defensivas

- Si hay categorías especiales, elevar a revisión.
- Si hay datos de terceros, elevar a revisión.
- Si hay transferencia, exigir base y destinatario.
- Si hay revocación, bloquear nuevos efectos.
- Si no hay finalidad clara, bloquear tratamiento.
- Si hay conflicto entre borrado y legal hold, bloquear borrado automático.

## No overclaim

No afirmar:

- “cumplimiento RGPD completo”;
- “tratamiento legalmente validado”;
- “evidencia válida”;
- “derivación autorizada”;
- “DPIA cerrada”.

Sí afirmar:

- “baseline documental preparada”;
- “frontera de privacidad definida”;
- “riesgos identificados”;
- “pendiente validación DPO/legal”;
- “arquitectura preparada para revisión”.
