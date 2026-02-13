"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { IntakeTone, WizardResult } from "@claritystructures/domain";
import AnimatedLogo from "./AnimatedLogo";
import DPIAModal from "./DPIAModal";

/* =========================
   Types
 ========================= */

type Props = {
  tone: IntakeTone;
  context?: string;
};

type CopyBase = {
  title: string;
  hint: string;
  cta: string;
};

type CopyWithWarning = CopyBase & {
  warning: string;
};

type Copy = CopyBase | CopyWithWarning;

/* =========================
   Copy by tone
 ========================= */

const COPY_BY_TONE: Record<IntakeTone, Copy> = {
  basic: {
    title: "Consulta inicial",
    hint: "Esta evaluación es informativa. Si el caso evoluciona, podrás solicitar custodia técnica.",
    cta: "Enviar consulta",
  },

  family: {
    title: "Conflicto familiar / herencia",
    hint: "Este tipo de situaciones suelen implicar riesgos de pérdida o manipulación de pruebas.",
    warning:
      "Recomendamos no acceder ni modificar dispositivos hasta recibir asesoramiento técnico.",
    cta: "Solicitar evaluación",
  },

  legal: {
    title: "Procedimiento judicial en curso",
    hint: "Este formulario está orientado a contextos con actuaciones legales ya iniciadas.",
    warning:
      "La preservación de la cadena de custodia puede ser determinante en sede judicial.",
    cta: "Contactar equipo técnico",
  },

  critical: {
    title: "Situación crítica",
    hint: "Hemos detectado un contexto de alta sensibilidad legal o emocional.",
    warning:
      "En menos de 24h se pondrá en contacto un experto en trazado de datos forense digital penal y civil para atender el caso con máxima urgencia. Intente no cambiar configuraciones ni borrar datos de los dispositivos involucrados para no contaminar pruebas.",
    cta: "Contactar de inmediato",
  },
};

/* =========================
   Component
 ========================= */

export default function ContactForm({ tone, context }: Props) {
  const copy = COPY_BY_TONE[tone];
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(context ?? "");
  const [dpiaConsent, setDpiaConsent] = useState(false);
  const [showDpia, setShowDpia] = useState(false);
  const [wizardResult, setWizardResult] = useState<WizardResult | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        setWizardResult(JSON.parse(decodeURIComponent(data)));
      } catch (e) {
        console.error("Failed to parse wizard data", e);
      }
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dpiaConsent) {
      setError("Es obligatorio aceptar el tratado de datos sensibles (DPIA).");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          message,
          tone,
          context,
          wizardResult,
          dpiaConsent,
        }),
      });

      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="relative min-h-[600px] w-full max-w-4xl mx-auto flex items-center justify-center dark pt-20">
        <div className="absolute top-0 right-0 p-8 z-50">
          <AnimatedLogo />
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl text-center space-y-6 animate-in backdrop-blur-3xl max-w-2xl">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
          <h2 className="text-2xl font-light text-white/95 tracking-tight">
            Expediente Registrado con Éxito
          </h2>

          <div className="space-y-4 text-left border-t border-white/5 pt-6 text-white/60 font-light leading-relaxed">
            <p className="text-sm">
              Tu caso ha sido integrado en nuestro protocolo de{" "}
              <span className="text-white/90 font-medium">
                Trazado de Datos Forense Digital (Penal y Civil)
              </span>
              .
            </p>
            <p className="text-sm">
              Un experto pericial se pondrá en contacto contigo en un plazo{" "}
              <span className="text-white/90 font-medium">
                inferior a 24 horas
              </span>{" "}
              para atender el caso con la máxima urgencia.
            </p>

            <div className="p-4 bg-critical/10 border border-critical/20 rounded-2xl space-y-2">
              <p className="text-xs text-critical font-bold uppercase tracking-widest">
                Protocolo de Preservación de Pruebas:
              </p>
              <ul className="text-xs text-white/70 list-disc list-inside space-y-1">
                <li>
                  <span className="text-white font-medium">NO REINICIE</span> ni
                  cambie configuraciones en los dispositivos involucrados.
                </li>
                <li>
                  <span className="text-white font-medium">EVITE BORRAR</span>{" "}
                  datos, fotos o chats, incluso si parecen irrelevantes.
                </li>
                <li>
                  No intente realizar un trazado manual por su cuenta para{" "}
                  <span className="text-white font-medium">
                    no contaminar la cadena de custodia
                  </span>
                  .
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-4 rounded-xl text-xs font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest"
          >
            Finalizar Procedimiento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[700px] w-full max-w-4xl mx-auto pt-20">
      <div className="absolute top-0 right-0 p-8 z-50">
        <AnimatedLogo />
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass p-8 md:p-12 rounded-3xl shadow-2xl animate-in space-y-8 max-w-2xl mx-auto backdrop-blur-3xl"
      >
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <h1 className="text-xs uppercase tracking-widest text-white/40 font-semibold">
              {copy.title}
            </h1>
          </div>
          <p className="text-sm text-white/60 leading-relaxed font-light">
            {copy.hint}
          </p>

          {"warning" in copy && (
            <div className="p-4 bg-critical/10 border border-critical/20 rounded-xl">
              <p className="text-xs text-critical font-medium flex gap-2 items-center">
                <span className="w-1 h-1 rounded-full bg-critical animate-pulse"></span>
                {copy.warning}
              </p>
            </div>
          )}
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-white/30 ml-1">
                Canal de Contacto Seguro (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full p-4 bg-white/3 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-white/30 ml-1">
                Teléfono de Contacto (Cifrado)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 000 000 000"
                className="w-full p-4 bg-white/3 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-white/30 ml-1">
              Trazado Preliminar de Hechos
            </label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describa brevemente los eventos para orientar al perito forense..."
              rows={5}
              className="w-full p-4 bg-white/3 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all resize-none font-light text-sm"
            />
          </div>

          {/* DPIA / Sensitive Data Consent */}
          <div
            onClick={() => setDpiaConsent(!dpiaConsent)}
            className={`group cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
              dpiaConsent
                ? "bg-white/5 border-white/20"
                : "bg-transparent border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  dpiaConsent
                    ? "bg-white border-white"
                    : "border-white/20 group-hover:border-white/40"
                }`}
              >
                {dpiaConsent && (
                  <svg
                    className="w-3.5 h-3.5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] leading-tight text-white/80 font-medium uppercase tracking-wider">
                  Consentimiento de Tratado de Datos Sensibles (DPIA)
                </p>
                <p className="text-[10px] leading-relaxed text-white/40 font-light">
                  Acepto el procesamiento de mis datos personales de alta
                  sensibilidad bajo el protocolo de Evaluación de Impacto (DPIA)
                  de Clarity Structures, garantizando el cifrado perimetral y la
                  no cesión a terceros fuera del marco judicial.{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDpia(true);
                    }}
                    className="text-white/60 underline hover:text-white transition-colors"
                  >
                    Ver documento DPIA completo.
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-critical/80 bg-critical/5 p-3 rounded-lg border border-critical/10 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg shadow-white/5 ${
            loading
              ? "bg-white/10 text-white/20 cursor-not-allowed"
              : "bg-white text-black hover:bg-neutral-200 active:scale-[0.98]"
          }`}
        >
          {loading ? "Registrando en Sistema..." : copy.cta}
        </button>
      </form>

      <DPIAModal isOpen={showDpia} onClose={() => setShowDpia(false)} />
    </div>
  );
}
