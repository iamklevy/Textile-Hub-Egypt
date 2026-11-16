import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer, Header } from "@/components/Chrome";
import { dirOf, getDict, hasLocale, htmlLang, locales } from "@/lib/i18n";
import { isLive } from "@/lib/supabase";

// One type family across scripts: Plex for Latin, its Arabic cut for Arabic.
// Chinese falls back to the reader's system font (see globals.css).
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

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
    <html lang={htmlLang[lang]} dir={dirOf(lang)} className={`${plex.variable} ${plexArabic.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header lang={lang} t={t} demo={!isLive} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} t={t} />
      </body>
    </html>
  );
}
