import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | Clarity Structures",
  description:
    "Política de privacidad y protección de datos de Clarity Structures Digital S.L. conforme al RGPD y la LOPDGDD.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 pb-32">
      <Link
        href="/"
        className="text-xs text-white/40 hover:text-white/70 transition-colors mb-8 inline-block"
      >
        ← Volver al inicio
      </Link>

      <h1 className="text-4xl font-black text-white tracking-tight mb-2">
        Política de Privacidad
      </h1>
      <p className="text-sm text-white/40 mb-12">
        Última actualización: febrero 2026
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-white/70">
        {/* 1. Responsable */}
        <Section title="1. Responsable del Tratamiento">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
            <DlItem label="Razón Social">
              Clarity Structures Digital, Sociedad Limitada
            </DlItem>
            <DlItem label="CIF">B26766048</DlItem>
            <DlItem label="Domicilio social">Madrid, España</DlItem>
            <DlItem label="Contacto DPD">
              privacidad@claritystructures.com
            </DlItem>
          </dl>
        </Section>

        {/* 2. Finalidad */}
        <Section title="2. Finalidades del Tratamiento">
          <p>
            Los datos personales recabados a través de esta plataforma se tratan
            con las siguientes finalidades:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
            <li>
              Gestionar las solicitudes de peritaje informático forense
              recibidas a través del formulario de contacto.
            </li>
            <li>
              Realizar el triage y clasificación de prioridad de los casos
              entrantes.
            </li>
            <li>Comunicarnos con usted en relación con su consulta.</li>
            <li>
              Analizar el uso de la plataforma con herramientas de analítica
              (solo con consentimiento previo).
            </li>
            <li>
              Cumplir con obligaciones legales derivadas de la actividad
              pericial.
            </li>
          </ul>
        </Section>

        {/* 3. Base legal */}
        <Section title="3. Base Legal del Tratamiento">
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong className="text-white/80">Consentimiento</strong> (art.
              6.1.a RGPD) — para el envío del formulario de contacto y cookies
              analíticas.
            </li>
            <li>
              <strong className="text-white/80">Interés legítimo</strong> (art.
              6.1.f RGPD) — para la seguridad de la plataforma y prevención de
              fraude.
            </li>
            <li>
              <strong className="text-white/80">Obligación legal</strong> (art.
              6.1.c RGPD) — para el cumplimiento de requerimientos judiciales en
              materia pericial.
            </li>
          </ul>
        </Section>

        {/* 4. Datos recogidos */}
        <Section title="4. Datos Personales Recogidos">
          <p>Los datos personales que podemos recopilar incluyen:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
            <li>Nombre y apellidos.</li>
            <li>Dirección de correo electrónico.</li>
            <li>Número de teléfono (opcional).</li>
            <li>Descripción de la consulta o caso.</li>
            <li>
              Datos de navegación (IP anonimizada, tipo de dispositivo) — solo
              con consentimiento analítico.
            </li>
          </ul>
        </Section>

        {/* 5. Cookies */}
        <Section title="5. Política de Cookies">
          <p>
            Esta plataforma utiliza cookies técnicas necesarias para su
            funcionamiento. Las cookies analíticas (PostHog) solo se activan si
            usted otorga su consentimiento a través del banner de cookies. Puede
            modificar sus preferencias en cualquier momento recargando la
            página.
          </p>
          <div className="mt-4 bg-white/5 p-5 rounded-2xl border border-white/5">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/40 uppercase tracking-wider">
                  <th className="text-left pb-3">Tipo</th>
                  <th className="text-left pb-3">Finalidad</th>
                  <th className="text-left pb-3">Base legal</th>
                </tr>
              </thead>
              <tbody className="text-white/60">
                <tr className="border-t border-white/5">
                  <td className="py-2">Técnicas</td>
                  <td className="py-2">Seguridad, CSRF, sesión</td>
                  <td className="py-2">Interés legítimo</td>
                </tr>
                <tr className="border-t border-white/5">
                  <td className="py-2">Analíticas</td>
                  <td className="py-2">Análisis de uso (PostHog)</td>
                  <td className="py-2">Consentimiento</td>
                </tr>
                <tr className="border-t border-white/5">
                  <td className="py-2">Marketing</td>
                  <td className="py-2">No utilizadas actualmente</td>
                  <td className="py-2">Consentimiento</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 6. Conservación */}
        <Section title="6. Plazo de Conservación">
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              Datos de contacto y consultas: 3 años desde la última interacción,
              salvo obligación legal superior.
            </li>
            <li>
              Datos de triage y peritaje: según los plazos de prescripción
              aplicables a la actividad forense (mínimo 5 años).
            </li>
            <li>
              Datos analíticos: anonimizados; los datos brutos se eliminan tras
              90 días.
            </li>
          </ul>
        </Section>

        {/* 7. Derechos ARCO-POL */}
        <Section title="7. Derechos de los Interesados (ARCO-POL)">
          <p>Conforme al RGPD y la LOPDGDD, usted tiene derecho a:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
            <li>
              <strong className="text-white/80">Acceso</strong> — solicitar una
              copia de sus datos personales.
            </li>
            <li>
              <strong className="text-white/80">Rectificación</strong> —
              corregir datos inexactos o incompletos.
            </li>
            <li>
              <strong className="text-white/80">Cancelación/Supresión</strong> —
              solicitar la eliminación de sus datos.
            </li>
            <li>
              <strong className="text-white/80">Oposición</strong> — oponerse al
              tratamiento de sus datos.
            </li>
            <li>
              <strong className="text-white/80">Portabilidad</strong> — recibir
              sus datos en formato estructurado.
            </li>
            <li>
              <strong className="text-white/80">Limitación</strong> — solicitar
              la restricción del tratamiento.
            </li>
          </ul>
          <p className="mt-4">
            Para ejercer cualquiera de estos derechos, envíe un correo
            electrónico a{" "}
            <a
              href="mailto:privacidad@claritystructures.com"
              className="underline text-white/80 hover:text-white"
            >
              privacidad@claritystructures.com
            </a>{" "}
            adjuntando una copia de su documento de identidad.
          </p>
          <p className="mt-2">
            Si considera que sus derechos no han sido debidamente atendidos,
            puede presentar una reclamación ante la{" "}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white/80 hover:text-white"
            >
              Agencia Española de Protección de Datos (AEPD)
            </a>
            .
          </p>
        </Section>

        {/* 8. Transferencias internacionales */}
        <Section title="8. Transferencias Internacionales">
          <p>
            Los datos se almacenan en servidores dentro de la Unión Europea
            (Supabase, región eu-central-1). Las herramientas de analítica
            (PostHog) operan bajo las cláusulas contractuales tipo de la
            Comisión Europea. No se realizan transferencias a terceros países
            sin las garantías adecuadas del RGPD.
          </p>
        </Section>

        {/* 9. Seguridad */}
        <Section title="9. Medidas de Seguridad">
          <p>
            Implementamos medidas técnicas y organizativas para proteger sus
            datos, incluyendo:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
            <li>Cifrado TLS en todas las comunicaciones.</li>
            <li>
              Protección CSP (Content Security Policy) con nonces dinámicos.
            </li>
            <li>
              Protección CSRF (Cross-Site Request Forgery) en formularios.
            </li>
            <li>Sanitización de entradas (DOMPurify) contra ataques XSS.</li>
            <li>Rate limiting para prevención de abuso.</li>
            <li>Autenticación por token para endpoints administrativos.</li>
          </ul>
        </Section>

        {/* 10. Actualización */}
        <Section title="10. Modificaciones de esta Política">
          <p>
            Nos reservamos el derecho de actualizar esta política para adaptarla
            a novedades legislativas o cambios en nuestros procesos. La fecha de
            última actualización se indicará siempre al inicio de esta página.
            Le recomendamos revisarla periódicamente.
          </p>
        </Section>

        {/* Footer normativo */}
        <div className="pt-8 border-t border-white/5 text-xs text-white/30">
          <p>
            Regulación aplicable: Reglamento (UE) 2016/679 (RGPD) · Ley Orgánica
            3/2018 (LOPDGDD) · Ley 34/2002 (LSSI-CE)
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} Clarity Structures Digital S.L. — CIF
            B26766048
          </p>
        </div>
      </div>
    </main>
  );
}

/* ── Helper components ─────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-white/90 font-medium uppercase tracking-widest text-xs flex items-center gap-3">
        <span className="w-1 h-4 bg-white/20 rounded-full" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function DlItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-[10px] uppercase text-white/30 tracking-wider">
        {label}
      </dt>
      <dd className="text-white/80">{children}</dd>
    </div>
  );
}
