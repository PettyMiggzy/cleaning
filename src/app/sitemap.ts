import type { MetadataRoute } from "next";
import { AREAS } from "@/lib/areas";
import { getEnabledServices } from "@/lib/data";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { absoluteUrl } from "@/lib/site";
import { LANGS, localizePath } from "@/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const enabled = new Set((await getEnabledServices()).map((s) => s.id));

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" },
    ...SERVICE_PAGES.filter((p) => enabled.has(p.serviceId)).map((p) => ({
      path: `/services/${p.slug}`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
    })),
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
    { path: "/photo-estimate", priority: 0.9, changeFrequency: "monthly" },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
    { path: "/service-areas", priority: 0.8, changeFrequency: "monthly" },
    ...AREAS.map((a) => ({ path: `/service-areas/${a.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.6, changeFrequency: "weekly" },
    { path: "/reviews", priority: 0.6, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  ];

  // One entry per language, each pointing at all of its translations (hreflang).
  return pages.flatMap((p) => {
    const languages = {
      ...Object.fromEntries(LANGS.map((l) => [l, absoluteUrl(localizePath(l, p.path))])),
      "x-default": absoluteUrl(localizePath("en", p.path)),
    };
    return LANGS.map((l) => ({
      url: absoluteUrl(localizePath(l, p.path)),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      alternates: { languages },
    }));
  });
}
