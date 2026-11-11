import { notFound } from "next/navigation";
import { getDict, hasLocale } from "@/lib/i18n";
import { first } from "@/lib/format";
import type { Filters } from "@/lib/types";

export type LangParams = { params: Promise<{ lang: string }> };
export type IdParams = { params: Promise<{ lang: string; id: string }> };
export type ListProps = LangParams & {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Validate the locale segment and load its dictionary. */
export function locale(lang: string) {
  if (!hasLocale(lang)) notFound();
  return { lang, t: getDict(lang) };
}

export async function readFilters(
  searchParams: ListProps["searchParams"],
): Promise<Filters> {
  const sp = await searchParams;
  return { q: first(sp.q), category: first(sp.category), city: first(sp.city) };
}
