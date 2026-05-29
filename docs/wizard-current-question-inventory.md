# Wizard Current Question Inventory

## 1. Objetivo

Inventariar las preguntas actuales del Wizard antes de rediseñar UX, añadir nuevas preguntas o tocar el contrato canónico.

Este documento separa:

- fase actual;
- pregunta visible;
- campo técnico en `WizardState`;
- presencia en `WizardResult`;
- impacto en señales/dominio;
- categoría UX;
- decisión preliminar;
- riesgos;
- tests afectados.

## 2. Criterios de clasificación

### Tipos

- `domain_signal`: la respuesta debe alimentar señales, snippets, reglas o decisión.
- `ux_context`: ayuda a orientar al usuario, pero no debería decidir por sí sola.
- `routing_hint`: ayuda a derivar ruta, prioridad o tipo de contacto.
- `documentation_only`: contexto útil para registro, no decisor.
- `risk_guardrail`: pregunta orientada a detectar riesgo o evitar mala dirección.
- `excluded`: candidata a eliminar o no capturar.

### Decisiones

- `keep`: mantener.
- `move`: mover de fase.
- `rename`: mantener concepto, cambiar redacción.
- `split`: dividir en más de una pregunta.
- `merge`: fusionar con otra pregunta.
- `remove`: eliminar.
- `review`: requiere decisión técnica/UX/legal.

## 3. Inventario por fase

### 3.1. TRIAGE

| Campo WizardState       | Pregunta / opción visible                                                                                       | Tipo             | Alimenta WizardResult | Impacto dominio | Decisión preliminar        | Riesgo / nota                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------: | --------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| `clientProfile`         | Perfil del solicitante: particular, conflicto familiar/herencia, abogado/despacho, procedimiento judicial, otro | `routing_hint`   |                    Sí | Alto            | `keep` + revisar redacción | Muy útil para derivación. Evitar prometer rol legal/pericial.                          |
| `urgency`               | Consulta informativa, riesgo de pérdida de pruebas, riesgo legal inmediato, situación crítica                   | `domain_signal`  |                    Sí | Alto            | `keep` + afinar            | Mezcla urgencia legal, emocional y evidencia. Puede requerir split.                    |
| `physicalSafetyRisk`    | Integridad física: amenaza real / zona segura                                                                   | `risk_guardrail` |                    Sí | Alto            | `keep`                     | Si hay riesgo físico, el sistema debe evitar lenguaje pericial y orientar con cautela. |
| `financialAssetRisk`    | Activos financieros: en riesgo / protegidos                                                                     | `domain_signal`  |                    Sí | Medio/alto      | `keep`                     | Relevante para fraude, urgencia y derivación.                                          |
| `attackerHasPasswords`  | Acceso a credenciales: comprometidas / seguras                                                                  | `domain_signal`  |                    Sí | Alto            | `keep`                     | Señal fuerte de compromiso.                                                            |
| `evidenceIsAutoDeleted` | Volatilidad de evidencia: autoeliminación / estable                                                             | `domain_signal`  |                    Sí | Alto            | `keep`                     | Señal crítica para preservación.                                                       |

### 3.2. COGNITIVE

| Campo WizardState      | Pregunta / opción visible                                | Tipo                            |            Alimenta WizardResult | Impacto dominio | Decisión preliminar | Riesgo / nota                                                                           |
| ---------------------- | -------------------------------------------------------- | ------------------------------- | -------------------------------: | --------------- | ------------------- | --------------------------------------------------------------------------------------- |
| `perceivedOmnipotence` | Percepción de vigilancia total vs tecnología restringida | `ux_context` / `risk_guardrail` | Sí, dentro de `cognitiveProfile` | Medio           | `review`            | Riesgo de sonar psicológico. Debe redactarse técnico, no clínico.                       |
| `isVerifiable`         | Hay prueba material vs indicios circunstanciales         | `domain_signal`                 |                               Sí | Alto            | `keep` + renombrar  | Muy útil si se formula como verificabilidad técnica.                                    |
| `distortionIndicator`  | Narrativa clara vs confusión/memoria                     | `risk_guardrail`                |                               Sí | Medio           | `review`            | Alto riesgo de interpretación psicológica. Mejor orientar como consistencia documental. |
| `hasEmotionalDistress` | Malestar emocional sí/no                                 | `ux_context` / `risk_guardrail` |                               Sí | Medio           | `review`            | Evitar uso decisor fuerte. Puede ser solo UX/derivación humana.                         |
| `shockLevel`           | Bajo / medio / alto                                      | `ux_context`                    |                               Sí | Bajo/medio      | `review`            | No debe parecer evaluación clínica.                                                     |

### 3.3. CONTEXT

| Campo WizardState        | Pregunta / opción visible           | Tipo                                   | Alimenta WizardResult | Impacto dominio | Decisión preliminar | Riesgo / nota                                       |
| ------------------------ | ----------------------------------- | -------------------------------------- | --------------------: | --------------- | ------------------- | --------------------------------------------------- |
| `isOngoing`              | Incidente activo ahora / finalizado | `domain_signal`                        |       Sí, condicional | Alto            | `keep`              | Importante para urgencia y preservación.            |
| `estimatedIncidentStart` | No lo sé / días / semanas / meses   | `documentation_only` / `domain_signal` |       Sí, condicional | Medio           | `keep`              | Útil para cronología, SLA y volatilidad.            |
| `dataSensitivityLevel`   | Baja / media / alta sensibilidad    | `domain_signal`                        |       Sí, condicional | Alto            | `keep`              | Relevante para privacidad y prioridad.              |
| `hasAccessToDevices`     | Tengo acceso / no tengo acceso      | `domain_signal`                        |       Sí, condicional | Alto            | `keep`              | Relevante para viabilidad técnica de preservación.  |
| `thirdPartiesInvolved`   | Hay terceros / solo yo              | `routing_hint` / `documentation_only`  |       Sí, condicional | Medio           | `keep` + revisar    | Puede afectar consentimiento, privacidad y alcance. |

### 3.4. DETAILS

| Campo WizardState | Pregunta / opción visible                                                                                         | Tipo                                   | Alimenta WizardResult | Impacto dominio | Decisión preliminar         | Riesgo / nota                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------: | --------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| `incident`        | Tipo de incidente: acoso, stalking, fraude, identidad, filtración, acceso no autorizado, conflicto familiar, otro | `domain_signal`                        |                    Sí | Alto            | `keep` + revisar categorías | Base para señales. Puede necesitar nueva taxonomía.                                       |
| `devices`         | Ninguno / 1 / 2 / 3 o más                                                                                         | `domain_signal`                        |                    Sí | Medio           | `keep`                      | Relevante para alcance técnico.                                                           |
| `evidenceSources` | Teléfono, ordenador, tablet, capturas, WhatsApp, email, SMS, informe forense previo                               | `domain_signal`                        |                    Sí | Alto            | `keep` + quizás dividir     | Mezcla dispositivos y fuentes. Puede dividirse en “dispositivos” y “material disponible”. |
| `actionsTaken`    | Aseguré accesos, cambié contraseñas, denuncié, recopilé, contacté autoridades, no hice nada                       | `domain_signal` / `documentation_only` |                    Sí | Medio/alto      | `keep` + revisar            | Útil para estado de contención, pero puede contaminar si no se contextualiza.             |
| `objective`       | Documentar, prevenir, acción legal, entender, recuperar acceso                                                    | `routing_hint`                         |                    Sí | Alto            | `keep`                      | Clave para cierre y CTA.                                                                  |

## 4. Campos técnicos actuales

| Campo                    | Tipo actual    | Fase      | Observación               |
| ------------------------ | -------------- | --------- | ------------------------- | -------------------------------------- | ------------ | ----------------------- | ---------------------- |
| `phase`                  | `TRIAGE        | COGNITIVE | CONTEXT                   | DETAILS`                               | Global       | Control de navegación.  |
| `clientProfile`          | `ClientProfile | null`     | TRIAGE                    | Dominio.                               |
| `urgency`                | `UrgencyLevel  | null`     | TRIAGE                    | Dominio.                               |
| `hasEmotionalDistress`   | `boolean       | null`     | COGNITIVE                 | Riesgo de redacción sensible.          |
| `physicalSafetyRisk`     | `boolean       | null`     | TRIAGE                    | Guardrail.                             |
| `financialAssetRisk`     | `boolean       | null`     | TRIAGE                    | Señal de riesgo.                       |
| `attackerHasPasswords`   | `boolean       | null`     | TRIAGE                    | Señal de credenciales.                 |
| `evidenceIsAutoDeleted`  | `boolean       | null`     | TRIAGE                    | Señal de volatilidad.                  |
| `perceivedOmnipotence`   | `boolean       | null`     | COGNITIVE                 | Revisar nombre/redacción.              |
| `isVerifiable`           | `boolean       | null`     | COGNITIVE                 | Mantener como verificabilidad técnica. |
| `distortionIndicator`    | `boolean       | null`     | COGNITIVE                 | Revisar o renombrar.                   |
| `shockLevel`             | `low           | medium    | high`                     | COGNITIVE                              | Revisar uso. |
| `isOngoing`              | `boolean       | null`     | CONTEXT                   | Buena señal operativa.                 |
| `hasAccessToDevices`     | `boolean       | null`     | CONTEXT                   | Buena señal operativa.                 |
| `dataSensitivityLevel`   | `low           | medium    | high                      | null`                                  | CONTEXT      | Buena señal privacidad. |
| `estimatedIncidentStart` | `unknown       | recent    | weeks                     | months                                 | null`        | CONTEXT                 | Cronología aproximada. |
| `thirdPartiesInvolved`   | `boolean       | null`     | CONTEXT                   | Alcance/privacidad.                    |
| `incident`               | `string        | null`     | DETAILS                   | Taxonomía actual.                      |
| `devices`                | `number        | null`     | DETAILS                   | Alcance.                               |
| `evidenceSources`        | `string[]`     | DETAILS   | Fuente/material.          |
| `actionsTaken`           | `string[]`     | DETAILS   | Contención/documentación. |
| `objective`              | `string        | null`     | DETAILS                   | Cierre/ruta.                           |

## 5. Hallazgos técnicos observados

### 5.1. `Wizard.tsx` concentra demasiada responsabilidad

El componente contiene:

- estado;
- navegación;
- render completo;
- cálculo de severidad;
- analítica;
- construcción de `WizardResult`;
- wiring con contrato canónico;
- controles accesibles custom.

Decisión: no añadir preguntas nuevas sin extraer al menos componentes base o tener una matriz cerrada.

### 5.2. `evidenceSources` mezcla dispositivos y evidencias

Ejemplos actuales:

- teléfono móvil;
- ordenador;
- tablet;
- capturas;
- WhatsApp;
- email;
- SMS;
- informe forense.

Riesgo: mezclar “soporte/dispositivo” con “fuente/evidencia” puede reducir precisión.

Decisión preliminar: dividir en próxima UX entre:

- dispositivos implicados;
- fuentes de evidencia disponibles;
- material ya preservado.

### 5.3. COGNITIVE requiere especial cuidado

Algunas preguntas pueden parecer psicológicas o clínicas si se redactan mal.

Decisión preliminar:

- mantener la intención de detectar consistencia/verificabilidad;
- evitar lenguaje diagnóstico;
- no usar como decisión legal/pericial;
- convertir en “calidad de información disponible” si procede.

### 5.4. `actionsTaken` es útil pero ambiguo

Algunas acciones son de contención técnica; otras son institucionales o legales.

Decisión preliminar: separar en:

- contención técnica;
- preservación/documentación;
- escalado externo.

## 6. Preguntas candidatas a rediseño

| Actual                 | Problema                                     | Propuesta                                                        |
| ---------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| `urgency`              | Mezcla urgencia legal, emocional y evidencia | Separar urgencia temporal, riesgo de pérdida y riesgo inmediato. |
| `perceivedOmnipotence` | Nombre/redacción sensible                    | Reformular como alcance percibido del acceso técnico.            |
| `distortionIndicator`  | Riesgo de interpretación psicológica         | Reformular como claridad documental / consistencia temporal.     |
| `evidenceSources`      | Mezcla dispositivos y fuentes                | Dividir dispositivo, canal y material preservado.                |
| `actionsTaken`         | Mezcla contención y escalado                 | Dividir acciones técnicas y acciones externas.                   |

## 7. Impacto en contrato canónico

Pendiente de revisar campo a campo contra:

- `canonical-wizard.v1.ts`;
- `signal-resolver.ts`;
- `snippet-resolver.ts`;
- `wizard-answer-adapter.ts`;
- tests de contratos.

No se debe modificar contrato canónico hasta cerrar una matriz de impacto por pregunta.

## 8. Tests afectados

Cualquier cambio futuro de preguntas puede afectar:

- `apps/web/src/__tests__/components/Wizard.test.tsx`;
- `apps/web/src/__tests__/i18n/wizard-i18n.test.tsx`;
- `apps/web/src/__tests__/hooks/wizard/useWizardContractContext.test.ts`;
- `apps/web/src/__tests__/lib/wizard-contracts/wizard-answer-adapter.test.ts`;
- `packages/domain/src/wizard-contracts/__tests__/canonical-wizard.contract.test.ts`;
- `packages/domain/src/wizard-contracts/__tests__/signal-resolver.test.ts`;
- `packages/domain/src/wizard-contracts/__tests__/snippet-resolver.test.ts`;
- E2E Wizard.

## 9. Decisiones pendientes

1. ¿Se mantiene una fase COGNITIVE separada o se integra como calidad/claridad de información?
2. ¿Se divide `evidenceSources` en dispositivo/canal/material?
3. ¿Se separa `urgency` en tres preguntas?
4. ¿Qué preguntas son obligatorias y cuáles opcionales?
5. ¿Qué campos deben alimentar señales y cuáles solo UX?
6. ¿Qué taxonomía de incidentes debe mantenerse?
7. ¿Qué preguntas deben mostrarse solo condicionalmente?

## 10. Próximo paso recomendado

Crear una matriz de impacto de contrato:

```text
docs(wizard): map current questions to canonical signals
refactor(wizard): extract option controls

```
