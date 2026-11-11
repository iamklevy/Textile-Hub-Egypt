import Link from "next/link";
import { CompanyCard, JobCard, MachineCard } from "@/components/cards";
import { listCompanies, listJobs, listMachines } from "@/lib/data";
import { locale, type LangParams } from "@/lib/page";

// Always render with the latest approved listings.
export const dynamic = "force-dynamic";

export default async function Home({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);
  const [companies, jobs, machines] = await Promise.all([
    listCompanies({}, 3),
    listJobs({}, 3),
    listMachines({}, 3),
  ]);

  const pillars = [
    { href: `/${lang}/directory`, title: t.nav.directory, desc: t.home.directoryDesc },
    { href: `/${lang}/jobs`, title: t.nav.jobs, desc: t.home.jobsDesc },
    { href: `/${lang}/machinery`, title: t.nav.machinery, desc: t.home.machineryDesc },
    { href: `/${lang}/investors`, title: t.nav.investors, desc: t.home.investorsDesc },
  ];
  const why = [
    [t.home.why1Title, t.home.why1Desc],
    [t.home.why2Title, t.home.why2Desc],
    [t.home.why3Title, t.home.why3Desc],
  ];
  const sections = [
    { title: t.home.latestCompanies, href: `/${lang}/directory`, items: companies.map((c) => <CompanyCard key={c.id} c={c} lang={lang} t={t} />) },
    { title: t.home.latestJobs, href: `/${lang}/jobs`, items: jobs.map((j) => <JobCard key={j.id} j={j} lang={lang} t={t} />) },
    { title: t.home.latestMachines, href: `/${lang}/machinery`, items: machines.map((m) => <MachineCard key={m.id} m={m} lang={lang} t={t} />) },
  ];

  return (
    <div className="space-y-14">
      <section className="overflow-hidden rounded-2xl bg-ink text-white">
        <div className="px-6 py-12 md:px-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-sand/80">
            {t.site.tagline}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            {t.home.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">{t.home.heroSub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${lang}/investors`}
              className="rounded-full bg-thread px-6 py-3 font-semibold hover:bg-thread-dark"
            >
              {t.home.ctaInvestor}
            </Link>
            <Link
              href={`/${lang}/directory`}
              className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
            >
              {t.home.ctaDirectory}
            </Link>
          </div>
        </div>
        <div aria-hidden className="weave h-2" />
      </section>

      <section>
        <h2 className="text-2xl font-bold">{t.home.pillarsTitle}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="rounded-xl border border-line bg-white p-5 hover:border-ink-soft"
            >
              <h3 className="font-semibold text-thread-dark">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {sections.map(
        (s) =>
          s.items.length > 0 && (
            <section key={s.href}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl font-bold">{s.title}</h2>
                <Link href={s.href} className="text-sm font-semibold text-nile hover:underline">
                  {t.common.viewAll}
                </Link>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">{s.items}</div>
            </section>
          ),
      )}

      <section className="rounded-2xl bg-sand p-6 md:p-10">
        <h2 className="text-2xl font-bold">{t.home.whyTitle}</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {why.map(([title, desc]) => (
            <div key={title}>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6 md:p-10">
        <h2 className="text-2xl font-bold">{t.home.listTitle}</h2>
        <p className="mt-2 max-w-2xl text-muted">{t.home.listDesc}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          {[
            [`/${lang}/directory/new`, t.directory.add],
            [`/${lang}/jobs/new`, t.jobs.add],
            [`/${lang}/machinery/new`, t.machinery.add],
          ].map(([href, text]) => (
            <Link key={href} href={href} className="rounded-full bg-ink px-5 py-2.5 text-white hover:bg-ink-soft">
              + {text}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
