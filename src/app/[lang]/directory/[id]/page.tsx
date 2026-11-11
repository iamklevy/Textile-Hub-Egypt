import { notFound } from "next/navigation";
import { submitInquiry } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { BackLink, ContactList, Facts, Tag } from "@/components/ui";
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
    <>
      <BackLink href={`/${lang}/directory`} t={t} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="thread">{label(t.companyCategories, c.category)}</Tag>
            {c.verified && <Tag tone="nile">✓ {t.common.verified}</Tag>}
          </div>
          <h1 className="mt-3 text-3xl font-bold">{name}</h1>
          <p className="mt-1 text-muted">{label(t.cities, c.city)}</p>
          {c.description && <p className="mt-5 whitespace-pre-line [unicode-bidi:plaintext] rtl:text-right">{c.description}</p>}
          <Facts
            rows={[
              [t.directory.capabilities, c.capabilities],
              [t.directory.employees, c.employees ? formatNumber(c.employees, lang) : null],
              [t.directory.minOrder, c.min_order],
              [t.directory.certifications, c.certifications],
              [t.directory.exportMarkets, c.export_markets],
              [
                t.directory.openTo,
                c.open_to?.length ? c.open_to.map((o) => label(t.openTo, o)).join(" · ") : null,
              ],
              [t.directory.contactName, c.contact_name],
            ]}
          />
        </article>
        <aside className="space-y-6">
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-3 font-semibold">{t.common.contact}</h2>
            <ContactList t={t} phone={c.phone} whatsapp={c.whatsapp} email={c.email} website={safeUrl(c.website)} />
          </div>
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-4 font-semibold">{t.directory.inquire}</h2>
            <ActionForm
              action={submitInquiry}
              fields={inquiryFields(t)}
              labels={formLabels(t, "inquiry")}
              hidden={{ kind: "company", target_id: c.id, target_label: c.name, locale: lang }}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
