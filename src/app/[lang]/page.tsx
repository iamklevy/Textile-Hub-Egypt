import Link from "next/link";
import { CompanyCard, JobCard, MachineCard } from "@/components/cards";
import {
  ArrowIcon,
  BuildingIcon,
  FactoryIcon,
  GearIcon,
  GlobeIcon,
  PeopleIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import { listCompanies, listJobs, listMachines } from "@/lib/data";
import { locale, type LangParams } from "@/lib/page";

// Always render with the latest approved listings.
export const dynamic = "force-dynamic";

const container = "mx-auto w-full max-w-6xl px-5 md:px-8";

export default async function Home({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);
  const [companies, jobs, machines] = await Promise.all([
    listCompanies({}, 3),
    listJobs({}, 3),
    listMachines({}, 3),
  ]);

  const markets = [
    { href: `/${lang}/directory`, title: t.nav.directory, desc: t.home.directoryDesc, Icon: FactoryIcon },
    { href: `/${lang}/jobs`, title: t.nav.jobs, desc: t.home.jobsDesc, Icon: PeopleIcon },
    { href: `/${lang}/machinery`, title: t.nav.machinery, desc: t.home.machineryDesc, Icon: GearIcon },
  ];
  const landing = [
    { title: t.investors.p1Title, desc: t.investors.p1Desc, Icon: FactoryIcon },
    { title: t.investors.p2Title, desc: t.investors.p2Desc, Icon: BuildingIcon },
    { title: t.investors.p3Title, desc: t.investors.p3Desc, Icon: PeopleIcon },
    { title: t.investors.p4Title, desc: t.investors.p4Desc, Icon: GearIcon },
  ];
  const why = [
    [t.home.why1Title, t.home.why1Desc],
    [t.home.why2Title, t.home.why2Desc],
    [t.home.why3Title, t.home.why3Desc],
  ];
  const latest = [
    { title: t.home.latestCompanies, href: `/${lang}/directory`, items: companies.map((c) => <CompanyCard key={c.id} c={c} lang={lang} t={t} />) },
    { title: t.home.latestJobs, href: `/${lang}/jobs`, items: jobs.map((j) => <JobCard key={j.id} j={j} lang={lang} t={t} />) },
    { title: t.home.latestMachines, href: `/${lang}/machinery`, items: machines.map((m) => <MachineCard key={m.id} m={m} lang={lang} t={t} />) },
  ].filter((s) => s.items.length > 0);

  return (
    <>
      {/* Hero */}
      <section className="weave-dark text-white">
        <div className={`${container} py-20 md:py-28 lg:py-32`}>
          <p className="eyebrow flex items-center gap-3 text-white/70">
            <span aria-hidden className="h-px w-8 bg-thread" />
            {t.site.tagline}
          </p>
          <h1 className="display mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-[4rem]">
            {t.home.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
            {t.home.heroSub}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={`/${lang}/investors`} className="btn btn-primary px-6 py-3.5 text-base">
              {t.home.ctaInvestor}
              <ArrowIcon />
            </Link>
            <Link href={`/${lang}/directory`} className="btn btn-on-dark px-6 py-3.5 text-base">
              {t.home.ctaDirectory}
            </Link>
          </div>
          <ul className="mt-12 flex flex-col gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/65 sm:flex-row sm:flex-wrap">
            <li className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4.5 w-4.5 shrink-0 text-white/80" />
              {t.form.reviewNote}
            </li>
            <li className="flex items-center gap-2">
              <GlobeIcon className="h-4.5 w-4.5 shrink-0 text-white/80" />
              <span dir="ltr">English · العربية · 中文</span>
            </li>
          </ul>
        </div>
      </section>

      {/* The three markets */}
      <section className={`${container} py-16 md:py-24`}>
        <h2 className="display text-2xl md:text-[2rem]">{t.home.pillarsTitle}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {markets.map(({ href, title, desc, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl border border-line bg-card p-7 transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-sand text-thread">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{desc}</p>
              <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-ink group-hover:text-thread-dark">
                {t.common.viewAll}
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Landing service for manufacturers entering Egypt */}
      <section className="border-y border-line bg-card">
        <div className={`${container} grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-16`}>
          <div>
            <p className="eyebrow">{t.nav.investors}</p>
            <h2 className="display mt-4 text-3xl md:text-[2.5rem]">{t.investors.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{t.investors.sub}</p>
            <Link href={`/${lang}/investors`} className="btn btn-primary mt-8 px-6 py-3.5 text-base">
              {t.investors.formTitle}
              <ArrowIcon />
            </Link>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {landing.map(({ title, desc, Icon }) => (
              <li key={title} className="border-t border-line py-6">
                <Icon className="h-6 w-6 text-nile" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest listings */}
      {latest.length > 0 && (
        <div className={`${container} space-y-16 py-16 md:space-y-20 md:py-24`}>
          {latest.map((s) => (
            <section key={s.href}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="display text-2xl md:text-[2rem]">{s.title}</h2>
                <Link
                  href={s.href}
                  className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink hover:text-thread-dark"
                >
                  {t.common.viewAll}
                  <ArrowIcon />
                </Link>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-3">{s.items}</div>
            </section>
          ))}
        </div>
      )}

      {/* Why Egypt */}
      <section className="bg-sand">
        <div className={`${container} py-16 md:py-24`}>
          <h2 className="display text-2xl md:text-[2rem]">{t.home.whyTitle}</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {why.map(([title, desc]) => (
              <div key={title} className="border-t border-ink/20 pt-5">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get listed */}
      <section className={`${container} pt-16 md:pt-24`}>
        <div className="weave-dark overflow-hidden rounded-3xl px-7 py-12 text-white md:px-14 md:py-16">
          <h2 className="display max-w-2xl text-3xl md:text-[2.5rem]">{t.home.listTitle}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{t.home.listDesc}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {[
              [`/${lang}/directory/new`, t.directory.add],
              [`/${lang}/jobs/new`, t.jobs.add],
              [`/${lang}/machinery/new`, t.machinery.add],
            ].map(([href, text], i) => (
              <Link
                key={href}
                href={href}
                className={`btn ${i === 0 ? "bg-white text-ink hover:bg-sand" : "btn-on-dark"}`}
              >
                <PlusIcon className="h-4 w-4" />
                {text}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
