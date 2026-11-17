import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { LANGS, LANG_META, localizePath, type Lang } from "./config";

/**
 * Page metadata with canonical + hreflang alternates for every language.
 * `path` is the language-neutral path ("/pricing", "/service-areas/spring-tx").
 */
export function pageMetadata(
  lang: Lang,
  path: string,
  m: { title: string; description: string; image?: string },
): Metadata {
  const url = localizePath(lang, path);
  const shareImage = lang === "es" ? "/og-es.jpg" : "/og.jpg";
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(LANGS.map((l) => [l, localizePath(l, path)])), "x-default": localizePath("en", path) },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: m.title,
      description: m.description,
      url,
      locale: LANG_META[lang].ogLocale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_META[l].ogLocale),
      images: m.image ? [{ url: m.image }] : [{ url: shareImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: [m.image ?? shareImage] },
  };
}
