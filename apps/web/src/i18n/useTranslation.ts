import { useLang, type Lang } from "@/components/LanguageProvider";

type Dict<K extends string> = Record<Lang, Record<K, string>>;

export function useTranslation<K extends string>(dict: Dict<K>) {
  const lang = useLang();
  return function t(key: K): string {
    return dict[lang][key];
  };
}
