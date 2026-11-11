import { submitJob } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { BackLink } from "@/components/ui";
import { jobFields, formLabels } from "@/lib/fields";
import { locale, type LangParams } from "@/lib/page";

export default async function NewListingPage({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/${lang}/jobs`} t={t} />
      <h1 className="mt-4 text-3xl font-bold">{t.jobs.addTitle}</h1>
      <div className="mt-6 rounded-xl border border-line bg-white p-6">
        <ActionForm
          action={submitJob}
          fields={jobFields(t)}
          labels={formLabels(t, "listing")}
          hidden={{ locale: lang }}
        />
      </div>
    </div>
  );
}
