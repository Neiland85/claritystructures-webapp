# Wizard Current Questions to Canonical Signals Map

## 1. Objetivo

Mapear las preguntas actuales del Wizard contra el contrato canónico, señales derivadas, snippets y riesgos antes de implementar nuevas preguntas o refactorizar el flujo UX.

Este documento conecta:

- campo UI;
- campo `WizardState`;
- campo `WizardResult`;
- `WizardAnswerMap`;
- señal canónica;
- snippet o decisión asociada;
- riesgo de rediseño;
- acción recomendada.

## 2. Fuentes revisadas

- `apps/web/src/components/Wizard.tsx`
- `apps/web/src/constants/wizardOptions.ts`
- `apps/web/src/lib/wizard-contracts/wizard-answer-adapter.ts`
- `packages/domain/src/wizard-contracts/canonical-wizard.v1.ts`
- `packages/domain/src/wizard-contracts/signal-resolver.ts`
- `docs/wizard-current-question-inventory.md`
- `docs/wizard-ux-redesign-plan.md`

## 3. Matriz principal

| Fase      | Campo WizardState        | WizardResult                                      | WizardAnswerMap          | Señales canónicas esperadas                                                                                 | Tipo                                   | Decisión                               |
| --------- | ------------------------ | ------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------- |
| TRIAGE    | `clientProfile`          | `clientProfile`                                   | `clientProfile`          | `routing.private_case`, `routing.family_dispute`, `routing.legal_professional`, `routing.court_related`     | `routing_hint`                         | Mantener. Revisar copy.                |
| TRIAGE    | `urgency`                | `urgency`                                         | `urgency`                | `risk.time_sensitive`, `risk.legal`, `risk.critical`                                                        | `domain_signal`                        | Mantener, pero valorar split.          |
| TRIAGE    | `physicalSafetyRisk`     | `physicalSafetyRisk`                              | `physicalSafetyRisk`     | `risk.physical_safety`                                                                                      | `risk_guardrail`                       | Mantener. Prioridad alta.              |
| TRIAGE    | `financialAssetRisk`     | `financialAssetRisk`                              | `financialAssetRisk`     | `risk.financial_asset`                                                                                      | `domain_signal`                        | Mantener.                              |
| TRIAGE    | `attackerHasPasswords`   | `attackerHasPasswords`                            | `attackerHasPasswords`   | `risk.credential_compromise`                                                                                | `domain_signal`                        | Mantener.                              |
| TRIAGE    | `evidenceIsAutoDeleted`  | `evidenceIsAutoDeleted`                           | `evidenceIsAutoDeleted`  | `risk.evidence_volatility`                                                                                  | `domain_signal`                        | Mantener.                              |
| COGNITIVE | `hasEmotionalDistress`   | `hasEmotionalDistress`, `cognitiveProfile`        | `hasEmotionalDistress`   | `risk.emotional_distress`                                                                                   | `ux_context` / `risk_guardrail`        | Revisar uso. No usar como diagnóstico. |
| COGNITIVE | `perceivedOmnipotence`   | `cognitiveProfile.perceivedOmnipotenceOfAttacker` | `perceivedOmnipotence`   | potencialmente ninguna o `risk.cognitive_distortion` según contrato                                         | `ux_context`                           | Renombrar.                             |
| COGNITIVE | `isVerifiable`           | `cognitiveProfile.isInformationVerifiable`        | `isVerifiable`           | señal indirecta / calidad de evidencia                                                                      | `domain_signal`                        | Mantener como verificabilidad técnica. |
| COGNITIVE | `distortionIndicator`    | `cognitiveProfile.cognitiveDistortion`            | `distortionIndicator`    | `risk.cognitive_distortion`                                                                                 | `risk_guardrail`                       | Renombrar. Alto riesgo semántico.      |
| COGNITIVE | `shockLevel`             | `cognitiveProfile.emotionalShockLevel`            | `shockLevel`             | posible señal contextual                                                                                    | `ux_context`                           | Revisar.                               |
| CONTEXT   | `isOngoing`              | `isOngoing`                                       | `isOngoing`              | `exposure.active`, `exposure.potential`                                                                     | `domain_signal`                        | Mantener.                              |
| CONTEXT   | `estimatedIncidentStart` | `estimatedIncidentStart`                          | `estimatedIncidentStart` | posible apoyo a volatilidad / cronología                                                                    | `documentation_only` / `domain_signal` | Mantener.                              |
| CONTEXT   | `dataSensitivityLevel`   | `dataSensitivityLevel`                            | `dataSensitivityLevel`   | `privacy.high_sensitivity`, `privacy.personal_data`                                                         | `domain_signal`                        | Mantener.                              |
| CONTEXT   | `hasAccessToDevices`     | `hasAccessToDevices`                              | `hasAccessToDevices`     | posible señal de viabilidad técnica                                                                         | `domain_signal`                        | Mantener.                              |
| CONTEXT   | `thirdPartiesInvolved`   | `thirdPartiesInvolved`                            | `thirdPartiesInvolved`   | posible routing/privacy                                                                                     | `routing_hint`                         | Mantener con cautela.                  |
| DETAILS   | `incident`               | `incident`                                        | `incident`               | depende de opciones / derivación legal                                                                      | `domain_signal`                        | Mantener, revisar taxonomía.           |
| DETAILS   | `devices`                | `devices`                                         | `devices`                | apoyo a `evidence.full_device` / alcance                                                                    | `domain_signal`                        | Mantener.                              |
| DETAILS   | `evidenceSources`        | `evidenceSources`                                 | `evidenceSources`        | `evidence.none`, `evidence.full_device`, `evidence.screenshots`, `evidence.messages_only`, `evidence.mixed` | `domain_signal`                        | Dividir en rediseño.                   |
| DETAILS   | `actionsTaken`           | `actionsTaken`                                    | `actionsTaken`           | `exposure.active`, `exposure.potential`, `exposure.contained`                                               | `domain_signal` / `documentation_only` | Dividir.                               |
| DETAILS   | `objective`              | `objective`                                       | `objective`              | `legal.derivation_candidate`, `exposure.contained`, routing                                                 | `routing_hint`                         | Mantener.                              |

## 4. Señales críticas que deben conservarse

Estas señales no deberían perderse en el rediseño:

- `risk.physical_safety`
- `risk.credential_compromise`
- `risk.evidence_volatility`
- `risk.time_sensitive`
- `privacy.high_sensitivity`
- `evidence.full_device`
- `evidence.screenshots`
- `evidence.messages_only`
- `exposure.active`
- `exposure.contained`
- `legal.derivation_candidate`

## 5. Señales sensibles que requieren cautela

Estas señales pueden ser útiles, pero tienen riesgo semántico o reputacional:

- `risk.emotional_distress`
- `risk.cognitive_distortion`

Decisión preliminar:

- no eliminarlas sin revisar;
- no usarlas como diagnóstico;
- no presentarlas al usuario con lenguaje clínico;
- tratarlas como calidad/consistencia de información o necesidad de revisión humana.

## 6. Preguntas que conviene dividir

### 6.1. `urgency`

Actualmente mezcla:

- consulta preventiva;
- pérdida de evidencia;
- riesgo legal;
- situación crítica.

Propuesta:

- urgencia temporal;
- riesgo de pérdida de evidencia;
- riesgo legal/procedimental;
- riesgo personal o patrimonial.

### 6.2. `evidenceSources`

Actualmente mezcla:

- dispositivos;
- canales;
- capturas;
- informes previos.

Propuesta:

- dispositivos implicados;
- canales/cuentas implicadas;
- material disponible;
- material preservado;
- material modificado o reenviado.

### 6.3. `actionsTaken`

Actualmente mezcla:

- contención técnica;
- preservación;
- reporte;
- escalado institucional.

Propuesta:

- acciones de seguridad;
- acciones de preservación;
- acciones legales/institucionales;
- ninguna acción.

## 7. Preguntas que conviene renombrar

| Campo                  | Riesgo                                     | Nuevo enfoque recomendado                                   |
| ---------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| `perceivedOmnipotence` | Suena psicológico / subjetivo              | Alcance percibido del acceso técnico.                       |
| `distortionIndicator`  | Suena clínico o evaluativo                 | Claridad documental / consistencia temporal.                |
| `shockLevel`           | Puede parecer valoración emocional clínica | Nivel de urgencia subjetiva o necesidad de acompañamiento.  |
| `hasEmotionalDistress` | Riesgo sensible                            | Señal de necesidad de atención humana, no decisión técnica. |

## 8. Impacto en tests

Cambios futuros en esta matriz afectarán a:

- `apps/web/src/__tests__/components/Wizard.test.tsx`
- `apps/web/src/__tests__/i18n/wizard-i18n.test.tsx`
- `apps/web/src/__tests__/hooks/wizard/useWizardContractContext.test.ts`
- `apps/web/src/__tests__/lib/wizard-contracts/wizard-answer-adapter.test.ts`
- `packages/domain/src/wizard-contracts/__tests__/canonical-wizard.contract.test.ts`
- `packages/domain/src/wizard-contracts/__tests__/signal-resolver.test.ts`
- `packages/domain/src/wizard-contracts/__tests__/snippet-resolver.test.ts`
- E2E Wizard

## 9. Criterios para nuevas preguntas

Una pregunta nueva solo se añade si cumple al menos una condición:

- mejora routing;
- mejora detección de riesgo;
- mejora preservación de evidencia;
- reduce ambigüedad de una pregunta existente;
- permite eliminar una pregunta peor;
- mejora privacidad/minimización;
- mejora claridad operativa.

Toda pregunta nueva debe declarar:

- fase;
- campo UI;
- campo dominio, si aplica;
- señal canónica, si aplica;
- snippet, si aplica;
- test afectado;
- riesgo semántico.

## 10. Decisión operativa

Antes de implementar nuevas preguntas, el siguiente paso recomendado es:

```text
refactor(wizard): extract option controls
Objetivo: reducir riesgo técnico antes de añadir más superficie al Wizard.

Después de extraer controles, podrán abordarse:

feat(wizard): add redesigned intake questions
feat(wizard): map new questions to canonical signals
test(wizard): harden redesigned wizard flow

```
