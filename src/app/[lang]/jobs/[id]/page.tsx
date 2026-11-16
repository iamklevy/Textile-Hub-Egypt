import { notFound } from "next/navigation";
import { submitInquiry } from "@/app/actions";
import { salaryText } from "@/components/cards";
import { ActionForm } from "@/components/forms";
import { BuildingIcon, PinIcon } from "@/components/icons";
import { AsideCard, BackLink, ContactList, DetailLayout, Facts, Prose, Tag } from "@/components/ui";
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
  const salary = salaryText(j, lang, t);

  return (
    <DetailLayout
      back={<BackLink href={`/${lang}/jobs`} t={t} />}
      contactLabel={t.jobs.apply}
      header={
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag tone="thread">{label(t.jobRoles, j.role)}</Tag>
            <Tag>{label(t.jobTypes, j.job_type)}</Tag>
          </div>
          <h1 className="display mt-3 text-3xl md:text-4xl">{j.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-muted">
            <span className="flex items-center gap-1.5">
              <BuildingIcon className="h-4 w-4 shrink-0" />
              {j.company_name}
            </span>
            <span className="flex items-center gap-1.5">
              <PinIcon className="h-4 w-4 shrink-0" />
              {label(t.cities, j.city)}
            </span>
          </p>
          {salary && <p className="mt-4 text-xl font-semibold text-nile">{salary}</p>}
        </>
      }
      aside={
        <>
          <AsideCard title={t.jobs.apply}>
            <ActionForm
              action={submitInquiry}
              fields={inquiryFields(t).filter((f) => f.name !== "company")}
              labels={formLabels(t, "inquiry")}
              hidden={{ kind: "job", target_id: j.id, target_label: j.title, locale: lang }}
            />
          </AsideCard>
          <AsideCard title={t.common.contact}>
            <ContactList t={t} phone={j.phone} email={j.email} />
          </AsideCard>
        </>
      }
    >
      {j.description && <Prose>{j.description}</Prose>}
      <Facts
        rows={[
          [t.jobs.salary, salary ?? t.common.notSpecified],
          [t.jobs.languages, j.languages],
          [t.common.posted, formatDate(j.created_at, lang)],
        ]}
      />
    </DetailLayout>
  );
}
