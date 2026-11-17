/**
 * Language configuration shared by server and client code.
 * English lives at the site root (/pricing); Spanish lives under /es (/es/pricing).
 */
export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export const isLang = (v: unknown): v is Lang => typeof v === "string" && (LANGS as readonly string[]).includes(v);

export const LANG_META: Record<Lang, { htmlLang: string; ogLocale: string; label: string; short: string }> = {
  en: { htmlLang: "en-US", ogLocale: "en_US", label: "English", short: "EN" },
  es: { htmlLang: "es-US", ogLocale: "es_US", label: "Español", short: "ES" },
};

/** pick(lang)("English text", "Texto en español") */
export const pick =
  (lang: Lang) =>
  <T>(en: T, es: T): T =>
    lang === "es" ? es : en;

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** "/book?x=1" → "/es/book?x=1" for Spanish; unchanged for English and external links. */
export function localizePath(lang: Lang, path: string): string {
  if (EXTERNAL.test(path) || path.startsWith("#")) return path;
  if (lang === DEFAULT_LANG) return path;
  if (path === "/" || path === "") return `/${lang}`;
  if (path.startsWith("/#") || path.startsWith("/?")) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path}`;
}

/** Remove a leading language prefix: "/es/pricing" → "/pricing", "/es" → "/". */
export function stripLang(pathname: string): string {
  for (const l of LANGS) {
    if (l === DEFAULT_LANG) continue;
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname || "/";
}

export function langFromPathname(pathname: string): Lang {
  return stripLang(pathname) === pathname ? DEFAULT_LANG : "es";
}

/** The same page in another language. */
export function switchPath(pathname: string, to: Lang): string {
  return localizePath(to, stripLang(pathname));
}

export const t = pick;
