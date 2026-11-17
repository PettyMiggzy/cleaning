import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, LANGS } from "@/i18n/config";

/**
 * 1. www.example.com → example.com (one canonical host)
 * 2. Language routing. English has clean URLs (/pricing) and is served internally from /en/pricing;
 *    Spanish lives at /es/pricing. A visible /en/... URL redirects to the clean English URL.
 */
const OTHER_LANGS = LANGS.filter((l) => l !== DEFAULT_LANG);

function bypassesLanguageRouting(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/media/") ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // files: /og.jpg, /robots.txt, /sitemap.xml, /images/…
  );
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.port = "";
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;
  if (bypassesLanguageRouting(pathname)) return NextResponse.next();

  // /en/foo → /foo (canonical English URL)
  if (pathname === `/${DEFAULT_LANG}` || pathname.startsWith(`/${DEFAULT_LANG}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LANG.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // /es, /es/foo → served as-is by app/[lang]
  if (OTHER_LANGS.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next();

  // /foo → /en/foo (internal rewrite; the browser keeps showing /foo)
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANG}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
