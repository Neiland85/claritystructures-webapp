"use client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DPIAModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10001 flex items-center justify-center p-4 md:p-6 animate-in">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10">
        {/* Header */}
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
          <div>
            <h2 className="text-xl font-light tracking-tight text-white/90">
              Evaluación de Impacto en Protección de Datos (DPIA)
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">
              Documento de Cumplimiento Normativo v2.0 - Clarity Structures
              Digital S.L.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 text-sm leading-relaxed font-light text-white/70">
          <section className="space-y-4">
            <h3 className="text-white/90 font-medium uppercase tracking-widest text-xs flex items-center gap-3">
              <span className="w-1 h-4 bg-white/20 rounded-full"></span>
              1. Identificación del Responsable del Tratamiento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/2 p-6 rounded-2xl border border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-white/30 tracking-wider">
                  Razón Social
                </p>
                <p className="text-white/80">
                  CLARITY STRUCTURES DIGITAL, SOCIEDAD LIMITADA
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-white/30 tracking-wider">
                  Forma jurídica
                </p>
                <p className="text-white/80">
                  Sociedad de Responsabilidad Limitada
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-white/30 tracking-wider">
                  CIF
                </p>
                <p className="text-white/80 font-mono tracking-tighter">
                  B26766048
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-white/30 tracking-wider">
                  Domicilio social
                </p>
                <p className="text-white/80">Madrid, España</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-white/30 tracking-wider">
                  Ámbito territorial
                </p>
                <p className="text-white/80">Unión Europea</p>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Marco normativo aplicable:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Reglamento (UE) 2016/679 (RGPD)</li>
                <li>Ley Orgánica 3/2018 (LOPDGDD)</li>
                <li>
                  Normativa procesal española en materia probatoria digital
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-white/90 font-medium uppercase tracking-widest text-xs flex items-center gap-3">
              <span className="w-1 h-4 bg-white/20 rounded-full"></span>
              2. Descripción del Tratamiento
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-white/60 text-xs font-medium mb-3 uppercase tracking-tighter">
                  2.1 Naturaleza del tratamiento
                </h4>
                <p>
                  Tratamiento de datos personales de alta sensibilidad en el
                  contexto de: Peritaje digital forense, trazabilidad probatoria
                  e incidentes tecnológicos con implicación penal o civil.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white/60 text-xs font-medium mb-3 uppercase tracking-tighter">
                    2.2 Categorías de datos tratados
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex gap-2">
                      <span>•</span> Datos identificativos (nombre, email,
                      teléfono)
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Datos narrativos de hechos delictivos
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Evidencias digitales (metadatos, trazas
                      técnicas)
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Datos sensibles según art. 9 RGPD
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white/60 text-xs font-medium mb-3 uppercase tracking-tighter">
                    2.3 Categorías de interesados
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex gap-2">
                      <span>•</span> Personas físicas afectadas por incidentes
                      digitales
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Víctimas de delitos tecnológicos
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Representantes legales
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-white/90 font-medium uppercase tracking-widest text-xs flex items-center gap-3">
              <span className="w-1 h-4 bg-white/20 rounded-full"></span>
              3. Necesidad y Proporcionalidad
            </h3>
            <div className="space-y-4">
              <p>
                El tratamiento es indispensable para la evaluación técnica
                preliminar, determinación de viabilidad pericial y preservación
                de pruebas digitales ante procesos judiciales.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-widest">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  Art. 6.1.b RGPD – Contrato
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  Art. 6.1.f RGPD – Interés Legítimo
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/20 text-white rounded-full">
                  Art. 9.2.f RGPD – Defensa Legal
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-white/90 font-medium uppercase tracking-widest text-xs flex items-center gap-3">
              <span className="w-1 h-4 bg-white/20 rounded-full"></span>
              4. Evaluación de Alto Riesgo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                ☑ Tratamiento de datos sensibles
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                ☑ Evaluación sistemática de personas
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                ☑ Tratamiento en contexto vulnerable
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                ☑ Potencial impacto jurídico
              </div>
            </div>
            <p className="text-xs font-bold text-white/40 italic">
              Conclusión: Procede DPIA formal obligatoria (AEPD/WP248).
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white/90 font-medium uppercase tracking-widest text-xs flex items-center gap-3">
              <span className="w-1 h-4 bg-white/20 rounded-full"></span>
              5. Análisis y Control de Riesgos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-tighter">
                  5.1 Riesgos identificados
                </h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex gap-2">
                    <span>❌</span> Acceso no autorizado
                  </li>
                  <li className="flex gap-2">
                    <span>❌</span> Contaminación de evidencias
                  </li>
                  <li className="flex gap-2">
                    <span>❌</span> Filtración de información judicial
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-tighter">
                  6. Medidas técnicas
                </h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex gap-2">
                    <span>✅</span> Cifrado AES-256 en reposo / TLS 1.3
                  </li>
                  <li className="flex gap-2">
                    <span>✅</span> Auditoría Inmutable Log-based
                  </li>
                  <li className="flex gap-2">
                    <span>✅</span> Arquitectura de capas segregadas
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-white/90 font-medium uppercase tracking-widest text-xs flex items-center gap-3">
              <span className="w-1 h-4 bg-white/20 rounded-full"></span>
              7-9. Seguridad y Derechos
            </h3>
            <p>
              No se prevén transferencias fuera del EEE. Se garantiza el
              ejercicio de derechos ARCO-POL. Tras el análisis, el riesgo
              residual se considera BAJO mediante la implementación de medidas
              proactivas (art. 25 y 32 RGPD).
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white/90 font-medium uppercase tracking-widest text-xs flex items-center gap-3">
              <span className="w-1 h-4 bg-white/20 rounded-full"></span>
              11. Nivel de Gobernanza Digital
            </h3>
            <div className="bg-white/2 p-6 rounded-2xl border border-white/5 space-y-4 text-center">
              <p className="text-xs text-white/80">
                Modelo alineado con principios de ICANN ALAC: Transparencia
                estructural, separación de capas decisionales y trazabilidad
                verificable.
              </p>
            </div>
          </section>

          <footer className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs font-bold text-white/90 uppercase tracking-widest">
                Nivel de Cumplimiento: EUROPEO ALTO
              </p>
              <p className="text-[10px] text-white/30 lowercase mt-1">
                Sujeto a auditoría continua por Clarity Structures SLU.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Responsable
              </p>
              <p className="text-xs text-white font-medium mt-1 uppercase">
                Clarity Structures Digital S.L.
              </p>
            </div>
          </footer>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-white/5 bg-white/2 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all text-xs uppercase tracking-widest"
          >
            Cerrar e Identificar
          </button>
        </div>
      </div>
    </div>
  );
}
