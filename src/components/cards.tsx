import Image from "next/image";
import { BuildingIcon, GearIcon, PinIcon } from "@/components/icons";
import { Card, Tag, VerifiedTag } from "@/components/ui";
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

/** First character of a name on a tile; stands in for a company logo. */
export function Monogram({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const sizes = { md: "h-11 w-11 text-lg", lg: "h-16 w-16 text-2xl" };
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-xl bg-sand font-semibold text-ink-soft ${sizes[size]}`}
    >
      {Array.from(name.trim())[0]?.toUpperCase()}
    </span>
  );
}

function Place({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 flex items-center gap-1 text-sm text-muted">
      <PinIcon className="h-3.5 w-3.5 shrink-0" />
      {children}
    </p>
  );
}

const titleClass = "text-[1.05rem] font-semibold leading-snug transition-colors group-hover:text-thread-dark";

export function CompanyCard({ c, lang, t }: Base & { c: Company }) {
  const name = companyName(c, lang);
  return (
    <Card href={`/${lang}/directory/${c.id}`}>
      <div className="flex items-start gap-3.5">
        <Monogram name={name} />
        <div className="min-w-0">
          <h3 className={titleClass}>{name}</h3>
          <Place>{label(t.cities, c.city)}</Place>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Tag tone="thread">{label(t.companyCategories, c.category)}</Tag>
        {c.verified && <VerifiedTag t={t} />}
      </div>
      {c.capabilities && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft [unicode-bidi:plaintext] rtl:text-right">
          {c.capabilities}
        </p>
      )}
      {c.open_to?.length > 0 && (
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-1.5 border-t border-line pt-4">
            {c.open_to.map((o) => (
              <Tag key={o}>{label(t.openTo, o)}</Tag>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export function JobCard({ j, lang, t }: Base & { j: Job }) {
  const salary = salaryText(j, lang, t);
  return (
    <Card href={`/${lang}/jobs/${j.id}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        <Tag tone="thread">{label(t.jobRoles, j.role)}</Tag>
        <Tag>{label(t.jobTypes, j.job_type)}</Tag>
      </div>
      <h3 className={`mt-4 ${titleClass}`}>{j.title}</h3>
      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
        <BuildingIcon className="h-3.5 w-3.5 shrink-0" />
        {j.company_name}
      </p>
      <Place>{label(t.cities, j.city)}</Place>
      <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-5">
        <p className="text-sm font-semibold text-nile">{salary ?? t.common.notSpecified}</p>
        <p className="text-xs text-muted">{formatDate(j.created_at, lang)}</p>
      </div>
    </Card>
  );
}

export function MachineCard({ m, lang, t }: Base & { m: Machine }) {
  const cover = photoUrls(m.photos)[0];
  return (
    <Card href={`/${lang}/machinery/${m.id}`}>
      <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden bg-sand">
        {cover ? (
          <Image
            src={cover}
            alt={t.machinery.photoAlt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="weave-light grid h-full place-items-center">
            <GearIcon className="h-9 w-9 text-ink/25" strokeWidth={1.2} />
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Tag tone="thread">{label(t.machineCategories, m.category)}</Tag>
        <Tag>{label(t.machineConditions, m.condition)}</Tag>
      </div>
      <h3 className={`mt-4 ${titleClass}`}>{m.title}</h3>
      <p className="mt-1.5 text-sm text-muted">
        {[m.brand, m.year, label(t.cities, m.city)].filter(Boolean).join(" · ")}
      </p>
      <p className="mt-auto pt-5 font-semibold text-ink">
        {priceText(m, lang, t)}
        {m.price_egp && m.negotiable ? (
          <span className="text-sm font-normal text-muted"> · {t.common.negotiable}</span>
        ) : null}
      </p>
    </Card>
  );
}
