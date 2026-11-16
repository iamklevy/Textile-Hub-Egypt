import { submitJob } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { BackLink, Page } from "@/components/ui";
import { jobFields, formLabels } from "@/lib/fields";
import { locale, type LangParams } from "@/lib/page";

export default async function NewListingPage({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);

  return (
    <Page narrow="md">
      <BackLink href={`/${lang}/jobs`} t={t} />
      <h1 className="display mt-5 text-3xl md:text-4xl">{t.jobs.addTitle}</h1>
      <div className="panel mt-8 p-6 md:p-8">
        <ActionForm
          action={submitJob}
          fields={jobFields(t)}
          labels={formLabels(t, "listing")}
          hidden={{ locale: lang }}
        />
      </div>
    </Page>
  );
}
