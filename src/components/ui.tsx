import Link from "next/link";
import type { ReactNode } from "react";
import { cities } from "@/lib/options";
import type { Dict } from "@/lib/i18n";
import type { Filters } from "@/lib/types";

export function PageHeader({
  title,
  sub,
  cta,
}: {
  title: string;
  sub?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-muted">{sub}</p>}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="shrink-0 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft md:self-auto"
        >
          + {cta.label}
        </Link>
      )}
    </div>
  );
}

export function FilterBar({
  t,
  filters,
  categories,
  categoryLabel,
}: {
  t: Dict;
  filters: Filters;
  categories: Record<string, string>;
  categoryLabel: string;
}) {
  return (
    <form method="get" className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_220px_auto]">
      <input
        type="search"
        name="q"
        defaultValue={filters.q ?? ""}
        placeholder={t.common.searchPlaceholder}
        aria-label={t.common.search}
        className="field"
      />
      <select
        name="category"
        defaultValue={filters.category ?? ""}
        aria-label={categoryLabel}
        className="field"
      >
        <option value="">
          {categoryLabel}: {t.common.all}
        </option>
        {Object.entries(categories).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      <select
        name="city"
        defaultValue={filters.city ?? ""}
        aria-label={t.common.city}
        className="field"
      >
        <option value="">
          {t.common.city}: {t.common.all}
        </option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {t.cities[c]}
          </option>
        ))}
      </select>
      <button className="rounded-lg bg-nile px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
        {t.common.search}
      </button>
    </form>
  );
}

export function ResultCount({ n, t }: { n: number; t: Dict }) {
  return (
    <p className="mt-5 text-sm text-muted">
      {n} {t.common.results}
    </p>
  );
}

export function Empty({ t }: { t: Dict }) {
  return (
    <p className="mt-6 rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">
      {t.common.noResults}
    </p>
  );
}

export function Tag({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "nile" | "thread" }) {
  const tones = {
    plain: "bg-sand text-ink-soft",
    nile: "bg-nile-soft text-nile",
    thread: "bg-thread/10 text-thread-dark",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Card({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-xl border border-line bg-card p-5 transition hover:border-ink-soft hover:shadow-sm"
    >
      {children}
    </Link>
  );
}

export function BackLink({ href, t }: { href: string; t: Dict }) {
  return (
    <Link href={href} className="text-sm font-medium text-nile hover:underline">
      <span aria-hidden className="inline-block rtl:rotate-180">←</span> {t.common.back}
    </Link>
  );
}

export function Facts({ rows }: { rows: [string, ReactNode][] }) {
  const shown = rows.filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (shown.length === 0) return null;
  return (
    <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {shown.map(([k, v]) => (
        <div key={k} className="border-t border-line pt-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt>
          <dd className="mt-1 whitespace-pre-line [unicode-bidi:plaintext] rtl:text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactList({
  t,
  phone,
  whatsapp,
  email,
  website,
}: {
  t: Dict;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
}) {
  const wa = whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}` : null;
  return (
    <ul className="space-y-2 text-sm">
      {phone && (
        <li>
          <span className="text-muted">{t.common.phone}: </span>
          <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr" className="font-medium hover:underline">
            {phone}
          </a>
        </li>
      )}
      {wa && (
        <li>
          <span className="text-muted">{t.common.whatsapp}: </span>
          <a href={wa} target="_blank" rel="noopener noreferrer" dir="ltr" className="font-medium text-nile hover:underline">
            {whatsapp}
          </a>
        </li>
      )}
      {email && (
        <li>
          <span className="text-muted">{t.common.email}: </span>
          <a href={`mailto:${email}`} dir="ltr" className="font-medium hover:underline">
            {email}
          </a>
        </li>
      )}
      {website && (
        <li>
          <span className="text-muted">{t.common.website}: </span>
          <a href={website} target="_blank" rel="noopener noreferrer nofollow" dir="ltr" className="font-medium hover:underline">
            {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        </li>
      )}
    </ul>
  );
}
