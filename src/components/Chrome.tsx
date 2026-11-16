import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { LangSwitcher } from "@/components/LangSwitcher";
import { DesktopNav, MobileMenu } from "@/components/Nav";
import { LogoMark } from "@/components/icons";

export function Header({ lang, t, demo }: { lang: Locale; t: Dict; demo: boolean }) {
  const links = [
    { href: `/${lang}/directory`, label: t.nav.directory },
    { href: `/${lang}/jobs`, label: t.nav.jobs },
    { href: `/${lang}/machinery`, label: t.nav.machinery },
  ];
  const cta = { href: `/${lang}/investors`, label: t.nav.investors };

  return (
    <>
      {demo && (
        <p className="bg-ink px-4 py-1.5 text-center text-xs text-white/85">{t.site.demoBanner}</p>
      )}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 md:px-8">
          <Link href={`/${lang}`} className="flex shrink-0 items-center gap-2.5 font-semibold text-ink">
            <LogoMark />
            <span className="text-[1.05rem] leading-tight">{t.site.name}</span>
          </Link>
          <div className="ms-4 hidden md:block">
            <DesktopNav links={links} />
          </div>
          <div className="ms-auto flex items-center gap-3">
            <div className="hidden sm:block">
              <LangSwitcher current={lang} />
            </div>
            <Link href={cta.href} className="btn btn-primary btn-sm hidden lg:inline-flex">
              {cta.label}
            </Link>
            <MobileMenu
              lang={lang}
              links={links}
              cta={cta}
              labels={{ menu: t.nav.menu, close: t.nav.close }}
            />
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  const browse = [
    [`/${lang}/directory`, t.nav.directory],
    [`/${lang}/jobs`, t.nav.jobs],
    [`/${lang}/machinery`, t.nav.machinery],
    [`/${lang}/investors`, t.nav.investors],
  ];
  const list = [
    [`/${lang}/directory/new`, t.directory.add],
    [`/${lang}/jobs/new`, t.jobs.add],
    [`/${lang}/machinery/new`, t.machinery.add],
  ];
  const column = (title: string, items: string[][]) => (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map(([href, text]) => (
          <li key={href}>
            <Link href={href} className="text-white/65 transition-colors hover:text-white">
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <footer className="mt-20 border-t border-white/10 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.6fr_1fr_1fr] md:px-8">
        <div className="max-w-sm">
          <p className="flex items-center gap-2.5 font-semibold">
            <LogoMark className="h-8 w-8 rounded-lg ring-1 ring-white/15" />
            {t.site.name}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/65">{t.site.footer}</p>
        </div>
        {column(t.nav.browse, browse)}
        {column(t.nav.getListed, list)}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-white/50 md:px-8">
          <p>
            © {new Date().getFullYear()} {t.site.name}
          </p>
          <p dir="ltr">English · العربية · 中文</p>
        </div>
      </div>
    </footer>
  );
}
