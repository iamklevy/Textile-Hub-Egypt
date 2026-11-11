import Link from "next/link";
import { submitInquiry } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { formLabels, investorFields } from "@/lib/fields";
import { locale, type LangParams } from "@/lib/page";

export default async function InvestorsPage({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);
  const points = [
    { title: t.investors.p1Title, desc: t.investors.p1Desc, href: `/${lang}/directory` },
    { title: t.investors.p2Title, desc: t.investors.p2Desc, href: `/${lang}/directory` },
    { title: t.investors.p3Title, desc: t.investors.p3Desc, href: `/${lang}/jobs` },
    { title: t.investors.p4Title, desc: t.investors.p4Desc, href: `/${lang}/machinery` },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_440px]">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">{t.investors.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.investors.sub}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {points.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="rounded-xl border border-line bg-white p-5 hover:border-ink-soft"
            >
              <h2 className="font-semibold text-thread-dark">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-white p-6">
        <h2 className="text-xl font-bold">{t.investors.formTitle}</h2>
        <p className="mb-5 mt-1 text-sm text-muted">{t.investors.formNote}</p>
        <ActionForm
          action={submitInquiry}
          fields={investorFields(t)}
          labels={formLabels(t, "inquiry")}
          hidden={{ kind: "investor", locale: lang }}
        />
      </div>
    </div>
  );
}
