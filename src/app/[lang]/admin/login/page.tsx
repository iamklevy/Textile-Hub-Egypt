import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { Page } from "@/components/ui";
import { getAdminSession } from "@/lib/admin";
import { locale, type LangParams } from "@/lib/page";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLoginPage({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);
  const session = await getAdminSession();
  if (session.state === "ok") redirect(`/${lang}/admin`);

  return (
    <Page narrow="sm">
      <h1 className="display text-3xl">{t.admin.loginTitle}</h1>
      <div className="panel mt-8 p-6 md:p-8">
        {session.state === "demo" ? (
          <p className="text-sm text-muted">{t.admin.demoNote}</p>
        ) : (
          <LoginForm lang={lang} labels={t.admin} />
        )}
      </div>
    </Page>
  );
}
