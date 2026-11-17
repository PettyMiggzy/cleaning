import type { MetadataRoute } from "next";
import { AREAS } from "@/lib/areas";
import { getEnabledServices } from "@/lib/data";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const enabled = new Set((await getEnabledServices()).map((s) => s.id));
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/services", 0.9, "weekly"),
    ...SERVICE_PAGES.filter((p) => enabled.has(p.serviceId)).map((p) => page(`/services/${p.slug}`, 0.9)),
    page("/pricing", 0.9),
    page("/photo-estimate", 0.9),
    page("/book", 0.9),
    page("/service-areas", 0.8),
    ...AREAS.map((a) => page(`/service-areas/${a.slug}`, 0.8)),
    page("/about", 0.6),
    page("/gallery", 0.6, "weekly"),
    page("/reviews", 0.6, "weekly"),
    page("/faq", 0.6),
    page("/contact", 0.7),
    page("/privacy-policy", 0.2, "yearly"),
  ];
}
