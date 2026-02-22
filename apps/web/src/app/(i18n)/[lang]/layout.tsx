import { LanguageProvider } from "@/components/LanguageProvider";
import HtmlLangSync from "@/components/HtmlLangSync";

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <HtmlLangSync />
      {children}
    </LanguageProvider>
  );
}
