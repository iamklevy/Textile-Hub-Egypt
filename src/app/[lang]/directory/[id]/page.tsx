import { notFound } from "next/navigation";
import { submitInquiry } from "@/app/actions";
import { Monogram } from "@/components/cards";
import { ActionForm } from "@/components/forms";
import { PinIcon } from "@/components/icons";
import { AsideCard, BackLink, ContactList, DetailLayout, Facts, Prose, Tag, VerifiedTag } from "@/components/ui";
import { getCompany } from "@/lib/data";
import { formLabels, inquiryFields } from "@/lib/fields";
import { companyName, formatNumber, safeUrl } from "@/lib/format";
import { label } from "@/lib/i18n";
import { locale, type IdParams } from "@/lib/page";

export default async function CompanyPage({ params }: IdParams) {
  const { lang: rawLang, id } = await params;
  const { lang, t } = locale(rawLang);
  const c = await getCompany(id);
  if (!c) notFound();
  const name = companyName(c, lang);

  return (
    <DetailLayout
      back={<BackLink href={`/${lang}/directory`} t={t} />}
      contactLabel={t.directory.inquire}
      header={
        <div className="flex items-start gap-5">
          <Monogram name={name} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag tone="thread">{label(t.companyCategories, c.category)}</Tag>
              {c.verified && <VerifiedTag t={t} />}
            </div>
            <h1 className="display mt-3 text-3xl md:text-4xl">{name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted">
              <PinIcon className="h-4 w-4 shrink-0" />
              {label(t.cities, c.city)}
            </p>
          </div>
        </div>
      }
      aside={
        <>
          <AsideCard title={t.common.contact}>
            <ContactList t={t} phone={c.phone} whatsapp={c.whatsapp} email={c.email} website={safeUrl(c.website)} />
          </AsideCard>
          <AsideCard title={t.directory.inquire}>
            <ActionForm
              action={submitInquiry}
              fields={inquiryFields(t)}
              labels={formLabels(t, "inquiry")}
              hidden={{ kind: "company", target_id: c.id, target_label: c.name, locale: lang }}
            />
          </AsideCard>
        </>
      }
    >
      {c.description && <Prose>{c.description}</Prose>}
      {c.open_to?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-medium text-muted">{t.directory.openTo}</h2>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {c.open_to.map((o) => (
              <span key={o} className="rounded-lg border border-line-strong bg-white px-3 py-1.5 text-sm font-medium">
                {label(t.openTo, o)}
              </span>
            ))}
          </div>
        </div>
      )}
      <Facts
        rows={[
          [t.directory.capabilities, c.capabilities],
          [t.directory.employees, c.employees ? formatNumber(c.employees, lang) : null],
          [t.directory.minOrder, c.min_order],
          [t.directory.certifications, c.certifications],
          [t.directory.exportMarkets, c.export_markets],
          [t.directory.contactName, c.contact_name],
        ]}
      />
    </DetailLayout>
  );
}
