# Prompts para Claude Code — claritystructures-webapp

## Nivel 1 (Estabilización) + Nivel 2 (Refactor Arquitectural)

> **USO:** Copia y pega cada prompt en orden en tu terminal Claude Code.
> Después de cada prompt, verifica el output antes de continuar al siguiente.
> Los prompts son idempotentes — si ya ejecutaste alguno, Claude Code detectará que el cambio ya existe.

---

## PRE-REQUISITO: Contexto del Repo

Pega esto UNA SOLA VEZ al inicio de la sesión para dar contexto a Claude Code:

```
Estoy trabajando en claritystructures-webapp, un monorepo Next.js 16 + TypeScript con arquitectura hexagonal. Estructura:
- apps/web/src/components/ — UI (Wizard.tsx, ContactForm.tsx, forms/ContactFormBasic.tsx, forms/ContactFormLegal.tsx, ConsentBlock.tsx, ContactConfirmation.tsx, CookieConsent.tsx)
- apps/web/src/app/api/contact/route.ts — API route con Zod validation
- apps/web/src/proxy.ts — CSP, CORS, rate limiting (reemplaza middleware.ts en Next 16)
- packages/domain/ — lógica pura (decision engine, ports, SLA, retention)
- packages/types/src/validations/contact-intake.schema.ts — Schema Zod compartido (ContactIntakeSchema, WizardResultSchema)
- packages/infra-persistence/ — Prisma + PostgreSQL
- packages/infra-notifications/ — SMTP
- Tests: vitest + @testing-library/react. Ejecutar: pnpm test && npx tsc --noEmit

NO hagas commits. Solo edita archivos. Yo haré commit manualmente.
```

---

## NIVEL 1 — ESTABILIZACIÓN (9 fixes, sin breaking changes)

### PROMPT 1.1 — Fix typo NARREACIÓN

```
En apps/web/src/components/Wizard.tsx, busca el texto "NARREACIÓN CLARA" y corrígelo a "NARRACIÓN CLARA". Es un typo en un botón de radiogroup. Solo cambia esa cadena exacta, nada más.
```

### PROMPT 1.2 — Integrar ConsentBlock en ambos formularios

```
Los formularios ContactFormBasic.tsx y ContactFormLegal.tsx NO usan el componente ConsentBlock que ya existe en apps/web/src/components/ConsentBlock.tsx. Necesito que:

1. En ContactFormBasic.tsx:
   - Importa ConsentBlock desde "../ConsentBlock"
   - Añade estado: const [consent, setConsent] = useState(false)
   - Renderiza <ConsentBlock tone={tone} checked={consent} onChange={setConsent} /> antes del botón submit
   - Deshabilita el botón submit si !consent: disabled={loading || !consent}
   - Incluye consent y consentVersion: "v1" en el payload del fetch

2. En ContactFormLegal.tsx:
   - Misma integración: importar ConsentBlock, estado consent, renderizar antes del botón, deshabilitar si !consent
   - Incluye consent y consentVersion: "v1" en el payload del fetch

ConsentBlock acepta props: { tone: string; checked: boolean; onChange: (v: boolean) => void }

No modifiques ConsentBlock.tsx en sí, solo intégralo en los formularios.
```

### PROMPT 1.3 — Loading state en ContactFormBasic

```
ContactFormBasic.tsx no tiene loading state durante el submit. ContactFormLegal.tsx sí lo tiene. Necesito que ContactFormBasic.tsx tenga:

1. Estado: const [loading, setLoading] = useState(false)
2. En handleSubmit: setLoading(true) al inicio, setLoading(false) en finally
3. El botón submit debe tener: aria-busy={loading}, disabled={loading || !consent}
4. Texto del botón: loading ? "Enviando..." : "Enviar consulta"
5. Los inputs (email, textarea) deben tener disabled={loading}

Replica el mismo patrón que ya usa ContactFormLegal.tsx.
```

### PROMPT 1.4 — Integrar ContactConfirmation post-submit

```
El componente ContactConfirmation.tsx ya existe en apps/web/src/components/ContactConfirmation.tsx con mensajes por tono, pero NO se usa en ningún formulario. Los formularios solo muestran texto inline tras submit.

En ContactFormBasic.tsx y ContactFormLegal.tsx:
1. Importa ContactConfirmation desde "../ContactConfirmation"
2. Añade estado: const [sent, setSent] = useState(false)
3. Cuando el fetch retorna ok, haz setSent(true)
4. Al inicio del render: if (sent) return <ContactConfirmation tone={tone} />;

ContactConfirmation acepta prop: { tone: string }
```

### PROMPT 1.5 — Fix CSP para Google Fonts

```
En apps/web/src/proxy.ts, la Content Security Policy bloquea Google Fonts. En la directiva style-src, añade https://fonts.googleapis.com. En la directiva font-src, añade https://fonts.gstatic.com.

Busca las líneas donde se definen style-src y font-src en el template literal del CSP y añade los dominios. No toques otras directivas.
```

### PROMPT 1.6 — Fix cookie banner z-index

```
En apps/web/src/components/CookieConsent.tsx, el cookie banner tiene un z-index alto que intercepta clicks en el wizard incluso cuando el banner está en la parte inferior de la pantalla.

Solución: En el div contenedor externo del banner, añade la clase pointer-events-none. En el div interno del banner (el que contiene el contenido real: textos y botones), añade pointer-events-auto. Esto permite que los clicks pasen a través de las áreas vacías del contenedor pero mantengan la interactividad del banner.

También cambia z-10000 (o cualquier z-index elevado) a z-100.
```

### PROMPT 1.7 — Adaptar copy para ruta /critical

```
ContactFormLegal.tsx se usa tanto para /contact/legal como para /contact/critical, pero muestra el mismo texto "Canal orientado a profesionales legales" en ambos casos. Necesito:

1. Que ContactFormLegal.tsx acepte un prop tone?: "legal" | "critical" (default "legal")
2. Crea un objeto DESCRIPTION_COPY con textos por tono:
   - legal: "Canal orientado a profesionales legales que requieren soporte técnico y trazabilidad digital."
   - critical: "Situación clasificada como crítica. Tu solicitud será tratada con máxima prioridad y urgencia."
3. Usa DESCRIPTION_COPY[tone] para renderizar la descripción
4. Para critical, cambia el aria-label del form a "Formulario de situación crítica"
5. En ContactForm.tsx (el router), pasa tone={tone} a ContactFormLegal donde tone viene de la ruta

No crees un archivo nuevo ContactFormCritical. Reutiliza ContactFormLegal con el prop tone.
```

### PROMPT 1.8 — trackEvent en submit/error de formularios

```
Los formularios ContactFormBasic.tsx y ContactFormLegal.tsx no trackean eventos de submit. El Wizard sí usa trackEvent. Añade en AMBOS formularios:

1. Importa trackEvent desde "@/lib/analytics"
2. Al inicio de handleSubmit (antes del fetch): trackEvent({ name: "contact.submit_attempt", timestamp: Date.now(), payload: { tone } })
3. Tras fetch exitoso (res.ok): trackEvent({ name: "contact.submit_success", timestamp: Date.now(), payload: { tone } })
4. En el catch de error: trackEvent({ name: "contact.submit_error", timestamp: Date.now(), payload: { tone, error: errorMessage } })

trackEvent acepta: { name: string; timestamp: number; payload: Record<string, unknown> }
```

### PROMPT 1.9 — Normalizar payload entre Basic y Legal

```
ContactFormBasic.tsx envía el payload como {...context, consent: true} (spread directo del wizardResult). ContactFormLegal.tsx envía {wizardResult: context, ...}. Deben ser consistentes.

En ContactFormBasic.tsx, cambia el body del fetch para que envíe:
{
  email,
  message,
  tone,
  wizardResult: context,
  consent,
  consentVersion: "v1"
}

En ContactFormLegal.tsx, verifica que envía:
{
  email,
  phone,
  message,
  tone,
  wizardResult: context,
  consent,
  consentVersion: "v1"
}

Ambos deben enviar wizardResult como campo separado, no spreadear el context.
```

### PROMPT 1.10 — Actualizar tests de Nivel 1

```
Los tests de ContactFormBasic y ContactFormLegal necesitan actualizarse para reflejar los cambios de Nivel 1. En ambos archivos de test:

apps/web/src/__tests__/components/forms/ContactFormBasic.test.tsx:
- Mock ConsentBlock: vi.mock("@/components/ConsentBlock", () => ({ default: ({ checked, onChange }) => <label data-testid="consent-block"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} data-testid="consent-checkbox" />Consent</label> }))
- Mock ContactConfirmation: vi.mock("@/components/ContactConfirmation", () => ({ default: ({ tone }) => <div data-testid="confirmation">Consulta recibida ({tone})</div> }))
- Mock analytics: vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }))
- Añade test: "should disable submit button when consent is not checked"
- Ajusta test de payload: verifica que envía { wizardResult: context, consent: true, consentVersion: "v1" }
- Añade test: "should show ContactConfirmation after successful submission"
- Añade test: "should show loading state during submission"

apps/web/src/__tests__/components/forms/ContactFormLegal.test.tsx:
- Mismos mocks que BasicForm
- Añade test: "should show critical aria-label when tone is critical"
- Ajusta test de payload para incluir consent y consentVersion
- Añade test: "should disable submit when consent not checked"

El mockContext para ambos debe tener la shape completa de WizardResult:
{ clientProfile: "private_individual", urgency: "time_sensitive", incident: "Suspicious email received", devices: 1, actionsTaken: [], evidenceSources: [], objective: "contact" }
```

### PROMPT 1.11 — Fix error pre-existente en contact-route.test.ts

```
El archivo apps/web/src/__tests__/api/contact-route.test.ts tiene dos errores de TypeScript pre-existentes:

1. Falta import de vitest: Añade en la primera línea: import { describe, it, expect } from "vitest";

2. `delete body.consent` y `delete body.consentVersion` causan TS2790 porque las propiedades son requeridas en el tipo inferido del spread. Reemplaza:
   - `const body = { ...VALID_BODY }; delete body.consent;` → `const { consent: _, ...body } = VALID_BODY;`
   - `const body = { ...VALID_BODY }; delete body.consentVersion;` → `const { consentVersion: _, ...body } = VALID_BODY;`

No cambies la lógica de los tests, solo arregla los imports y el pattern de destructuring.
```

### VERIFICACIÓN NIVEL 1

```
Ejecuta pnpm test && npx tsc --noEmit y muéstrame el resultado. Esperado: todos los tests passing, 0 errores TypeScript.
```

---

## NIVEL 2 — REFACTOR ARQUITECTURAL

### PROMPT 2.1 — Route.ts: usar schema compartido

```
El archivo apps/web/src/app/api/contact/route.ts define un schema Zod inline (WizardResultSchema + ContactSchema) que DUPLICA lo que ya existe en packages/types/src/validations/contact-intake.schema.ts como ContactIntakeSchema.

Reescribe route.ts para:
1. Eliminar las definiciones inline de WizardResultSchema, ContactSchema, y CONSENT_VERSION
2. Importar ContactIntakeSchema desde "@claritystructures/types"
3. Usar ContactIntakeSchema.safeParse(body) para validar
4. En caso de error, devolver los fieldErrors: { error: "Invalid request", details: parse.error.flatten().fieldErrors }
5. Añadir check de honeypot: if (parse.data.website) return 400
6. Mantener el try/catch con 500 para errores de servidor

El archivo resultante debe tener solo ~35 líneas.
```

### PROMPT 2.2 — Actualizar tests de contact-route para schema compartido

```
El test apps/web/src/__tests__/api/contact-route.test.ts necesita actualizarse porque route.ts ahora usa ContactIntakeSchema (más estricto que el inline). El VALID_BODY necesita un wizardResult completo con todos los campos requeridos.

Reescribe el test con:
- VALID_BODY con wizardResult completo: { clientProfile: "private_individual", urgency: "time_sensitive", incident: "Data breach suspected", devices: 1, actionsTaken: [], evidenceSources: [], objective: "contact" }
- message de al menos 10 caracteres (el schema tiene .min(10))
- Tests: valid request → 200, consent missing → 400, consent false → 400, invalid email → 400, message too short → 400, honeypot filled → 400, sin consentVersion → 200 (tiene default "v1")
- Usa destructuring para omitir campos: const { consent: _, ...body } = VALID_BODY
- createRequest acepta body: unknown (no any)
```

### PROMPT 2.3 — Eliminar dead code: ContactFormSensitive

```
El archivo apps/web/src/components/forms/ContactFormSensitive.tsx es dead code — solo re-exporta mapWizardToSignals del dominio. Ningún componente lo importa (solo su propio test).

Elimina:
1. apps/web/src/components/forms/ContactFormSensitive.tsx
2. apps/web/src/__tests__/components/forms/ContactFormSensitive.test.ts

Verifica que ningún otro archivo importa de ContactFormSensitive con grep.
```

### PROMPT 2.4 — Validación client-side con Zod compartido

```
Los formularios ContactFormBasic.tsx y ContactFormLegal.tsx envían datos al servidor sin validar en cliente. El schema ContactIntakeSchema ya existe en @claritystructures/types. Necesito:

En AMBOS formularios:
1. Importar ContactIntakeSchema desde "@claritystructures/types"
2. Añadir estado: const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
3. Crear función validateLocally() que:
   - Construye el payload como objeto
   - Llama ContactIntakeSchema.safeParse(payload)
   - Si falla: extrae flatten().fieldErrors, mapea el primer error de cada campo a fieldErrors, return null
   - Si pasa: setFieldErrors({}), return result.data
4. En handleSubmit: llamar validateLocally() ANTES del fetch. Si retorna null, no hacer fetch.
5. Enviar JSON.stringify(validated) al fetch (datos ya procesados por Zod)
6. En cada input, añadir:
   - aria-invalid={!!fieldErrors.fieldName}
   - aria-describedby={fieldErrors.fieldName ? "id-error" : undefined}
   - onChange que limpia el error del campo al escribir
7. Renderizar <p> con el error debajo de cada input cuando existe
8. Añadir noValidate al <form> para dejar que Zod maneje la validación
9. Actualizar tests: añadir tests "should not call fetch when client-side validation fails (short message)" y "(invalid email)"
10. Ajustar tests de payload existentes para usar expect.objectContaining en vez de exact match (Zod transforma los datos)
```

### VERIFICACIÓN NIVEL 2

```
Ejecuta pnpm test && npx tsc --noEmit y muéstrame el resultado completo. Esperado: ~615 tests passing (2 menos de ContactFormSensitive + nuevos tests de validación), 0 errores TypeScript.
```

---

## VERIFICACIÓN FINAL COMBINADA

```
Ejecuta en orden:
1. npx tsc --noEmit
2. pnpm test
3. Muéstrame: número de test files, tests passed, tests failed, errores TypeScript

Luego haz un resumen de todos los archivos modificados en esta sesión.
```
