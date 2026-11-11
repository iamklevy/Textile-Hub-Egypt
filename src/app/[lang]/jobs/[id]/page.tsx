import { notFound } from "next/navigation";
import { submitInquiry } from "@/app/actions";
import { salaryText } from "@/components/cards";
import { ActionForm } from "@/components/forms";
import { BackLink, ContactList, Facts, Tag } from "@/components/ui";
import { getJob } from "@/lib/data";
import { formLabels, inquiryFields } from "@/lib/fields";
import { formatDate } from "@/lib/format";
import { label } from "@/lib/i18n";
import { locale, type IdParams } from "@/lib/page";

export default async function JobPage({ params }: IdParams) {
  const { lang: rawLang, id } = await params;
  const { lang, t } = locale(rawLang);
  const j = await getJob(id);
  if (!j) notFound();

  return (
    <>
      <BackLink href={`/${lang}/jobs`} t={t} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="thread">{label(t.jobRoles, j.role)}</Tag>
            <Tag>{label(t.jobTypes, j.job_type)}</Tag>
          </div>
          <h1 className="mt-3 text-3xl font-bold">{j.title}</h1>
          <p className="mt-1 text-muted">
            {j.company_name} · {label(t.cities, j.city)}
          </p>
          {j.description && <p className="mt-5 whitespace-pre-line [unicode-bidi:plaintext] rtl:text-right">{j.description}</p>}
          <Facts
            rows={[
              [t.jobs.salary, salaryText(j, lang, t) ?? t.common.notSpecified],
              [t.jobs.languages, j.languages],
              [t.common.posted, formatDate(j.created_at, lang)],
            ]}
          />
        </article>
        <aside className="space-y-6">
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-3 font-semibold">{t.common.contact}</h2>
            <ContactList t={t} phone={j.phone} email={j.email} />
          </div>
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-4 font-semibold">{t.jobs.apply}</h2>
            <ActionForm
              action={submitInquiry}
              fields={inquiryFields(t).filter((f) => f.name !== "company")}
              labels={formLabels(t, "inquiry")}
              hidden={{ kind: "job", target_id: j.id, target_label: j.title, locale: lang }}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
