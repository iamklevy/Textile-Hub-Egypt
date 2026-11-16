"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const names = { en: "EN", ar: "عربي", zh: "中文" } as const;

export function LangSwitcher({ current }: { current: string }) {
  const pathname = usePathname() || "/";
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-line bg-white p-1 text-sm">
      {(Object.keys(names) as (keyof typeof names)[]).map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          hrefLang={l}
          lang={l}
          aria-current={l === current ? "true" : undefined}
          className={`rounded-md px-2.5 py-1.5 font-medium leading-none transition-colors ${
            l === current ? "bg-ink text-white" : "text-muted hover:text-ink"
          }`}
        >
          {names[l]}
        </Link>
      ))}
    </div>
  );
}
