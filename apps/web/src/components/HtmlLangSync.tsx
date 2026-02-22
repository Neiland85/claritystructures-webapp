"use client";

import { useEffect } from "react";
import { useLang } from "@/components/LanguageProvider";

export default function HtmlLangSync() {
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
