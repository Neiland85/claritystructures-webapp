"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getConsent,
  setConsent,
  DEFAULT_CONSENT,
  type ConsentSettings,
} from "@/lib/consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = getConsent();
    if (!stored) {
      setShow(true);
    } else {
      setSettings(stored);
    }
  }, []);

  const savePreferences = (newSettings: ConsentSettings) => {
    setConsent(newSettings); // Persists + dispatches custom event
    setSettings(newSettings);
    setShow(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ necessary: true, analytical: true, marketing: true });
  };

  const handleRejectAll = () => {
    savePreferences({ necessary: true, analytical: false, marketing: false });
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-10000 animate-in">
      <div className="glass max-w-4xl mx-auto p-6 md:p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10">
        {!showConfig ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-white/90">
                Privacidad y Transparencia (RGPD)
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Utilizamos cookies propias y de terceros para asegurar el
                funcionamiento de la plataforma forense, analizar el tráfico y
                mejorar tu experiencia según la normativa AEPD. Puedes aceptar
                todas, rechazarlas o configurar tus preferencias.{" "}
                <Link
                  href="/privacy"
                  className="underline text-white/70 hover:text-white transition-colors"
                >
                  Política de Privacidad
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={() => setShowConfig(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 transition-all"
              >
                Configurar
              </button>
              <button
                onClick={handleRejectAll}
                className="px-5 py-2.5 rounded-xl text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 transition-all"
              >
                Rechazar no esenciales
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-8 py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-all shadow-lg shadow-white/5"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in">
            <header className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-semibold text-white/90">
                Configuración de Cookies
              </h3>
              <button
                onClick={() => setShowConfig(false)}
                className="text-white/40 hover:text-white"
              >
                &times;
              </button>
            </header>

            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-sm font-medium text-white/80">
                    Técnicas y Necesarias
                  </h4>
                  <p className="text-[11px] text-white/40 mt-1">
                    Esenciales para el triage forense y la seguridad de la
                    sesión. (Siempre activas)
                  </p>
                </div>
                <div className="w-10 h-6 bg-white/20 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white/40 rounded-full translate-x-4"></div>
                </div>
              </div>

              {/* Analytical */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-sm font-medium text-white/80">
                    Analíticas
                  </h4>
                  <p className="text-[11px] text-white/40 mt-1">
                    Nos permiten entender el uso de la plataforma para mejorar
                    el motor de decisión.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings((s) => ({ ...s, analytical: !s.analytical }))
                  }
                  className={`w-10 h-6 rounded-full flex items-center px-1 transition-all ${settings.analytical ? "bg-white" : "bg-white/10"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all ${settings.analytical ? "bg-black translate-x-4" : "bg-white/40"}`}
                  ></div>
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-sm font-medium text-white/80">
                    Marketing y Personalización
                  </h4>
                  <p className="text-[11px] text-white/40 mt-1">
                    Utilizadas para personalizar la comunicación y medir
                    campañas de captación legal.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings((s) => ({ ...s, marketing: !s.marketing }))
                  }
                  className={`w-10 h-6 rounded-full flex items-center px-1 transition-all ${settings.marketing ? "bg-white" : "bg-white/10"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all ${settings.marketing ? "bg-black translate-x-4" : "bg-white/40"}`}
                  ></div>
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-3 rounded-xl text-xs border border-white/10 text-white/60"
              >
                Volver
              </button>
              <button
                onClick={() => savePreferences(settings)}
                className="flex-2 py-3 rounded-xl bg-white text-black font-bold"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
