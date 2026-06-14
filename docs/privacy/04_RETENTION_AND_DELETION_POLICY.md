# 04 — Retention and Deletion Policy

## Estado

Política preliminar.

Los plazos concretos deben validarse por DPO/legal.

## Principios

- No conservar por defecto más de lo necesario.
- No borrar material sometido a legal hold sin revisión.
- No confundir borrado operativo con borrado de backups.
- Registrar toda decisión de retención, supresión o bloqueo.
- Separar datos de usuario, metadata técnica, auditoría y transfer logs.

## Estados de retención

| Estado               | Significado                                           |
| -------------------- | ----------------------------------------------------- |
| `active`             | Expediente/intake operativo.                          |
| `pending_review`     | Pendiente de revisión humana.                         |
| `consent_required`   | No debe avanzar a derivación o transferencia.         |
| `legal_hold`         | Borrado bloqueado por obligación, defensa o revisión. |
| `deletion_requested` | Usuario ha solicitado supresión.                      |
| `deletion_scheduled` | Supresión aprobada y programada.                      |
| `deleted`            | Datos eliminados del entorno operativo.               |
| `archived_minimal`   | Solo queda registro mínimo de trazabilidad.           |

## Matriz preliminar

| Categoría               |               Retención preliminar | Condición de borrado                  | Pendiente        |
| ----------------------- | ---------------------------------: | ------------------------------------- | ---------------- |
| Intake no activado      |                   Mínima operativa | Cierre o falta de continuidad         | Plazo final      |
| Intake con revisión     |           Según necesidad del caso | Resolución/cierre                     | Plazo final      |
| Consentimiento          | Mientras sea necesario demostrarlo | Revocación + cierre, salvo obligación | Validación legal |
| Transfer log            |       Según necesidad de auditoría | Cierre + plazo aplicable              | Plazo final      |
| Audit trail             |    Mínimo necesario para seguridad | Agotamiento de finalidad              | Plazo final      |
| Solicitudes de derechos |         Registro mínimo de gestión | Fin de obligación demostrativa        | Plazo final      |
| Backups                 |             Ciclo técnico limitado | Rotación controlada                   | Política infra   |

## Legal hold

Antes de borrar debe comprobarse si existe:

- obligación legal;
- reclamación abierta;
- necesidad de defensa;
- transferencia previa;
- requerimiento de autoridad;
- revisión DPO/legal;
- conflicto con terceros.

Si existe legal hold, la respuesta al usuario debe explicar la limitación aplicable sin exponer información indebida.

## Supresión

La supresión debe registrar:

- fecha de solicitud;
- identidad verificada;
- alcance solicitado;
- sistemas revisados;
- decisión;
- datos borrados;
- datos bloqueados;
- motivo de conservación parcial si aplica;
- operador;
- timestamp;
- audit event.

## Backups

Los backups no deben restaurar datos borrados al entorno activo salvo incidente.

Cuando un backup rote, el dato debe desaparecer conforme al ciclo técnico definido.

Pendiente: documentar proveedor, duración y restauración.

## Pendientes

- Tabla final de plazos.
- Workflow técnico de borrado.
- Prueba de borrado.
- Prueba de legal hold.
- Revisión de backups.
- UI/API de tracking.
