import { JobCard } from "@/components/cards";
import { Empty, FilterBar, PageHeader, ResultCount } from "@/components/ui";
import { listJobs } from "@/lib/data";
import { locale, readFilters, type ListProps } from "@/lib/page";

export default async function JobsPage({ params, searchParams }: ListProps) {
  const { lang, t } = locale((await params).lang);
  const filters = await readFilters(searchParams);
  const jobs = await listJobs(filters);

  return (
    <>
      <PageHeader
        title={t.jobs.title}
        sub={t.jobs.sub}
        cta={{ href: `/${lang}/jobs/new`, label: t.jobs.add }}
      />
      <FilterBar t={t} filters={filters} categories={t.jobRoles} categoryLabel={t.jobs.role} />
      <ResultCount n={jobs.length} t={t} />
      {jobs.length === 0 ? (
        <Empty t={t} />
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((j) => (
            <JobCard key={j.id} j={j} lang={lang} t={t} />
          ))}
        </div>
      )}
    </>
  );
}
