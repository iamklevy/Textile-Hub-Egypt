import { CompanyCard } from "@/components/cards";
import { Empty, FilterBar, PageHeader, ResultCount } from "@/components/ui";
import { listCompanies } from "@/lib/data";
import { locale, readFilters, type ListProps } from "@/lib/page";

export default async function DirectoryPage({ params, searchParams }: ListProps) {
  const { lang, t } = locale((await params).lang);
  const filters = await readFilters(searchParams);
  const companies = await listCompanies(filters);

  return (
    <>
      <PageHeader
        title={t.directory.title}
        sub={t.directory.sub}
        cta={{ href: `/${lang}/directory/new`, label: t.directory.add }}
      />
      <FilterBar t={t} filters={filters} categories={t.companyCategories} categoryLabel={t.common.category} />
      <ResultCount n={companies.length} t={t} />
      {companies.length === 0 ? (
        <Empty t={t} />
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <CompanyCard key={c.id} c={c} lang={lang} t={t} />
          ))}
        </div>
      )}
    </>
  );
}
