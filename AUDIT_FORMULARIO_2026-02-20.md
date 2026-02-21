# Auditoría Técnica — Formulario de Intake | claritystructures-webapp

**Fecha:** 2026-02-20
**Auditor:** Arquitecto de Software Senior (independiente)
**Alcance:** Formulario Wizard + ContactForm + API `/api/contact` + Capas hexagonales
**Método:** Inspección repo (filesystem) + Inspección producción (browser automation)
**Commit base:** rama principal (sin worktrees)

---

## 1. HECHOS OBSERVABLES

### 1.1 Estructura del Formulario

El formulario es un **sistema multi-paso (Wizard 3 fases → ContactForm)** con routing basado en decisión algorítmica:

| Componente             | Archivo                                                  | Responsabilidad                                                               |
| ---------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `Wizard`               | `apps/web/src/components/Wizard.tsx`                     | 3 fases: TRIAGE → COGNITIVE → TRACE. Captura ~20 señales.                     |
| `Hero`                 | `apps/web/src/components/Hero.tsx`                       | Orquesta Wizard → `decideIntake()` → navegación a ruta                        |
| `ContactForm`          | `apps/web/src/components/ContactForm.tsx`                | Router: legal/critical → `ContactFormLegal`, resto → `ContactFormBasic`       |
| `ContactFormBasic`     | `apps/web/src/components/forms/ContactFormBasic.tsx`     | email + message. Hardcodea `consent: true`.                                   |
| `ContactFormLegal`     | `apps/web/src/components/forms/ContactFormLegal.tsx`     | email + phone + message. Loading state. Sin consent explícito.                |
| `ContactFormSensitive` | `apps/web/src/components/forms/ContactFormSensitive.tsx` | Shell re-export de `mapWizardToSignals`. No es un formulario.                 |
| `ConsentBlock`         | `apps/web/src/components/ConsentBlock.tsx`               | Componente de consentimiento. **Existe pero NO se usa en ningún formulario.** |
| `ContactConfirmation`  | `apps/web/src/components/ContactConfirmation.tsx`        | Mensajes post-submit por tono. **No integrado en los formularios actuales.**  |

### 1.2 Flujo Verificado en Producción (browser)

1. Carga `https://app.claritystructures.com/es` → renderiza Wizard paso 1
2. Cookie consent banner (RGPD) se superpone **bloqueando interacción con el formulario** (z-index conflict)
3. Wizard paso 1: selección perfil + urgencia + riesgos binarios
4. Wizard paso 2: evaluación cognitiva (3 preguntas binarias)
5. Wizard paso 3: trazado narrativo (3 preguntas binarias)
6. Submit → navega a `/es/contact/critical?data={JSON_ENCODED_WIZARD_RESULT}`
7. Formulario de contacto legal: 3 campos (email, phone, message) + botón submit
8. Submit → `POST /api/contact` con JSON body

### 1.3 Hallazgos de Producción (browser)

| Hallazgo                                | Evidencia                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------- |
| **CSP bloquea Google Fonts**            | Console error: `Loading the stylesheet 'https://fonts.goog...een blocked'` |
| **WizardResult en URL**                 | URL contiene `?data={JSON completo}` con datos psicológicos/riesgo         |
| **Typo "NARREACIÓN"**                   | Wizard.tsx línea 405: debería ser "NARRACIÓN"                              |
| **Cookie banner bloquea wizard**        | z-index del banner intercepta clicks en "Siguiente Paso"                   |
| **Sin ConsentBlock en formularios**     | Verificado en DOM: ningún checkbox de consentimiento visible               |
| **Ruta /critical muestra copy "legal"** | Texto: "Canal orientado a profesionales legales" — incorrecto para crisis  |

---

## 2. ANÁLISIS TÉCNICO

### 2.1 Arquitectura Actual del Formulario

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO ACTUAL (verificado)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser                                                        │
│  ┌──────────┐    ┌──────────┐    ┌───────────────┐             │
│  │  Wizard   │───>│   Hero   │───>│ ContactForm   │             │
│  │ (3 fases) │    │decideIn- │    │ Basic/Legal   │             │
│  │ useState  │    │take()    │    │               │             │
│  │ x20 vars  │    │ ↓        │    │ fetch("/api/  │             │
│  └──────────┘    │ router.  │    │  contact")    │──────┐      │
│                  │ push()   │    │  ↑ DIRECTO    │      │      │
│                  └──────────┘    └───────────────┘      │      │
│                       │                                  │      │
│                       │ ?data={JSON}                     │      │
│                       │ (en URL)                         │      │
│                       ▼                                  ▼      │
│  ──────────────────────────── BOUNDARY ──────────────────────── │
│                                                                 │
│  Server                                                         │
│  ┌──────────────────────────────────────────────┐              │
│  │  /api/contact/route.ts                       │              │
│  │  ┌─────────┐  ┌──────────┐  ┌────────────┐  │              │
│  │  │apiGuard │->│Zod valid.│->│submitIntake│  │              │
│  │  │(CORS)   │  │sanitize  │  │UseCase     │  │              │
│  │  └─────────┘  └──────────┘  └──────┬─────┘  │              │
│  └─────────────────────────────────────┼────────┘              │
│                                        ▼                        │
│  ┌──────────────┐  ┌───────────┐  ┌──────────┐                │
│  │MailNotifier  │  │ Prisma DB │  │AuditTrail│                │
│  │(SMTP/stub)   │  │(Postgres) │  │(composite)│               │
│  └──────────────┘  └───────────┘  └──────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

**Violaciones de boundary hexagonal identificadas:**

| Violación             | Archivo                   | Detalle                                                |
| --------------------- | ------------------------- | ------------------------------------------------------ |
| UI → Infra directa    | `ContactFormBasic.tsx:21` | `fetch("/api/contact")` directo desde componente       |
| UI → Infra directa    | `ContactFormLegal.tsx:23` | `fetch("/api/contact")` directo desde componente       |
| Dominio en UI         | `Hero.tsx`                | `decideIntake(result)` ejecutado en componente cliente |
| Estado no encapsulado | `Wizard.tsx`              | 20 `useState` independientes, sin form state machine   |

### 2.2 Validación

| Aspecto                 | Estado                      | Evidencia                                                                   |
| ----------------------- | --------------------------- | --------------------------------------------------------------------------- |
| Client-side validation  | **Mínima**                  | Solo `required` en inputs HTML y `type="email"`. Sin schema Zod en cliente. |
| Server-side validation  | **Sí**                      | Zod schema en `route.ts` + DOMPurify sanitization                           |
| Schema compartido FE↔BE | **No**                      | Frontend no importa ni valida contra schema Zod                             |
| Honeypot anti-bot       | **Sí**                      | Campo "website" invisible, silently rejects                                 |
| Mensajes i18n           | **Hardcodeados en español** | No hay sistema i18n a pesar de ruta `/[lang]/`                              |

### 2.3 UX / Accesibilidad

| Aspecto                       | Estado         | Detalle                                                              |
| ----------------------------- | -------------- | -------------------------------------------------------------------- |
| `aria-label` en forms         | **Sí**         | Ambos formularios tienen aria-label descriptivo                      |
| `sr-only` labels              | **Sí**         | Labels presentes pero ocultos visualmente                            |
| `role="radiogroup"` en Wizard | **Sí**         | Implementado correctamente con `aria-checked`                        |
| `role="alert"` en errores     | **Sí**         | Presente en ambos formularios                                        |
| Navegación por teclado        | **Parcial**    | Buttons como radio buttons no tienen tabindex ni keyboard nav nativa |
| Loading state (Basic)         | **No**         | `ContactFormBasic` no tiene loading/disabled state                   |
| Loading state (Legal)         | **Sí**         | `aria-busy`, disabled, texto "Enviando..."                           |
| Feedback post-submit          | **Básico**     | Texto inline, sin `ContactConfirmation` component                    |
| Ruta `/critical` copy         | **Incorrecto** | Muestra "Canal orientado a profesionales legales"                    |
| Cookie banner z-index         | **Bloquea UI** | Intercepta clicks en wizard hasta que se cierra                      |

### 2.4 Observabilidad

| Aspecto                 | Estado                        | Evidencia                                                          |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------ |
| PostHog analytics       | **Sí**                        | Gated behind cookie consent. `trackEvent()` en Wizard.             |
| Funnel events           | **Sí**                        | `wizard.step_view`, `wizard.step_submit`, `wizard.risk_classified` |
| Form submit tracking    | **No**                        | `ContactFormBasic/Legal` no trackean submit/error events           |
| Sentry / error tracking | **Configurado pero opcional** | `SENTRY_DSN` en `.env.example`, no confirmado en prod              |
| Structured logging      | **Sí**                        | `createLogger()` dual output (JSON prod / human dev)               |
| Audit trail             | **Sí**                        | `CompositeAuditTrail` (DB + console). Registra `intake_submitted`. |

### 2.5 Tests

| Área                   | Archivos                              | Coverage                                                   |
| ---------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `ContactFormBasic`     | `ContactFormBasic.test.tsx` (7 tests) | Render, submit, success, error, retry                      |
| `ContactFormLegal`     | `ContactFormLegal.test.tsx` (9 tests) | Render, submit, loading, success, error, retry             |
| `Wizard`               | `Wizard.test.tsx`                     | Render, navigation                                         |
| `ContactForm` (router) | `ContactForm.test.tsx`                | Routing logic                                              |
| API `/api/contact`     | `contact-route.test.ts`               | Validation, honeypot, success                              |
| Domain decision        | 6+ test files                         | V1/V2 engine, signals, replay                              |
| **NO tiene**           | —                                     | E2E del flujo completo wizard→form→submit                  |
| **Threshold config**   | `vitest.config.ts`                    | statements: 55%, branches: 70%, functions: 55%, lines: 55% |

---

## 3. TABLA DE DEUDA TÉCNICA

| #     | Hallazgo                                                                                                                     | Capa Violada           | Severidad | Causa Raíz                                                        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------- | ----------------------------------------------------------------- |
| DT-01 | **WizardResult en URL query params** — datos psicológicos/riesgo expuestos en browser history, referrer headers, server logs | Seguridad / Privacidad | **ALTA**  | Diseño de transferencia de estado via URL en vez de session/state |
| DT-02 | **ConsentBlock no integrado** — `consent: true` hardcodeado en BasicForm, ausente en LegalForm                               | Compliance RGPD        | **ALTA**  | Componente creado pero nunca conectado a los formularios          |
| DT-03 | **UI → Infra directa** — formularios hacen `fetch()` directo al API                                                          | Arquitectura Hexagonal | **MEDIA** | Falta capa application/use-case en cliente                        |
| DT-04 | **20 useState en Wizard** — sin state machine ni reducer                                                                     | Mantenibilidad         | **MEDIA** | Crecimiento orgánico sin refactor de estado                       |
| DT-05 | **Sin validación client-side con schema** — solo `required` HTML                                                             | Validación / UX        | **MEDIA** | Schema Zod solo existe en server-side                             |
| DT-06 | **Payloads inconsistentes** — Basic envía `{...context, consent}`, Legal envía `{wizardResult: context}`                     | Contrato API           | **MEDIA** | Dos formularios desarrollados independientemente                  |
| DT-07 | **i18n hardcodeado** — textos en español pese a ruta `/[lang]/`                                                              | i18n                   | **MEDIA** | Ruta preparada para i18n pero strings no externalizadas           |
| DT-08 | **CSP bloquea Google Fonts** en producción                                                                                   | Rendimiento / UX       | **BAJA**  | CSP nonce no incluye fonts.googleapis.com                         |
| DT-09 | **Typo "NARREACIÓN CLARA"**                                                                                                  | Calidad                | **BAJA**  | Error ortográfico en Wizard.tsx:405                               |
| DT-10 | **ContactFormSensitive es shell vacío**                                                                                      | Dead Code              | **BAJA**  | Archivo re-exporta `mapWizardToSignals`, no es formulario         |
| DT-11 | **Sin loading state en ContactFormBasic**                                                                                    | UX                     | **MEDIA** | Implementado en Legal pero no en Basic                            |
| DT-12 | **Ruta /critical muestra copy de "legal"**                                                                                   | UX                     | **MEDIA** | ContactFormLegal usado para critical sin adaptar copy             |
| DT-13 | **ContactConfirmation no integrado**                                                                                         | UX                     | **BAJA**  | Componente existe con mensajes por tono, no conectado             |
| DT-14 | **Sin CSRF token en form submit**                                                                                            | Seguridad              | **MEDIA** | apiGuard no requiere CSRF para endpoint público                   |
| DT-15 | **Cookie banner bloquea wizard**                                                                                             | UX                     | **MEDIA** | z-index del banner intercepta clicks en botones                   |
| DT-16 | **Sin tracking de submit en formularios**                                                                                    | Observabilidad         | **MEDIA** | `trackEvent` en Wizard pero no en ContactForm\*                   |
| DT-17 | **Family route sin formulario propio**                                                                                       | UX / Dominio           | **BAJA**  | `/contact/family` usa ContactFormBasic genérico                   |
| DT-18 | **Sin E2E tests** del flujo completo                                                                                         | Testing                | **MEDIA** | Unit tests buenos, falta e2e wizard→form→submit→confirmation      |

---

## 4. DIAGRAMA ASCII — FLUJO ACTUAL vs OBJETIVO

### 4.1 Flujo Actual

```
Usuario                    Browser (Client)                           Server
  │                              │                                       │
  │  Abre /es                    │                                       │
  ├─────────────────────────────>│                                       │
  │                              │                                       │
  │  [Cookie Banner BLOQUEA]     │                                       │
  │  Cierra banner               │                                       │
  │                              │                                       │
  │  Wizard Paso 1 (TRIAGE)      │                                       │
  │  ── 20 useState vars ──     │                                       │
  │  Selecciona perfil+urgencia  │                                       │
  ├─────────────────────────────>│                                       │
  │                              │                                       │
  │  Wizard Paso 2 (COGNITIVE)   │                                       │
  │  3 preguntas binarias        │                                       │
  ├─────────────────────────────>│                                       │
  │                              │                                       │
  │  Wizard Paso 3 (TRACE)       │                                       │
  │  3 preguntas binarias        │                                       │
  ├─────────────────────────────>│                                       │
  │                              │                                       │
  │                              │  decideIntake(result)                 │
  │                              │  ↓ (DOMINIO EN CLIENTE)               │
  │                              │  router.push(                         │
  │                              │    /es/contact/critical               │
  │                              │    ?data={JSON_SENSITIVO}  ⚠️         │
  │                              │  )                                    │
  │                              │                                       │
  │  ContactFormLegal            │                                       │
  │  email+phone+msg             │                                       │
  │  [SIN CONSENT CHECKBOX] ⚠️   │                                       │
  │  [SIN LOADING en Basic] ⚠️   │                                       │
  ├─────────────────────────────>│                                       │
  │                              │  fetch("/api/contact", {              │
  │                              │    email, phone, message,             │
  │                              │    tone: "legal",                     │
  │                              │    wizardResult: context  ← ⚠️        │
  │                              │  })  [PAYLOAD INCONSISTENTE]          │
  │                              ├──────────────────────────────────────>│
  │                              │                                       │
  │                              │                    apiGuard(CORS only)│
  │                              │                    Zod validate       │
  │                              │                    DOMPurify sanitize │
  │                              │                    submitIntakeUseCase│
  │                              │                    ├→ decideV2()      │
  │                              │                    ├→ Prisma.create() │
  │                              │                    ├→ MailNotifier    │
  │                              │                    └→ AuditTrail      │
  │                              │<──────────────────────────────────────│
  │                              │  { success: true }                    │
  │                              │                                       │
  │  "Hemos recibido tu          │                                       │
  │   solicitud" (inline text)   │                                       │
  │  [SIN ContactConfirmation]⚠️ │                                       │
  └──────────────────────────────┘                                       │
```

### 4.2 Flujo Objetivo

```
Usuario                    Browser (Client)                           Server
  │                              │                                       │
  │  Abre /es                    │                                       │
  ├─────────────────────────────>│                                       │
  │                              │  [Cookie banner NO bloquea wizard]    │
  │                              │                                       │
  │  Wizard (useReducer/FSM)     │                                       │
  │  Paso 1→2→3                  │                                       │
  │  ── Estado encapsulado ──    │                                       │
  │  ── Validación Zod inline ── │                                       │
  │  ── trackEvent por step ──   │                                       │
  ├─────────────────────────────>│                                       │
  │                              │                                       │
  │                              │  wizardResult → sessionStorage        │
  │                              │  (NO en URL)                          │
  │                              │  router.push(/es/contact/{route})     │
  │                              │                                       │
  │  ContactForm (por tono)      │                                       │
  │  ── Schema Zod compartido ── │                                       │
  │  ── ConsentBlock integrado ──│                                       │
  │  ── Copy adaptado por tono ──│                                       │
  │  ── Loading/Error states ──  │                                       │
  │  ── trackEvent submit ──     │                                       │
  ├─────────────────────────────>│                                       │
  │                              │                                       │
  │                              │  submitIntakeAction()                 │
  │                              │  (Server Action / use-case layer)     │
  │                              ├──────────────────────────────────────>│
  │                              │                    apiGuard + CSRF    │
  │                              │                    Zod (schema shared)│
  │                              │                    submitIntakeUseCase│
  │                              │                    ├→ decideV2()      │
  │                              │                    ├→ Prisma + consent│
  │                              │                    ├→ MailNotifier    │
  │                              │                    ├→ SLA timers      │
  │                              │                    └→ AuditTrail      │
  │                              │<──────────────────────────────────────│
  │                              │                                       │
  │  ContactConfirmation         │                                       │
  │  (por tono, con instrucciones│                                       │
  │   específicas)               │                                       │
  └──────────────────────────────┘                                       │
```

---

## 5. PLAN DE EVOLUCIÓN

### Nivel 1 — Estabilización (sin breaking changes) | Esfuerzo: S-M | 24-72h

> **Objetivo:** Corregir bugs y riesgos sin alterar arquitectura.

| #   | Acción                                                             | Archivo(s)                                                         | Criterio de Done                                                                  | Esfuerzo |
| --- | ------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- | -------- |
| 1.1 | Corregir typo "NARREACIÓN" → "NARRACIÓN"                           | `Wizard.tsx:405`                                                   | Visual verificado en prod                                                         | S        |
| 1.2 | Integrar `ConsentBlock` en `ContactFormBasic` y `ContactFormLegal` | `ContactFormBasic.tsx`, `ContactFormLegal.tsx`, `ConsentBlock.tsx` | Checkbox visible, consent enviado en payload                                      | S        |
| 1.3 | Añadir loading state a `ContactFormBasic`                          | `ContactFormBasic.tsx`                                             | Botón disabled + aria-busy durante submit                                         | S        |
| 1.4 | Integrar `ContactConfirmation` post-submit                         | `ContactFormBasic.tsx`, `ContactFormLegal.tsx`                     | Mensaje adaptado por tono visible tras submit                                     | S        |
| 1.5 | Fix CSP para Google Fonts                                          | `middleware.ts` o `next.config.ts`                                 | Console sin errores de fonts                                                      | S        |
| 1.6 | Fix z-index cookie banner                                          | `CookieConsent.tsx`                                                | Banner no intercepta clicks en wizard                                             | S        |
| 1.7 | Adaptar copy de `/critical`                                        | `ContactFormLegal.tsx` o crear `ContactFormCritical.tsx`           | Texto apropiado para crisis, no "profesionales legales"                           | S        |
| 1.8 | Añadir `trackEvent` en submit/error de formularios                 | `ContactFormBasic.tsx`, `ContactFormLegal.tsx`                     | Events `contact.submit_attempt`, `contact.submit_success`, `contact.submit_error` | S        |
| 1.9 | Normalizar payload: ambos formularios envían misma shape           | `ContactFormBasic.tsx`                                             | Payload consistente con `wizardResult` en ambos                                   | S        |

### Nivel 2 — Refactor Arquitectural | Esfuerzo: M-L | 2-4 semanas

> **Objetivo:** Alinear con hexagonal, compartir schemas, encapsular estado.

| #   | Acción                                                         | Archivo(s)                                                        | Criterio de Done                                     | Esfuerzo |
| --- | -------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- | -------- |
| 2.1 | **Extraer schema Zod compartido** FE↔BE                        | `packages/types/src/contact-intake.schema.ts` (nuevo o existente) | Mismo schema importado en frontend y API route       | M        |
| 2.2 | **Mover WizardResult fuera de URL** → sessionStorage o context | `Hero.tsx`, `ContactForm.tsx`, rutas contact                      | URL sin `?data=`, datos en sesión temporal           | M        |
| 2.3 | **Refactor Wizard a useReducer/FSM**                           | `Wizard.tsx`                                                      | 1 reducer en vez de 20 useState. Tests actualizados. | M        |
| 2.4 | **Crear capa application en cliente**                          | `apps/web/src/application/client/` (nuevo)                        | Formularios llaman use-case, no fetch directo        | M        |
| 2.5 | **Crear ContactFormCritical y ContactFormFamily**              | `apps/web/src/components/forms/`                                  | 4 formularios con copy/campos adaptados por tono     | M        |
| 2.6 | **Eliminar `ContactFormSensitive` (dead code)**                | `forms/ContactFormSensitive.tsx`                                  | Archivo eliminado, imports actualizados              | S        |
| 2.7 | **Externalizar strings i18n**                                  | Crear sistema de mensajes por locale                              | `t("form.submit")` en vez de strings hardcodeados    | L        |

### Nivel 3 — UX/DX Upgrade | Esfuerzo: M-L | 4-6 semanas

> **Objetivo:** UX profesional, accesibilidad WCAG 2.1 AA.

| #   | Acción                                                   | Criterio de Done                                   | Esfuerzo |
| --- | -------------------------------------------------------- | -------------------------------------------------- | -------- |
| 3.1 | Validación inline con error messages por campo           | Errores bajo cada input en tiempo real             | M        |
| 3.2 | Indicador de progreso visual en Wizard (no solo sr-only) | Barra o steps visual para usuarios videntes        | S        |
| 3.3 | Keyboard navigation completa en radiogroups del Wizard   | Arrow keys navegan entre opciones                  | M        |
| 3.4 | Focus management entre pasos del Wizard                  | Focus automático en primer elemento de cada paso   | S        |
| 3.5 | Animación de transición entre pasos                      | Transición suave sin layout shift                  | S        |
| 3.6 | Integrar DPIAModal pre-submit para tonos legal/critical  | Modal DPIA visible antes de envío en casos legales | M        |
| 3.7 | Optimistic UI + retry mecanismo                          | Submit con feedback inmediato + retry automático   | M        |

### Nivel 4 — Observabilidad y Calidad | Esfuerzo: M | 2-4 semanas

> **Objetivo:** Error tracking granular, test coverage ≥80%.

| #   | Acción                                           | Criterio de Done                                     | Esfuerzo |
| --- | ------------------------------------------------ | ---------------------------------------------------- | -------- |
| 4.1 | E2E tests del flujo completo (Playwright)        | wizard→form→submit→confirmation cubierto             | L        |
| 4.2 | Subir thresholds de coverage a 80%               | `vitest.config.ts` thresholds actualizados, CI green | M        |
| 4.3 | Sentry integration confirmada en producción      | Errores de formulario visibles en dashboard Sentry   | S        |
| 4.4 | Funnel analytics completo                        | Dashboard con conversion rates wizard→submit         | M        |
| 4.5 | Snapshot tests para decision engine (ya parcial) | Cubrir todos los edge cases de V2                    | S        |
| 4.6 | Performance monitoring (Core Web Vitals)         | LCP, FID, CLS medidos y dentro de umbrales           | M        |

### Nivel 5 — Producción-Grade | Esfuerzo: L | 2-3 meses

> **Objetivo:** Hardening para tráfico real.

| #   | Acción                                                  | Criterio de Done                          | Esfuerzo |
| --- | ------------------------------------------------------- | ----------------------------------------- | -------- |
| 5.1 | Rate limiting en `/api/contact` (Upstash Redis en prod) | Verificado con test de carga              | M        |
| 5.2 | CSRF double-submit en formularios                       | Token en cookie + header validado         | M        |
| 5.3 | Honeypot mejorado (timing-based)                        | Bot detection con timing analysis         | S        |
| 5.4 | A/B testing framework en Wizard                         | Feature flags para variantes de preguntas | L        |
| 5.5 | Analytics de conversión por step                        | Drop-off rates por fase del wizard        | M        |
| 5.6 | Backup y recovery de intakes                            | RPO/RTO definidos y verificados           | M        |
| 5.7 | Penetration test del formulario                         | Reporte de pentest limpio                 | L        |

---

## 6. CHECKLIST DE VERIFICACIÓN POR NIVEL

### Nivel 1 — Estabilización

- [ ] "NARRACIÓN" sin typo en producción
- [ ] ConsentBlock visible en todos los formularios
- [ ] Checkbox de consentimiento required antes de submit
- [ ] Loading state visible en ContactFormBasic
- [ ] ContactConfirmation renderizado post-submit con mensaje correcto por tono
- [ ] Google Fonts cargando sin error de CSP
- [ ] Cookie banner no intercepta clicks en wizard
- [ ] Ruta `/critical` muestra copy de crisis, no legal
- [ ] Events `contact.submit_*` visibles en PostHog
- [ ] Payload shape idéntico entre Basic y Legal

### Nivel 2 — Refactor Arquitectural

- [ ] Schema Zod importado en frontend y backend desde mismo paquete
- [ ] URL de contacto no contiene `?data=` con JSON sensible
- [ ] Wizard tiene 1 useReducer (no 20 useState)
- [ ] Formularios llaman función de capa application, no fetch directo
- [ ] 4 variantes de formulario (basic, family, legal, critical)
- [ ] `ContactFormSensitive.tsx` eliminado
- [ ] Strings externalizados con sistema i18n (mínimo es/en)

### Nivel 3 — UX/DX Upgrade

- [ ] Error de validación visible bajo cada campo con error
- [ ] Indicador de progreso visual (no solo sr-only)
- [ ] Navegación por teclado (arrows) funcional en radiogroups
- [ ] Focus se mueve automáticamente al cambiar de paso
- [ ] WCAG 2.1 AA audit pasado (axe-core o similar)
- [ ] DPIAModal integrado en flujo legal/critical

### Nivel 4 — Observabilidad y Calidad

- [ ] E2E test green en CI para flujo completo
- [ ] Coverage ≥80% en statements, branches, functions, lines
- [ ] Sentry capturando errores de producción
- [ ] Dashboard de funnel analytics operativo
- [ ] Core Web Vitals dentro de umbrales

### Nivel 5 — Producción-Grade

- [ ] Rate limiting activo con Upstash Redis
- [ ] CSRF token validado en submit
- [ ] Pentest completado sin findings críticos
- [ ] A/B testing framework operativo
- [ ] Backup/recovery verificado con drill

---

## 7. RIESGOS RESIDUALES

| Riesgo                                                 | Probabilidad        | Impacto             | Mitigación                                      |
| ------------------------------------------------------ | ------------------- | ------------------- | ----------------------------------------------- |
| Datos psicológicos en logs de CDN/proxy por URL params | Alta (activo ahora) | Alto (RGPD Art. 9)  | **Nivel 2.2** — mover a sessionStorage urgente  |
| Consent hardcodeado invalida base legal RGPD           | Alta (activo ahora) | Alto (sanción AEPD) | **Nivel 1.2** — integrar ConsentBlock inmediato |
| Bot submissions sin rate limiting                      | Media               | Medio               | **Nivel 5.1** — Upstash Redis                   |
| Single point of failure en SMTP                        | Media               | Medio               | Queue + retry mechanism                         |
| Sin E2E — regresiones silenciosas                      | Media               | Medio               | **Nivel 4.1** — Playwright E2E                  |

---

## 8. SIGUIENTES 3 ACCIONES

1. **INMEDIATA (hoy):** Integrar `ConsentBlock` en ambos formularios + corregir typo + normalizar payload. Es la corrección de compliance RGPD más urgente.

2. **ESTA SEMANA:** Mover `WizardResult` fuera de URL query params a `sessionStorage`. Datos de categoría especial (Art. 9 RGPD: salud psicológica, percepción de vigilancia) están expuestos en browser history y server logs.

3. **PRÓXIMA SPRINT:** Extraer schema Zod compartido + crear capa application en cliente + añadir loading state a Basic + integrar ContactConfirmation.

---

## ANEXO A — Mapa del Sistema (Monorepo)

```
claritystructures-webapp/
├── apps/
│   └── web/                          # Next.js 16 frontend
│       └── src/
│           ├── app/
│           │   ├── (i18n)/[lang]/    # Rutas i18n
│           │   │   └── contact/      # basic/ family/ legal/ critical/
│           │   ├── (admin)/triage/   # Dashboard admin (Bearer auth)
│           │   └── api/
│           │       ├── contact/      # POST intake submission
│           │       ├── triage/       # GET/PATCH intake management
│           │       ├── user/data/    # ARCO-POL (GET/DELETE)
│           │       └── cron/         # purge-expired, sla-breach-check
│           ├── application/
│           │   ├── di-container.ts   # DI + event subscriptions
│           │   └── use-cases/        # 9 use cases
│           ├── components/           # UI layer
│           │   └── forms/            # ContactFormBasic, Legal, Sensitive
│           └── lib/                  # Guards, auth, analytics, rate-limit
│
├── packages/
│   ├── domain/                       # Pure business logic (0 deps)
│   │   └── src/
│   │       ├── decision.ts           # V1+V2 decision engine
│   │       ├── intake-records.ts     # Domain primitives
│   │       ├── ports.ts              # Repository interfaces
│   │       ├── sla.ts                # SLA milestones
│   │       ├── retention.ts          # Data retention policy
│   │       └── transfer-packet.ts    # Legal derivation packets
│   ├── infra-notifications/          # SMTP email + alerts
│   ├── infra-persistence/            # Prisma + PostgreSQL
│   │   └── prisma/schema.prisma      # 9 models
│   ├── types/                        # Shared TypeScript types
│   └── config/                       # Environment config
│
├── tests/                            # Integration tests (node:test)
├── scripts/                          # check-secrets.sh, demo-decision
└── .github/workflows/ci.yml          # Quality gates pipeline
```

## ANEXO B — Top 10 Riesgos Priorizados

| #   | Riesgo                                      | Sev     | Prob  | Impacto                     | Evidencia                            |
| --- | ------------------------------------------- | ------- | ----- | --------------------------- | ------------------------------------ |
| 1   | WizardResult (datos Art.9 RGPD) en URL      | CRÍTICO | ALTA  | Sanción AEPD                | URL en producción verificada         |
| 2   | Consent hardcodeado sin interacción usuario | CRÍTICO | ALTA  | Nulidad base legal          | `ContactFormBasic.tsx:29`            |
| 3   | Sin consent en ContactFormLegal             | ALTO    | ALTA  | Nulidad base legal          | Ausencia verificada en DOM y código  |
| 4   | CSP bloquea fonts (UX degradada)            | MEDIO   | ALTA  | Percepción calidad          | Console error en producción          |
| 5   | Cookie banner bloquea wizard                | MEDIO   | ALTA  | Abandono usuario            | Interceptación verificada en browser |
| 6   | Sin CSRF en formulario público              | MEDIO   | MEDIA | Spam/abuse                  | `apiGuard()` sin CSRF para público   |
| 7   | Copy incorrecto en ruta /critical           | MEDIO   | ALTA  | Confusión usuario en crisis | Verificado en producción             |
| 8   | Sin E2E tests                               | MEDIO   | MEDIA | Regresiones silenciosas     | Ausencia en CI pipeline              |
| 9   | i18n no implementado (solo español)         | BAJO    | BAJA  | Limitación de mercado       | Strings hardcodeados verificados     |
| 10  | Dead code (ContactFormSensitive)            | BAJO    | BAJA  | Confusión dev               | Shell file verificado                |
