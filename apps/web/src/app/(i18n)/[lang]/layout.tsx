import { LanguageProvider } from '@/components/LanguageProvider';

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
