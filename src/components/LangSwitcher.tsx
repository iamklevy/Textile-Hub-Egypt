"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const names = { en: "EN", ar: "عربي", zh: "中文" } as const;

export function LangSwitcher({ current }: { current: string }) {
  const pathname = usePathname() || "/";
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1 text-sm">
      {(Object.keys(names) as (keyof typeof names)[]).map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          hrefLang={l}
          className={`rounded-full px-2.5 py-1 leading-none ${
            l === current ? "bg-ink text-white" : "text-muted hover:text-ink"
          }`}
        >
          {names[l]}
        </Link>
      ))}
    </div>
  );
}
