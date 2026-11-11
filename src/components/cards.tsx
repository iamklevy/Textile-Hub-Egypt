import Image from "next/image";
import { Card, Tag } from "@/components/ui";
import { companyName, formatDate, formatNumber } from "@/lib/format";
import type { Dict, Locale } from "@/lib/i18n";
import { label } from "@/lib/i18n";
import { photoUrls } from "@/lib/photos";
import type { Company, Job, Machine } from "@/lib/types";

type Base = { lang: Locale; t: Dict };

export function salaryText(j: Job, lang: Locale, t: Dict) {
  if (!j.salary_min && !j.salary_max) return null;
  const parts = [j.salary_min, j.salary_max]
    .filter((n): n is number => Boolean(n))
    .map((n) => formatNumber(n, lang));
  return `${parts.join(" – ")} ${t.common.egp} ${t.common.perMonth}`;
}

export function priceText(m: Machine, lang: Locale, t: Dict) {
  if (!m.price_egp) return t.machinery.priceOnRequest;
  return `${formatNumber(m.price_egp, lang)} ${t.common.egp}`;
}

export function CompanyCard({ c, lang, t }: Base & { c: Company }) {
  return (
    <Card href={`/${lang}/directory/${c.id}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="thread">{label(t.companyCategories, c.category)}</Tag>
        {c.verified && <Tag tone="nile">✓ {t.common.verified}</Tag>}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{companyName(c, lang)}</h3>
      <p className="mt-1 text-sm text-muted">{label(t.cities, c.city)}</p>
      {c.capabilities && (
        <p className="mt-3 line-clamp-2 text-sm text-ink-soft [unicode-bidi:plaintext] rtl:text-right">{c.capabilities}</p>
      )}
      {c.open_to?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {c.open_to.map((o) => (
            <Tag key={o}>{label(t.openTo, o)}</Tag>
          ))}
        </div>
      )}
    </Card>
  );
}

export function JobCard({ j, lang, t }: Base & { j: Job }) {
  const salary = salaryText(j, lang, t);
  return (
    <Card href={`/${lang}/jobs/${j.id}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="thread">{label(t.jobRoles, j.role)}</Tag>
        <Tag>{label(t.jobTypes, j.job_type)}</Tag>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{j.title}</h3>
      <p className="mt-1 text-sm text-muted">
        {j.company_name} · {label(t.cities, j.city)}
      </p>
      {salary && <p className="mt-3 text-sm font-semibold text-nile">{salary}</p>}
      <p className="mt-auto pt-4 text-xs text-muted">{formatDate(j.created_at, lang)}</p>
    </Card>
  );
}

export function MachineCard({ m, lang, t }: Base & { m: Machine }) {
  const cover = photoUrls(m.photos)[0];
  return (
    <Card href={`/${lang}/machinery/${m.id}`}>
      {cover && (
        <div className="relative -mx-5 -mt-5 mb-4 aspect-[4/3] overflow-hidden rounded-t-xl bg-sand">
          <Image
            src={cover}
            alt={t.machinery.photoAlt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="thread">{label(t.machineCategories, m.category)}</Tag>
        <Tag>{label(t.machineConditions, m.condition)}</Tag>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{m.title}</h3>
      <p className="mt-1 text-sm text-muted">
        {[m.brand, m.year, label(t.cities, m.city)].filter(Boolean).join(" · ")}
      </p>
      <p className="mt-3 text-sm font-semibold text-nile">
        {priceText(m, lang, t)}
        {m.price_egp && m.negotiable ? (
          <span className="font-normal text-muted"> · {t.common.negotiable}</span>
        ) : null}
      </p>
    </Card>
  );
}
