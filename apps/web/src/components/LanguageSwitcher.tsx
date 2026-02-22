"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/LanguageProvider";

export default function LanguageSwitcher() {
  const lang = useLang();
  const pathname = usePathname();

  const targetLang = lang === "es" ? "en" : "es";
  const targetPath = pathname.replace(`/${lang}`, `/${targetLang}`);

  return (
    <Link
      href={targetPath}
      className="text-xs text-white/40 hover:text-white/80 transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
      aria-label={
        targetLang === "en" ? "Switch to English" : "Cambiar a Español"
      }
    >
      {targetLang === "en" ? "EN" : "ES"}
    </Link>
  );
}
