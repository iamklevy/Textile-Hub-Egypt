import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getAdminSession } from "@/lib/admin";
import { locale, type LangParams } from "@/lib/page";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLoginPage({ params }: LangParams) {
  const { lang, t } = locale((await params).lang);
  const session = await getAdminSession();
  if (session.state === "ok") redirect(`/${lang}/admin`);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">{t.admin.loginTitle}</h1>
      <div className="mt-6 rounded-xl border border-line bg-white p-6">
        {session.state === "demo" ? (
          <p className="text-sm text-muted">{t.admin.demoNote}</p>
        ) : (
          <LoginForm lang={lang} labels={t.admin} />
        )}
      </div>
    </div>
  );
}
