"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

export type Lang = "es" | "en";

const LanguageContext = createContext<Lang>("es");

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang: Lang = pathname.startsWith("/en") ? "en" : "es";

  return (
    <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>
  );
}

export function useLang(): Lang {
  return useContext(LanguageContext);
}
