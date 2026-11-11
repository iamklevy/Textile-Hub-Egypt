import Image from "next/image";
import { notFound } from "next/navigation";
import { submitInquiry } from "@/app/actions";
import { priceText } from "@/components/cards";
import { ActionForm } from "@/components/forms";
import { BackLink, ContactList, Facts, Tag } from "@/components/ui";
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
    <>
      <BackLink href={`/${lang}/machinery`} t={t} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="thread">{label(t.machineCategories, m.category)}</Tag>
            <Tag>{label(t.machineConditions, m.condition)}</Tag>
          </div>
          <h1 className="mt-3 text-3xl font-bold">{m.title}</h1>
          <p className="mt-2 text-xl font-semibold text-nile">
            {priceText(m, lang, t)}
            {m.price_egp && m.negotiable ? (
              <span className="text-base font-normal text-muted"> · {t.common.negotiable}</span>
            ) : null}
          </p>
          {photos.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative block overflow-hidden rounded-lg bg-sand ${
                    i === 0 ? "col-span-2 aspect-[4/3] sm:col-span-3 sm:aspect-[16/9]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${t.machinery.photoAlt} ${i + 1}`}
                    fill
                    priority={i === 0}
                    sizes={i === 0 ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 640px) 240px, 50vw"}
                    className="object-cover"
                  />
                </a>
              ))}
            </div>
          )}
          {m.description && <p className="mt-5 whitespace-pre-line [unicode-bidi:plaintext] rtl:text-right">{m.description}</p>}
          <Facts
            rows={[
              [t.machinery.brand, m.brand],
              [t.machinery.model, m.model],
              [t.machinery.year, m.year ? String(m.year) : null],
              [t.common.city, label(t.cities, m.city)],
              [t.machinery.sellerName, m.seller_name],
              [t.common.posted, formatDate(m.created_at, lang)],
            ]}
          />
        </article>
        <aside className="space-y-6">
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-3 font-semibold">{t.common.contact}</h2>
            <ContactList t={t} phone={m.phone} email={m.email} />
          </div>
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-4 font-semibold">{t.machinery.inquire}</h2>
            <ActionForm
              action={submitInquiry}
              fields={inquiryFields(t)}
              labels={formLabels(t, "inquiry")}
              hidden={{ kind: "machine", target_id: m.id, target_label: m.title, locale: lang }}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
