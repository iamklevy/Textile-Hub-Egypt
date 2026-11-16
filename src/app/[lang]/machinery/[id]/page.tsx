import Image from "next/image";
import { notFound } from "next/navigation";
import { submitInquiry } from "@/app/actions";
import { priceText } from "@/components/cards";
import { ActionForm } from "@/components/forms";
import { AsideCard, BackLink, ContactList, DetailLayout, Facts, Prose, Tag } from "@/components/ui";
import { getMachine } from "@/lib/data";
import { formLabels, inquiryFields } from "@/lib/fields";
import { formatDate } from "@/lib/format";
import { label } from "@/lib/i18n";
import { locale, type IdParams } from "@/lib/page";
import { photoUrls } from "@/lib/photos";

export default async function MachinePage({ params }: IdParams) {
  const { lang: rawLang, id } = await params;
  const { lang, t } = locale(rawLang);
  const m = await getMachine(id);
  if (!m) notFound();
  const photos = photoUrls(m.photos);

  return (
    <DetailLayout
      back={<BackLink href={`/${lang}/machinery`} t={t} />}
      contactLabel={t.machinery.inquire}
      header={
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag tone="thread">{label(t.machineCategories, m.category)}</Tag>
            <Tag>{label(t.machineConditions, m.condition)}</Tag>
          </div>
          <h1 className="display mt-3 text-3xl md:text-4xl">{m.title}</h1>
          <p className="mt-4 text-2xl font-semibold">
            {priceText(m, lang, t)}
            {m.price_egp && m.negotiable ? (
              <span className="text-base font-normal text-muted"> · {t.common.negotiable}</span>
            ) : null}
          </p>
        </>
      }
      aside={
        <>
          <AsideCard title={t.common.contact}>
            <ContactList t={t} phone={m.phone} email={m.email} />
          </AsideCard>
          <AsideCard title={t.machinery.inquire}>
            <ActionForm
              action={submitInquiry}
              fields={inquiryFields(t)}
              labels={formLabels(t, "inquiry")}
              hidden={{ kind: "machine", target_id: m.id, target_label: m.title, locale: lang }}
            />
          </AsideCard>
        </>
      }
    >
      {photos.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {photos.map((src, i) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative block overflow-hidden rounded-xl bg-sand ${
                i === 0 ? "col-span-2 aspect-[4/3] sm:col-span-3 sm:aspect-[16/9]" : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt={`${t.machinery.photoAlt} ${i + 1}`}
                fill
                priority={i === 0}
                sizes={i === 0 ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 640px) 240px, 50vw"}
                className="object-cover transition duration-300 hover:scale-[1.02]"
              />
            </a>
          ))}
        </div>
      )}
      {m.description && <Prose>{m.description}</Prose>}
      <Facts
        rows={[
          [t.machinery.brand, m.brand],
          [t.machinery.model, m.model],
          [t.machinery.year, m.year ? String(m.year) : null],
          [t.machinery.condition, label(t.machineConditions, m.condition)],
          [t.common.city, label(t.cities, m.city)],
          [t.machinery.sellerName, m.seller_name],
          [t.common.posted, formatDate(m.created_at, lang)],
        ]}
      />
    </DetailLayout>
  );
}
