import { useLang } from "@/context/LanguageContext";

export function useTranslation() {
  const { t, lang, setLang } = useLang();
  return { t, lang, setLang };
}