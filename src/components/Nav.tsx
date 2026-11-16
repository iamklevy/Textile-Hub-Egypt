"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LangSwitcher } from "@/components/LangSwitcher";
import { ArrowIcon, CloseIcon, MenuIcon } from "@/components/icons";

type NavLink = { href: string; label: string };

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname() || "/";
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-sand text-ink" : "text-ink-soft hover:bg-sand/60 hover:text-ink"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileMenu({
  lang,
  links,
  cta,
  labels,
}: {
  lang: string;
  links: NavLink[];
  cta: NavLink;
  labels: { menu: string; close: string };
}) {
  const pathname = usePathname() || "/";
  // Remember the page the menu was opened on, so it closes itself on navigation.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const close = () => setOpenAt(null);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpenAt(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.menu}
        className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong bg-white text-ink"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 pb-6 pt-2 shadow-lift"
        >
          <nav className="flex flex-col">
            {links.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-line py-3.5 text-base font-medium ${
                    active ? "text-thread" : "text-ink"
                  }`}
                >
                  {l.label}
                  <ArrowIcon className="h-4 w-4 text-muted" />
                </Link>
              );
            })}
          </nav>
          <Link href={cta.href} onClick={close} className="btn btn-primary mt-5 w-full">
            {cta.label}
          </Link>
          <div className="mt-5 flex justify-center">
            <LangSwitcher current={lang} />
          </div>
        </div>
      )}
    </div>
  );
}
