import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { LangSwitcher } from "@/components/LangSwitcher";

export function Header({ lang, t, demo }: { lang: Locale; t: Dict; demo: boolean }) {
  const links = [
    { href: `/${lang}/directory`, label: t.nav.directory },
    { href: `/${lang}/jobs`, label: t.nav.jobs },
    { href: `/${lang}/machinery`, label: t.nav.machinery },
  ];
  return (
    <header className="border-b border-line bg-white">
      {demo && (
        <p className="bg-ink px-4 py-1.5 text-center text-xs text-white">
          {t.site.demoBanner}
        </p>
      )}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href={`/${lang}`} className="flex items-center gap-2 font-bold text-ink">
          <span aria-hidden className="weave inline-block h-6 w-6 rounded-sm" />
          <span className="text-lg">{t.site.name}</span>
        </Link>
        <nav className="order-3 flex w-full gap-5 text-sm font-medium text-ink-soft md:order-none md:w-auto">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-thread">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-3">
          <Link
            href={`/${lang}/investors`}
            className="hidden rounded-full bg-thread px-4 py-2 text-sm font-semibold text-white hover:bg-thread-dark sm:inline-block"
          >
            {t.nav.investors}
          </Link>
          <LangSwitcher current={lang} />
        </div>
      </div>
      <div aria-hidden className="weave h-1" />
    </header>
  );
}

export function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="font-semibold text-ink">{t.site.name}</p>
          <p className="mt-1">{t.site.footer}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href={`/${lang}/directory`}>{t.nav.directory}</Link>
          <Link href={`/${lang}/jobs`}>{t.nav.jobs}</Link>
          <Link href={`/${lang}/machinery`}>{t.nav.machinery}</Link>
          <Link href={`/${lang}/investors`}>{t.nav.investors}</Link>
        </nav>
      </div>
    </footer>
  );
}
