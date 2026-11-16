import Link from "next/link";
import { submitInquiry } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { ArrowIcon, BuildingIcon, FactoryIcon, GearIcon, PeopleIcon } from "@/components/icons";
import { formLabels, investorFields } from "@/lib/fields";
import { locale, type LangParams } from "@/lib/page";

export default async function InvestorsPage({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);
  const points = [
    { title: t.investors.p1Title, desc: t.investors.p1Desc, href: `/${lang}/directory`, Icon: FactoryIcon },
    { title: t.investors.p2Title, desc: t.investors.p2Desc, href: `/${lang}/directory`, Icon: BuildingIcon },
    { title: t.investors.p3Title, desc: t.investors.p3Desc, href: `/${lang}/jobs`, Icon: PeopleIcon },
    { title: t.investors.p4Title, desc: t.investors.p4Desc, href: `/${lang}/machinery`, Icon: GearIcon },
  ];

  return (
    <section className="weave-dark -mb-20 text-white">
      {/* On phones the form sits between the pitch and the detail points. */}
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div>
          <p className="eyebrow flex items-center gap-3 text-white/70">
            <span aria-hidden className="h-px w-8 bg-thread" />
            {t.nav.investors}
          </p>
          <h1 className="display mt-6 text-4xl md:text-5xl">{t.investors.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/75 md:text-xl">{t.investors.sub}</p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="rounded-2xl bg-card p-6 text-ink shadow-lift md:p-8">
            <h2 className="text-xl font-semibold">{t.investors.formTitle}</h2>
            <p className="mb-6 mt-1.5 text-sm leading-relaxed text-muted">{t.investors.formNote}</p>
            <ActionForm
              action={submitInquiry}
              fields={investorFields(t)}
              labels={formLabels(t, "inquiry")}
              hidden={{ kind: "investor", locale: lang }}
            />
          </div>
        </div>

        <ul className="grid content-start gap-x-10 sm:grid-cols-2">
          {points.map(({ title, desc, href, Icon }) => (
            <li key={title} className="border-t border-white/15">
              <Link href={href} className="group block py-6">
                <Icon className="h-6 w-6 text-white/80" />
                <h2 className="mt-4 flex items-center gap-1.5 font-semibold">
                  {title}
                  <ArrowIcon className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
