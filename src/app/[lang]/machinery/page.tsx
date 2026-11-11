import { MachineCard } from "@/components/cards";
import { Empty, FilterBar, PageHeader, ResultCount } from "@/components/ui";
import { listMachines } from "@/lib/data";
import { locale, readFilters, type ListProps } from "@/lib/page";

export default async function MachineryPage({ params, searchParams }: ListProps) {
  const { lang, t } = locale((await params).lang);
  const filters = await readFilters(searchParams);
  const machines = await listMachines(filters);

  return (
    <>
      <PageHeader
        title={t.machinery.title}
        sub={t.machinery.sub}
        cta={{ href: `/${lang}/machinery/new`, label: t.machinery.add }}
      />
      <FilterBar t={t} filters={filters} categories={t.machineCategories} categoryLabel={t.common.category} />
      <ResultCount n={machines.length} t={t} />
      {machines.length === 0 ? (
        <Empty t={t} />
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {machines.map((m) => (
            <MachineCard key={m.id} m={m} lang={lang} t={t} />
          ))}
        </div>
      )}
    </>
  );
}
