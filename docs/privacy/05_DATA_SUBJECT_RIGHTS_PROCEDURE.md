# 05 — Data Subject Rights Procedure

## Estado

Procedimiento preliminar para gestión de derechos RGPD.

Debe validarse por DPO/legal.

## Derechos contemplados

- Acceso.
- Rectificación.
- Supresión.
- Limitación.
- Portabilidad.
- Oposición.
- Retirada de consentimiento.
- Información sobre decisiones automatizadas si aplicase.

## Principio operativo

Ninguna solicitud debe resolverse solo con una acción técnica directa.

Debe existir:

1. recepción;
2. verificación;
3. delimitación de alcance;
4. búsqueda;
5. evaluación de restricciones;
6. ejecución;
7. respuesta;
8. registro auditable.

## Flujo

### 1. Recepción

Registrar:

- fecha;
- canal;
- solicitante;
- derecho invocado;
- alcance;
- referencia de caso/intake si existe;
- material aportado.

### 2. Verificación

Antes de actuar:

- verificar identidad o representación;
- evitar exposición a tercero;
- limitar datos pedidos para verificar;
- registrar método de verificación.

### 3. Localización

Buscar en:

- intakes;
- consentimientos;
- transfer logs;
- audit logs;
- notas;
- paquetes generados;
- solicitudes previas;
- backups, si aplica por política.

### 4. Evaluación de restricciones

Comprobar:

- legal hold;
- datos de terceros;
- secreto profesional o confidencialidad;
- defensa de reclamaciones;
- obligaciones legales;
- imposibilidad técnica razonada;
- transferencias previas.

### 5. Ejecución

Según derecho:

- exportar datos;
- corregir;
- bloquear;
- borrar;
- limitar uso;
- registrar retirada de consentimiento;
- documentar oposición.

### 6. Respuesta

La respuesta debe indicar:

- decisión;
- alcance ejecutado;
- límites;
- datos no incluidos;
- motivo de conservación si aplica;
- vías de contacto;
- fecha de cierre.

### 7. Registro

Mantener registro mínimo:

- solicitud;
- decisión;
- operador;
- timestamps;
- acciones;
- justificación;
- hash/export reference si aplica.

## Casos especiales

### Datos de terceros

No entregar datos de terceros sin revisión.

### Material sensible

Requiere revisión humana.

### Transfer packet ya emitido

Registrar solicitud y evaluar si procede notificar al receptor o limitar tratamiento posterior.

### Consentimiento revocado

La revocación debe impedir nuevas derivaciones/transferencias basadas en ese consentimiento, pero no borra automáticamente registros que deban conservarse.

## Pendientes técnicos

- Endpoint interno de tracking.
- Panel de privacy requests.
- Export estructurado.
- Deletion workflow.
- Legal hold workflow.
- Evidence of completion.
