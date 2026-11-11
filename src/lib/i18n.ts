import { en } from "@/dictionaries/en";
import { ar } from "@/dictionaries/ar";
import { zh } from "@/dictionaries/zh";

import { locales, type Locale } from "@/lib/i18n-config";

export { locales, defaultLocale, type Locale } from "@/lib/i18n-config";

export type Dict = typeof en;

const dictionaries: Record<Locale, Dict> = { en, ar, zh };

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const getDict = (locale: Locale): Dict => dictionaries[locale];

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

export const htmlLang: Record<Locale, string> = {
  en: "en",
  ar: "ar",
  zh: "zh-Hans",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  zh: "中文",
};

/** Look up a translated option label, falling back to the raw key. */
export function label(map: Record<string, string>, key: string | null | undefined) {
  if (!key) return "";
  return map[key] ?? key;
}
