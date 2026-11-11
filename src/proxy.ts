import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/lib/i18n-config";
import { refreshSession } from "@/lib/supabase-proxy";

function pickLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().toLowerCase().slice(0, 2);
    const match = locales.find((l) => l === code);
    if (match) return match;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) {
    if (/^\/[a-z]{2}\/admin(\/|$)/.test(pathname)) return refreshSession(request);
    return;
  }

  request.nextUrl.pathname = `/${pickLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals and any file with an extension (favicon, images...).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
