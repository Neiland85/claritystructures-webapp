# 01 — GDPR / RGPD Baseline

## Objetivo

Definir una baseline RGPD preliminar para `claritystructures-webapp`.

El objetivo no es afirmar cumplimiento completo, sino dejar documentada una arquitectura revisable, prudente y auditable para tratamientos de datos personales en contextos sensibles.

## Tesis de privacidad

`claritystructures-webapp` no debe tratar cada entrada del usuario como evidencia utilizable por defecto.

Debe operar como frontera institucional:

1. recibe información;
2. clasifica contexto;
3. evalúa riesgo;
4. separa acciones permitidas y bloqueadas;
5. registra consentimiento cuando proceda;
6. limita derivación;
7. controla transferencia;
8. mantiene trazabilidad;
9. prepara revisión humana cuando exista riesgo.

## Principios RGPD aplicables

### Licitud, lealtad y transparencia

El sistema debe explicar:

- qué información se solicita;
- para qué se usa;
- qué acciones están permitidas;
- cuándo se requiere revisión;
- qué transferencias pueden producirse;
- cómo ejercer derechos.

### Limitación de finalidad

El intake no equivale automáticamente a:

- prueba admitida;
- expediente legal;
- derivación jurídica;
- transferencia a tercero;
- tratamiento pericial.

Cada finalidad debe mantenerse separada.

### Minimización

El sistema debe evitar pedir más datos de los necesarios en la fase inicial.

Toda ampliación de alcance debe quedar asociada a:

- motivo;
- estado;
- base jurídica candidata;
- consentimiento o excepción aplicable;
- revisión humana si procede.

### Exactitud

El sistema no debe afirmar veracidad material de una evidencia o relato solo por haberlo recibido.

Debe distinguir:

- dato declarado por usuario;
- dato técnico observado;
- metadata generada por sistema;
- evidencia revisada;
- evidencia fuera de alcance;
- dato pendiente de verificación.

### Limitación del plazo de conservación

La retención debe depender de:

- finalidad;
- estado del caso;
- solicitud del usuario;
- obligación legal;
- bloqueo legal;
- transferencia realizada;
- necesidad de auditoría.

Los plazos concretos quedan pendientes de aprobación DPO/legal.

### Integridad y confidencialidad

Controles esperados:

- separación de secretos;
- no exposición de `.env`;
- migraciones seguras;
- control de acceso;
- trazabilidad de acciones;
- hash de paquetes transferibles;
- idempotencia defensiva;
- auditoría de decisiones.

### Responsabilidad proactiva

El repo debe poder demostrar:

- qué se decidió;
- cuándo;
- con qué versión de política;
- bajo qué consentimiento;
- qué se bloqueó;
- qué se transfirió;
- qué queda pendiente.

## Datos personales potenciales

Categorías posibles:

- identificación y contacto;
- relato del caso;
- archivos adjuntos;
- metadata técnica;
- datos de terceros mencionados;
- datos sensibles si el usuario los aporta;
- comunicaciones;
- logs de operación;
- decisiones de gobernanza.

## Datos especialmente sensibles

El sistema debe asumir riesgo elevado cuando el intake incluya o pueda incluir:

- salud;
- datos laborales sensibles;
- datos legales o judiciales;
- menores;
- orientación sexual;
- origen racial o étnico;
- creencias;
- biometría;
- datos de terceros no presentes;
- material íntimo;
- incidentes de seguridad;
- evidencia penal, administrativa o laboral.

## Separación de estados

Estados recomendados:

- `received`
- `classified`
- `pending_review`
- `consent_required`
- `legal_hold`
- `transfer_ready`
- `transferred`
- `closed`
- `deleted`
- `blocked`

## Límites explícitos

El sistema no debe prometer:

- cumplimiento RGPD completo sin revisión;
- validez jurídica automática;
- conservación indefinida;
- transferencia sin base;
- tratamiento de categorías especiales sin evaluación;
- sustitución del criterio legal o DPO.

## Pendientes de cierre

- Validación DPO/legal.
- Mapa definitivo de responsables/encargados.
- Tabla final de retención.
- Revisión de proveedores.
- Revisión de transferencias internacionales.
- Evaluación definitiva de impacto si el tratamiento escala.
