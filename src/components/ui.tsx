import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowIcon,
  ChatIcon,
  CheckIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";
import { whatsappLink } from "@/lib/format";
import { cities } from "@/lib/options";
import type { Dict } from "@/lib/i18n";
import type { Filters } from "@/lib/types";

/** Centered content column used by every page except the full-width home. */
export function Page({ children, narrow }: { children: ReactNode; narrow?: "md" | "sm" }) {
  const width = narrow === "sm" ? "max-w-md" : narrow === "md" ? "max-w-3xl" : "max-w-6xl";
  return <div className={`mx-auto w-full ${width} px-5 py-10 md:px-8 md:py-14`}>{children}</div>;
}

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
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="display text-3xl md:text-[2.6rem]">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-lg text-muted">{sub}</p>}
      </div>
      {cta && (
        <Link href={cta.href} className="btn btn-dark shrink-0 self-start md:self-auto">
          <PlusIcon className="h-4 w-4" />
          {cta.label}
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
  clearHref,
}: {
  t: Dict;
  filters: Filters;
  categories: Record<string, string>;
  categoryLabel: string;
  clearHref: string;
}) {
  const active = Boolean(filters.q || filters.category || filters.city);
  return (
    <form method="get" className="panel mt-8 grid gap-3 p-3 md:grid-cols-[1fr_210px_210px_auto]">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute start-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder={t.common.searchPlaceholder}
          aria-label={t.common.search}
          className="field ps-10"
        />
      </div>
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
      <div className="flex items-center gap-3">
        <button className="btn btn-dark flex-1 md:flex-none">{t.common.search}</button>
        {active && (
          <Link href={clearHref} className="px-1 text-sm font-medium text-muted hover:text-ink">
            {t.common.clear}
          </Link>
        )}
      </div>
    </form>
  );
}

export function ResultCount({ n, t }: { n: number; t: Dict }) {
  return (
    <p className="mt-8 text-sm text-muted">
      <span className="font-semibold text-ink">{n}</span> {t.common.results}
    </p>
  );
}

export function Empty({ t }: { t: Dict }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-white/60 px-6 py-16 text-center">
      <SearchIcon className="mx-auto h-7 w-7 text-line-strong" />
      <p className="mt-4 text-muted">{t.common.noResults}</p>
    </div>
  );
}

export function Tag({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "nile" | "thread" }) {
  const tones = {
    plain: "bg-sand text-ink-soft",
    nile: "bg-nile-soft text-nile",
    thread: "bg-thread/10 text-thread-dark",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium leading-none ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function VerifiedTag({ t }: { t: Dict }) {
  return (
    <Tag tone="nile">
      <CheckIcon className="h-3 w-3" />
      {t.common.verified}
    </Tag>
  );
}

export function Card({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card p-6 transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
    >
      {children}
    </Link>
  );
}

export function BackLink({ href, t }: { href: string; t: Dict }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
      <ArrowIcon className="h-4 w-4 -scale-x-100 rtl:scale-x-100" />
      {t.common.back}
    </Link>
  );
}

/** Two-column listing page: details on one side, contact and inquiry on the other. */
export function DetailLayout({
  back,
  contactLabel,
  header,
  children,
  aside,
}: {
  back: ReactNode;
  contactLabel: string;
  header: ReactNode;
  children: ReactNode;
  aside: ReactNode;
}) {
  return (
    <Page>
      {back}
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        <article>
          {header}
          <a href="#contact" className="btn btn-primary mt-6 lg:hidden">
            {contactLabel}
          </a>
          {children}
        </article>
        <aside id="contact" className="space-y-5">
          {aside}
        </aside>
      </div>
    </Page>
  );
}

export function AsideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel p-6">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <p className="mt-8 max-w-2xl whitespace-pre-line text-[1.05rem] leading-relaxed text-ink-soft [unicode-bidi:plaintext] rtl:text-right">
      {children}
    </p>
  );
}

export function Facts({ rows }: { rows: [string, ReactNode][] }) {
  const shown = rows.filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (shown.length === 0) return null;
  return (
    <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
      {shown.map(([k, v]) => (
        <div key={k} className="border-t border-line py-4">
          <dt className="text-xs font-medium text-muted">{k}</dt>
          <dd className="mt-1.5 whitespace-pre-line font-medium [unicode-bidi:plaintext] rtl:text-right">{v}</dd>
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
  const row = "flex items-center gap-3 text-sm";
  const icon = "h-4.5 w-4.5 shrink-0 text-muted";
  return (
    <div>
      {whatsapp && (
        <a
          href={whatsappLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-go mb-5 w-full"
        >
          <ChatIcon className="h-4.5 w-4.5" />
          {t.common.whatsapp}
          <span dir="ltr" className="font-normal opacity-85">
            {whatsapp}
          </span>
        </a>
      )}
      <ul className="space-y-3">
        {phone && (
          <li className={row}>
            <PhoneIcon className={icon} />
            <span className="sr-only">{t.common.phone}: </span>
            <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr" className="font-medium hover:underline">
              {phone}
            </a>
          </li>
        )}
        {email && (
          <li className={row}>
            <MailIcon className={icon} />
            <span className="sr-only">{t.common.email}: </span>
            <a href={`mailto:${email}`} dir="ltr" className="break-all font-medium hover:underline">
              {email}
            </a>
          </li>
        )}
        {website && (
          <li className={row}>
            <GlobeIcon className={icon} />
            <span className="sr-only">{t.common.website}: </span>
            <a href={website} target="_blank" rel="noopener noreferrer nofollow" dir="ltr" className="break-all font-medium hover:underline">
              {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
