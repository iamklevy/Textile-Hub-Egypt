import type { Locale } from "@/lib/i18n";
import type { Company } from "@/lib/types";

const intlLocale: Record<Locale, string> = {
  en: "en-US",
  // Latin digits keep prices and phone numbers easy to read and copy.
  ar: "ar-EG-u-nu-latn",
  zh: "zh-CN",
};

export const formatNumber = (n: number, locale: Locale) =>
  new Intl.NumberFormat(intlLocale[locale]).format(n);

export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(intlLocale[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Africa/Cairo",
  }).format(new Date(iso));

/** Company name in the visitor's language when the company provided one. */
export function companyName(c: Company, locale: Locale) {
  if (locale === "ar" && c.name_ar) return c.name_ar;
  if (locale === "zh" && c.name_zh) return c.name_zh;
  return c.name;
}

export const whatsappLink = (number: string) =>
  `https://wa.me/${number.replace(/[^\d]/g, "")}`;

/** Only allow http(s) links from user-submitted website fields. */
export function safeUrl(url: string | null) {
  if (!url) return null;
  const withScheme = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) || undefined;
