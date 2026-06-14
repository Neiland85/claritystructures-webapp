# 03 — ROPA / RAT Processing Activities

## Estado

Registro preliminar de actividades de tratamiento.

Debe ser validado por DPO/legal antes de considerarse RAT formal.

## Actividad 1 — Intake de casos sensibles

| Campo                   | Descripción                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Finalidad               | Recibir información inicial del usuario para clasificar contexto y determinar próximos pasos. |
| Interesados             | Usuarios/contactos que remiten solicitud; terceros mencionados en el relato.                  |
| Datos                   | Identificación, contacto, relato, archivos opcionales, metadata técnica.                      |
| Base jurídica candidata | Consentimiento / medidas precontractuales / interés legítimo, según caso.                     |
| Categorías especiales   | Posibles si el usuario las aporta. No deben solicitarse por defecto.                          |
| Destinatarios           | Equipo autorizado de Clarity Structures; terceros solo si procede y queda registrado.         |
| Retención               | Pendiente de tabla final. Retención mínima operativa.                                         |
| Controles               | Minimización, governance envelope, guardian decision, audit trail.                            |

## Actividad 2 — Clasificación y gobernanza

| Campo                   | Descripción                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| Finalidad               | Clasificar riesgo, sensibilidad, acciones permitidas/bloqueadas y necesidad de revisión.     |
| Interesados             | Usuarios y terceros mencionados.                                                             |
| Datos                   | Señales del intake, metadata, risk level, policy version, decision summary.                  |
| Base jurídica candidata | Interés legítimo / cumplimiento de responsabilidad proactiva / consentimiento según alcance. |
| Categorías especiales   | No inferir salvo que el contenido aportado lo haga necesario para bloquear o revisar.        |
| Destinatarios           | Equipo autorizado.                                                                           |
| Retención               | Vinculada al expediente/intake.                                                              |
| Controles               | Guardian decision, blocked actions, audit trail, idempotency.                                |

## Actividad 3 — Consentimiento y derivación legal

| Campo                   | Descripción                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Finalidad               | Registrar consentimiento o condición habilitante para derivación a tercero legal/técnico. |
| Interesados             | Usuario solicitante; tercero receptor si aplica.                                          |
| Datos                   | Consent state, activeKey, timestamps, recipient, scope, legal basis candidate.            |
| Base jurídica candidata | Consentimiento explícito o base alternativa validada por DPO/legal.                       |
| Categorías especiales   | Posibles si el expediente las contiene. Requiere revisión.                                |
| Destinatarios           | Profesional o entidad receptora validada.                                                 |
| Retención               | Mientras exista necesidad de trazabilidad, defensa o cumplimiento.                        |
| Controles               | Active consent uniqueness, revocation handling, audit trail.                              |

## Actividad 4 — Transfer Packet

| Campo                   | Descripción                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Finalidad               | Crear paquete transferible auditable con manifest, hash y límites de alcance.            |
| Interesados             | Usuario, terceros incluidos en documentación.                                            |
| Datos                   | Manifest, metadata, hashes, scope, recipient, transfer log.                              |
| Base jurídica candidata | Consentimiento / ejecución contractual / obligación legal / interés legítimo según caso. |
| Categorías especiales   | Posibles si el paquete contiene material sensible.                                       |
| Destinatarios           | Receptor autorizado.                                                                     |
| Retención               | Registro de transferencia según política final.                                          |
| Controles               | manifestHash, contentHash, idempotencyKey, transfer log.                                 |

## Actividad 5 — Ejercicio de derechos

| Campo                   | Descripción                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Finalidad               | Gestionar solicitudes de acceso, rectificación, supresión, oposición, limitación y portabilidad. |
| Interesados             | Usuario o representante autorizado.                                                              |
| Datos                   | Identificación, solicitud, evidencias de identidad, resolución, acciones ejecutadas.             |
| Base jurídica candidata | Cumplimiento de obligación legal.                                                                |
| Categorías especiales   | Solo si son necesarias para tramitar la solicitud.                                               |
| Destinatarios           | Equipo autorizado; DPO/legal si aplica.                                                          |
| Retención               | Registro mínimo para demostrar gestión.                                                          |
| Controles               | Ticketing, verification, audit trail, legal hold check.                                          |

## Actividad 6 — Auditoría y seguridad

| Campo                   | Descripción                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Finalidad               | Mantener trazabilidad, seguridad, prevención de abuso y reconstrucción de eventos. |
| Interesados             | Usuarios, operadores, terceros afectados indirectamente.                           |
| Datos                   | Logs técnicos, eventos, timestamps, hash, decision metadata.                       |
| Base jurídica candidata | Interés legítimo / obligación de seguridad / responsabilidad proactiva.            |
| Categorías especiales   | No previstas directamente, pero pueden aparecer en referencias.                    |
| Destinatarios           | Equipo técnico autorizado; proveedores de infraestructura si aplica.               |
| Retención               | Mínima necesaria para seguridad y auditoría.                                       |
| Controles               | Minimización de logs, no secrets, migration guard, audit trail.                    |

## Pendientes RAT

- Confirmar responsable del tratamiento por línea de servicio.
- Confirmar encargados/proveedores.
- Confirmar transferencias internacionales.
- Confirmar plazos.
- Confirmar bases jurídicas definitivas.
- Confirmar procedimiento de información al interesado.
