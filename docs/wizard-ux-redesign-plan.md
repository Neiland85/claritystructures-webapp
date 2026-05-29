# Wizard UX Redesign Plan

## 1. Objetivo

Rediseñar el Wizard de Clarity Structures para convertirlo en un flujo de prediagnóstico más claro, más defendible y más útil para preproducción/preventa, sin degradar la trazabilidad técnica ni contaminar el motor de decisión con preguntas ambiguas.

El objetivo no es “hacerlo más bonito”. El objetivo es construir un flujo UX que:

- reduzca fricción inicial;
- mejore la calidad de la información capturada;
- distinga datos operativos, señales de riesgo y contexto subjetivo;
- mantenga separación entre UX, contrato canónico y dominio;
- sea auditable en due diligence técnica;
- no introduzca afirmaciones legales/periciales indebidas.

## 2. Estado actual documentado

El Wizard actual contiene cuatro fases principales:

1. TRIAGE
2. COGNITIVE
3. CONTEXT
4. DETAILS

El componente principal `Wizard.tsx` concentra actualmente estado, renderizado, navegación, preguntas, estilos, cálculo parcial de severidad, emisión de analítica y construcción de `WizardResult`.

Riesgos técnicos actuales:

- componente demasiado grande;
- complejidad cognitiva alta;
- controles customizados con `role="radio"` / `role="checkbox"`;
- algunos patrones de accesibilidad pendientes;
- mezcla de presentación, estado y decisión;
- riesgo de seguir parcheando sin rediseño previo.

## 3. Principios de rediseño

### 3.1. No mezclar objetivos

Cada pregunta debe clasificarse en una sola categoría principal:

- dato de identificación del caso;
- señal de urgencia;
- señal de riesgo físico;
- señal de riesgo patrimonial;
- señal de compromiso de credenciales;
- señal de volatilidad de evidencia;
- contexto técnico;
- contexto emocional/cognitivo;
- objetivo operativo del usuario;
- dato no apto para motor de decisión.

### 3.2. Separar UX de dominio

No toda pregunta visible debe alimentar el dominio.

Cada pregunta nueva debe marcarse como:

- `domain_signal`: afecta señales / motor / snippets;
- `ux_context`: ayuda a orientar experiencia, pero no decide;
- `routing_hint`: ayuda a derivar ruta/contacto;
- `documentation_only`: queda en contexto, no decide;
- `excluded`: no se debe capturar.

### 3.3. Evitar sobrepromesa legal/pericial

El Wizard no debe prometer:

- que existe delito;
- que una prueba es válida judicialmente;
- que hay autor identificado;
- que se puede denunciar;
- que el sistema emite peritaje formal;
- que una conclusión técnica sustituye abogado/perito.

### 3.4. Captura mínima útil

El Wizard debe pedir lo suficiente para orientar, no para agotar al usuario.

El rediseño debe reducir ruido, agrupar preguntas y priorizar progresión.

## 4. Mapa de fases propuesto

### 4.1. Fase 1 — Identificación rápida del caso

Objetivo: entender quién consulta y qué nivel de urgencia percibe.

Preguntas candidatas:

- perfil del solicitante;
- urgencia temporal;
- tipo general de situación;
- si hay riesgo inmediato;
- si hay pérdida de acceso o credenciales.

Salida esperada:

- prioridad inicial;
- ruta preliminar;
- advertencia si hay riesgo físico o urgencia real.

### 4.2. Fase 2 — Riesgo y exposición

Objetivo: detectar señales críticas sin entrar todavía en detalle largo.

Preguntas candidatas:

- riesgo físico;
- riesgo económico/patrimonial;
- contraseñas o accesos comprometidos;
- evidencia que podría desaparecer;
- datos sensibles afectados.

Salida esperada:

- señales de riesgo;
- flags de atención;
- snippets explicativos.

### 4.3. Fase 3 — Contexto técnico y evidencia

Objetivo: entender qué material existe y qué capacidad de preservación hay.

Preguntas candidatas:

- dispositivos implicados;
- acceso físico a dispositivos;
- fuentes disponibles;
- acciones tomadas;
- si el incidente sigue activo;
- ventana temporal aproximada.

Salida esperada:

- preparación de intervención;
- riesgos de contaminación/pérdida;
- necesidades de preservación.

### 4.4. Fase 4 — Objetivo y cierre

Objetivo: convertir el diagnóstico en siguiente paso operativo.

Preguntas candidatas:

- objetivo principal;
- nivel de documentación deseado;
- necesidad de abogado/despacho;
- preferencia de contacto;
- consentimiento y resumen.

Salida esperada:

- `WizardResult`;
- ruta recomendada;
- contacto / intake;
- payload estable para `/api/contact`.

## 5. Preguntas actuales a revisar

Pendiente de inventario detallado contra `Wizard.tsx`, `wizardOptions` y contrato canónico.

Cada pregunta debe quedar clasificada en:

| Pregunta | Fase actual | Fase propuesta | Tipo | Alimenta dominio | Mantener | Riesgo |
| -------- | ----------: | -------------: | ---- | ---------------- | -------- | ------ |
| TBD      |         TBD |            TBD | TBD  | TBD              | TBD      | TBD    |

## 6. Preguntas nuevas candidatas

### 6.1. Preguntas de urgencia operativa

- ¿Hay riesgo físico inmediato?
- ¿Hay riesgo económico activo?
- ¿Has perdido acceso a cuentas o dispositivos?
- ¿Crees que la evidencia puede desaparecer en horas/días?

### 6.2. Preguntas de evidencia

- ¿Qué material tienes disponible?
- ¿Está el material en tu poder?
- ¿Está en servicios cloud, apps o dispositivos físicos?
- ¿Has modificado, reenviado o editado los archivos?

### 6.3. Preguntas de contexto técnico

- ¿Qué dispositivos están implicados?
- ¿Tienes acceso a esos dispositivos?
- ¿Hay cuentas compartidas?
- ¿Hay terceros afectados?

### 6.4. Preguntas de objetivo

- ¿Quieres preservar evidencia?
- ¿Quieres entender qué ocurrió?
- ¿Quieres preparar entrega a abogado?
- ¿Quieres recuperar acceso?
- ¿Quieres valorar si merece escalar?

## 7. Matriz de impacto técnico

Cada pregunta nueva debe mapearse así:

| Pregunta | Campo UI | WizardState | WizardResult | Domain signal | Snippet | Test requerido |
| -------- | -------- | ----------- | ------------ | ------------- | ------- | -------------- |
| TBD      | TBD      | TBD         | TBD          | TBD           | TBD     | TBD            |

## 8. Arquitectura técnica propuesta

### 8.1. Componentes a extraer

- `WizardShell`
- `WizardProgress`
- `WizardPhaseHeader`
- `WizardRadioOption`
- `WizardBooleanChoice`
- `WizardCheckboxOption`
- `TriagePhase`
- `CognitivePhase`
- `ContextPhase`
- `DetailsPhase`

### 8.2. Separación de responsabilidades

`Wizard.tsx` debería quedar como orquestador:

- estado;
- navegación;
- submit;
- composición de fases.

Las fases deberían contener renderizado específico.

Los componentes de opción deberían contener:

- accesibilidad;
- selección visual;
- evento de cambio;
- estado checked/disabled.

## 9. Plan de PRs

### PR 1 — Documento de dirección

`docs(wizard): define UX redesign plan`

Contenido:

- mapa de fases;
- criterios de clasificación;
- riesgos;
- plan de PRs;
- criterios de aceptación.

### PR 2 — Inventario de preguntas actuales

`docs(wizard): inventory current questions`

Contenido:

- tabla de preguntas actuales;
- clasificación por fase;
- decisión preliminar mantener/mover/eliminar.

### PR 3 — Componentes base de opciones

`refactor(wizard): extract option controls`

Contenido:

- extraer componentes pequeños;
- no cambiar preguntas;
- no cambiar dominio;
- mantener tests verdes.

### PR 4 — Fases extraídas

`refactor(wizard): extract phase sections`

Contenido:

- extraer fases;
- reducir complejidad;
- mantener comportamiento.

### PR 5 — Nuevas preguntas UX

`feat(wizard): add redesigned intake questions`

Contenido:

- añadir preguntas aprobadas;
- actualizar estado;
- actualizar resultados;
- actualizar tests.

### PR 6 — Contrato canónico / señales

`feat(wizard): map new questions to canonical signals`

Solo si las nuevas preguntas afectan dominio.

### PR 7 — E2E y documentación

`test(wizard): harden redesigned wizard flow`

Contenido:

- E2E español/inglés;
- documentación de readiness;
- validación final.

## 10. Criterios de aceptación

El rediseño no se considera listo hasta que:

- typecheck pasa;
- build pasa;
- suite completa pasa;
- E2E Wizard pasa;
- no hay regresión en `/api/contact`;
- no hay nuevos secretos ni `.env`;
- las preguntas nuevas están clasificadas;
- las preguntas que alimentan dominio están justificadas;
- README o docs reflejan estado real.

## 11. Fuera de alcance inicial

- diseño visual completo de marca;
- reescritura total del motor de decisión;
- promesas legales/periciales;
- automatización de informes finales;
- cambios en billing;
- cambios en infraestructura.

## 12. Riesgos

### Riesgo 1 — Sobrecargar el Wizard

Demasiadas preguntas pueden reducir conversión.

Mitigación: dividir entre preguntas obligatorias y contextuales.

### Riesgo 2 — Contaminar dominio con subjetividad

No toda respuesta subjetiva debe afectar señales.

Mitigación: clasificar cada pregunta antes de implementarla.

### Riesgo 3 — Romper accesibilidad existente

El Wizard ya tuvo incidencias con ARIA y roles.

Mitigación: PRs pequeños y tests focales.

### Riesgo 4 — Romper E2E

Los cambios visuales pueden afectar selectores.

Mitigación: usar queries semánticas robustas.

### Riesgo 5 — Aumentar complejidad

Añadir preguntas sin extraer componentes agravará el problema actual.

Mitigación: refactor previo o simultáneo en PRs separados.

## 13. Decisión operativa

No se implementan nuevas preguntas hasta cerrar el inventario actual y decidir su clasificación.

El siguiente paso tras este documento será inventariar preguntas actuales y definir la tabla de impacto.
