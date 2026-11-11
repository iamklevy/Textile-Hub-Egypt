import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer, Header } from "@/components/Chrome";
import { dirOf, getDict, hasLocale, htmlLang, locales } from "@/lib/i18n";
import { isLive } from "@/lib/supabase";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDict(lang);
  return {
    title: { default: `${t.site.name} — ${t.site.tagline}`, template: `%s — ${t.site.name}` },
    description: t.home.heroSub,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <html lang={htmlLang[lang]} dir={dirOf(lang)}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header lang={lang} t={t} demo={!isLive} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <Footer lang={lang} t={t} />
      </body>
    </html>
  );
}
