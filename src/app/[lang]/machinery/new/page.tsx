import { submitMachine } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { BackLink } from "@/components/ui";
import { machineFields, formLabels } from "@/lib/fields";
import { locale, type LangParams } from "@/lib/page";

export default async function NewListingPage({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/${lang}/machinery`} t={t} />
      <h1 className="mt-4 text-3xl font-bold">{t.machinery.addTitle}</h1>
      <div className="mt-6 rounded-xl border border-line bg-white p-6">
        <ActionForm
          action={submitMachine}
          fields={machineFields(t)}
          labels={formLabels(t, "listing")}
          hidden={{ locale: lang }}
        />
      </div>
    </div>
  );
}
