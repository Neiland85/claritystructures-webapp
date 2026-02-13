# Procedimiento de Blindaje de Infraestructura y Cumplimiento

**Nivel de Exigencia:** ICANN / ALAC / RGPD (AEPD España)

## 1. Cumplimiento Normativo (RGPD / LOPDGDD)

Se ha implementado un banner de consentimiento de cookies dinámico en `CookieConsent.tsx` que cumple con:

- **Transparencia Total:** Información clara sobre la finalidad de las cookies.
- **Granularidad:** El usuario puede elegir entre cookies Necesarias, Analíticas y de Marketing.
- **Acción Positiva:** No se cargan cookies no esenciales sin el "Aceptar todas" o configuración explícita.
- **Rechazo Sencillo:** Botón de "Rechazar no esenciales" al mismo nivel que "Aceptar".

## 1.1 Evaluación de Impacto (DPIA) de Datos Sensibles

Para el tratamiento de datos forenses y periciales de alta sensibilidad, se ha implementado un flujo de consentimiento explícito blindado:

- **Protocolo DPIA Activo:** Todo lead capture requiere la aceptación de una Evaluación de Impacto de Protección de Datos.
- **Cifrado de Punto a Punto:** El número de teléfono y email se tratan bajo protocolos de cifrado asimétrico.
- **No Persistencia Innecesaria:** Los datos solo se mantienen durante el ciclo de vida del peritaje judicial o extrajudicial.

## 2. Protección de Cabeceras (Shield - Helmet Logic)

Se han blindado las cabeceras HTTP mediante `next.config.ts` y el middleware `api-guard.ts`:

- **Content Security Policy (CSP):** Restringe la carga de scripts, estilos e imágenes a fuentes de confianza.
- **HSTS (Strict-Transport-Security):** Obliga el uso de HTTPS durante 2 años, incluyendo subdominios.
- **X-Frame-Options (SAMEORIGIN):** Previene ataques de Clickjacking.
- **X-Content-Type-Options (nosniff):** Evita el sniffing de tipos MIME.
- **Referrer-Policy:** Protege la privacidad del usuario al navegar fuera de la plataforma.

## 3. Control de Acceso y CORS

Implementado mediante el utilitario `apiGuard`:

- **Whitelisting de Orígenes:** Solo se permiten peticiones desde el dominio oficial.
- **Validación de Métodos:** Restricción estricta en endpoints de entrada de datos (Lead Capture).

## 4. Auditoría de Seguridad Forense

Todas las peticiones a la API pasan por el `apiGuard` que asegura que las respuestas viajen con el blindaje activado.

---

**Clarity Structures SLU**
_Infraestructura Blindada v1.0_
