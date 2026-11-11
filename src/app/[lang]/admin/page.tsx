import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { setHandled, setStatus, setVerified, signOut } from "@/app/admin-actions";
import { priceText, salaryText } from "@/components/cards";
import { Facts, Tag } from "@/components/ui";
import { adminTabs, getAdminSession, statuses, type AdminTab } from "@/lib/admin";
import { first, formatDate } from "@/lib/format";
import { label, type Dict, type Locale } from "@/lib/i18n";
import { locale, type ListProps } from "@/lib/page";
import { photoUrls } from "@/lib/photos";
import type { Company, Inquiry, Job, ListingStatus, Machine } from "@/lib/types";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Row = (Company | Job | Machine) & { status: ListingStatus };

const publicPath: Record<Exclude<AdminTab, "inquiries">, string> = {
  companies: "directory",
  jobs: "jobs",
  machines: "machinery",
};

export default async function AdminPage({ params, searchParams }: ListProps) {
  const { lang, t } = locale((await params).lang);
  const a = t.admin;
  const session = await getAdminSession();

  if (session.state === "signed-out") redirect(`/${lang}/admin/login`);
  if (session.state === "demo" || session.state === "not-admin") {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-line bg-white p-6">
        <h1 className="text-2xl font-bold">{a.title}</h1>
        <p className="mt-3 text-muted">{session.state === "demo" ? a.demoNote : a.notAdmin}</p>
        {session.state === "not-admin" && <SignOut lang={lang} label={a.signOut} />}
      </div>
    );
  }

  const sp = await searchParams;
  const tabParam = first(sp.tab);
  const tab: AdminTab = (adminTabs as readonly string[]).includes(tabParam ?? "")
    ? (tabParam as AdminTab)
    : "companies";
  const viewParam = first(sp.view);
  const isInbox = tab === "inquiries";
  const view = isInbox
    ? viewParam === "handled" ? "handled" : "open"
    : (statuses as readonly string[]).includes(viewParam ?? "") ? viewParam! : "pending";

  const { supabase } = session;

  // Badges: pending listings per table, unanswered messages.
  const countQueries = adminTabs.map((name) => {
    const q = supabase.from(name).select("id", { count: "exact", head: true });
    return name === "inquiries" ? q.eq("handled", false) : q.eq("status", "pending");
  });
  const counts = (await Promise.all(countQueries)).map((r) => r.count ?? 0);

  let query = supabase.from(tab).select("*").order("created_at", { ascending: view === "pending" || view === "open" }).limit(100);
  query = isInbox ? query.eq("handled", view === "handled") : query.eq("status", view);
  const { data, error } = await query;
  if (error) console.error(`[admin] list ${tab} failed:`, error.message);
  const rows = (data ?? []) as (Row | Inquiry)[];

  const tabLabel: Record<AdminTab, string> = {
    companies: a.companies,
    jobs: a.jobs,
    machines: a.machines,
    inquiries: a.inquiries,
  };
  const views = isInbox
    ? [
        ["open", a.open],
        ["handled", a.handled],
      ]
    : statuses.map((s) => [s, a[s]]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <h1 className="text-3xl font-bold">{a.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span dir="ltr">{session.email}</span>
          <SignOut lang={lang} label={a.signOut} />
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        {adminTabs.map((name, i) => (
          <Link
            key={name}
            href={`/${lang}/admin?tab=${name}`}
            aria-current={name === tab ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              name === tab ? "bg-ink text-white" : "border border-line bg-white text-ink-soft hover:border-ink-soft"
            }`}
          >
            {tabLabel[name]}
            {counts[i] > 0 && (
              <span className="ms-2 rounded-full bg-thread px-2 py-0.5 text-xs text-white">{counts[i]}</span>
            )}
          </Link>
        ))}
      </nav>

      <nav className="mt-4 flex flex-wrap gap-4 text-sm">
        {views.map(([value, text]) => (
          <Link
            key={value}
            href={`/${lang}/admin?tab=${tab}&view=${value}`}
            aria-current={value === view ? "page" : undefined}
            className={value === view ? "font-semibold text-thread underline underline-offset-4" : "text-muted hover:text-ink"}
          >
            {text}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">
          {a.empty}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {rows.map((row) =>
            isInbox ? (
              <InquiryItem key={row.id} q={row as Inquiry} lang={lang} t={t} />
            ) : (
              <ListingItem
                key={row.id}
                table={tab as keyof typeof publicPath}
                row={row as Row}
                lang={lang}
                t={t}
              />
            ),
          )}
        </div>
      )}
    </>
  );
}

function SignOut({ lang, label: text }: { lang: string; label: string }) {
  return (
    <form action={signOut}>
      <input type="hidden" name="lang" value={lang} />
      <button className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-ink hover:border-ink-soft">
        {text}
      </button>
    </form>
  );
}

function Btn({ children, tone = "plain", ...rest }: { children: ReactNode; tone?: "plain" | "go" | "stop"; name?: string; value?: string }) {
  const tones = {
    plain: "border border-line bg-white text-ink hover:border-ink-soft",
    go: "bg-nile text-white hover:opacity-90",
    stop: "bg-thread text-white hover:bg-thread-dark",
  };
  return (
    <button {...rest} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tones[tone]}`}>
      {children}
    </button>
  );
}

function ListingItem({
  table,
  row,
  lang,
  t,
}: {
  table: keyof typeof publicPath;
  row: Row;
  lang: Locale;
  t: Dict;
}) {
  const a = t.admin;
  let title: string;
  let facts: [string, ReactNode][];
  let photos: string[] = [];

  if (table === "companies") {
    const c = row as Company;
    title = [c.name, c.name_ar, c.name_zh].filter(Boolean).join(" · ");
    facts = [
      [t.common.category, label(t.companyCategories, c.category)],
      [t.common.city, label(t.cities, c.city)],
      [t.directory.employees, c.employees ? String(c.employees) : null],
      [t.directory.capabilities, c.capabilities],
      [t.directory.description, c.description],
      [t.directory.minOrder, c.min_order],
      [t.directory.certifications, c.certifications],
      [t.directory.exportMarkets, c.export_markets],
      [t.directory.openTo, c.open_to?.map((o) => label(t.openTo, o)).join(", ")],
      [t.directory.contactName, c.contact_name],
      [t.common.phone, c.phone],
      [t.common.whatsapp, c.whatsapp],
      [t.common.email, c.email],
      [t.common.website, c.website],
    ];
  } else if (table === "jobs") {
    const j = row as Job;
    title = `${j.title} — ${j.company_name}`;
    facts = [
      [t.jobs.role, label(t.jobRoles, j.role)],
      [t.jobs.type, label(t.jobTypes, j.job_type)],
      [t.common.city, label(t.cities, j.city)],
      [t.jobs.salary, salaryText(j, lang, t)],
      [t.jobs.languages, j.languages],
      [t.jobs.description, j.description],
      [t.common.phone, j.phone],
      [t.common.email, j.email],
    ];
  } else {
    const m = row as Machine;
    title = m.title;
    photos = photoUrls(m.photos);
    facts = [
      [t.common.category, label(t.machineCategories, m.category)],
      [t.machinery.condition, label(t.machineConditions, m.condition)],
      [t.machinery.price, priceText(m, lang, t) + (m.negotiable ? ` · ${t.common.negotiable}` : "")],
      [t.machinery.brand, m.brand],
      [t.machinery.model, m.model],
      [t.machinery.year, m.year ? String(m.year) : null],
      [t.common.city, label(t.cities, m.city)],
      [t.machinery.description, m.description],
      [t.machinery.sellerName, m.seller_name],
      [t.common.phone, m.phone],
      [t.common.email, m.email],
    ];
  }

  const company = table === "companies" ? (row as Company) : null;
  const statusButtons: [ListingStatus, string, "go" | "stop" | "plain"][] = [
    ["approved", a.approve, "go"],
    ["rejected", a.reject, "stop"],
    ["pending", a.toPending, "plain"],
  ];

  return (
    <article className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone={row.status === "approved" ? "nile" : row.status === "rejected" ? "thread" : "plain"}>
          {a[row.status]}
        </Tag>
        {company?.verified && <Tag tone="nile">✓ {t.common.verified}</Tag>}
        <span className="text-xs text-muted">
          {a.submitted}: {formatDate(row.created_at, lang)}
        </span>
      </div>
      <h2 className="mt-2 text-lg font-semibold [unicode-bidi:plaintext]">{title}</h2>

      {photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((src, i) => (
            <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="relative block h-24 w-24 overflow-hidden rounded-lg bg-sand">
              <Image src={src} alt={`${t.machinery.photoAlt} ${i + 1}`} fill sizes="96px" className="object-cover" />
            </a>
          ))}
        </div>
      )}

      <Facts rows={facts} />

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <form action={setStatus} className="flex flex-wrap gap-2">
          <input type="hidden" name="table" value={table} />
          <input type="hidden" name="id" value={row.id} />
          {statusButtons
            .filter(([s]) => s !== row.status)
            .map(([s, text, tone]) => (
              <Btn key={s} name="status" value={s} tone={tone}>
                {text}
              </Btn>
            ))}
        </form>
        {company && (
          <form action={setVerified}>
            <input type="hidden" name="id" value={company.id} />
            <input type="hidden" name="verified" value={String(!company.verified)} />
            <Btn>{company.verified ? a.unverify : `✓ ${a.verify}`}</Btn>
          </form>
        )}
        {row.status === "approved" && (
          <Link
            href={`/${lang}/${publicPath[table]}/${row.id}`}
            target="_blank"
            className="ms-auto text-sm font-medium text-nile hover:underline"
          >
            {a.viewOnSite}
          </Link>
        )}
      </div>
    </article>
  );
}

function InquiryItem({ q, lang, t }: { q: Inquiry; lang: Locale; t: Dict }) {
  const a = t.admin;
  const targetPath: Record<string, string> = { company: "directory", job: "jobs", machine: "machinery" };
  const about =
    q.target_label && q.target_id && targetPath[q.kind] ? (
      <Link href={`/${lang}/${targetPath[q.kind]}/${q.target_id}`} target="_blank" className="text-nile hover:underline">
        {q.target_label}
      </Link>
    ) : (
      q.target_label
    );

  return (
    <article className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone={q.kind === "investor" ? "thread" : "plain"}>{label(a.inquiryKinds, q.kind)}</Tag>
        {q.handled && <Tag tone="nile">{a.handled}</Tag>}
        <span className="text-xs text-muted">
          {a.submitted}: {formatDate(q.created_at, lang)}
        </span>
      </div>
      <h2 className="mt-2 text-lg font-semibold [unicode-bidi:plaintext]">
        {q.name}
        {q.company ? ` — ${q.company}` : ""}
      </h2>
      <Facts
        rows={[
          [a.about, about],
          [t.common.phone, q.phone],
          [t.common.email, q.email],
          [t.form.yourWechat, q.wechat],
          [t.investors.interest, q.interests?.map((i) => label(t.investorInterests, i)).join(", ")],
          [t.form.message, q.message],
          [a.language, q.locale?.toUpperCase()],
        ]}
      />
      <form action={setHandled} className="mt-5 border-t border-line pt-4">
        <input type="hidden" name="id" value={q.id} />
        <input type="hidden" name="handled" value={String(!q.handled)} />
        <Btn tone={q.handled ? "plain" : "go"}>{q.handled ? a.reopen : a.markHandled}</Btn>
      </form>
    </article>
  );
}
