import { AREAS, type ServiceArea } from "@/lib/areas";
import { AREAS_ES } from "@/lib/areas.es";
import { ALL_FAQS, FAQ_GROUPS, type Faq } from "@/lib/faqs";
import { FAQ_GROUPS_ES } from "@/lib/faqs.es";
import { SERVICE_PAGES, type ServicePage } from "@/lib/service-pages";
import { SERVICE_PAGES_ES } from "@/lib/service-pages.es";
import { CATEGORIES, type CategoryId, type ServiceCategory } from "@/lib/services-catalog";
import { CATEGORY_ES } from "@/lib/services-catalog.es";
import type { Lang } from "./config";

/** Localized copies of the structured site content (English is the source of truth). */

export function servicePage(lang: Lang, page: ServicePage): ServicePage {
  if (lang === "en") return page;
  const es = SERVICE_PAGES_ES[page.slug];
  return es ? { ...page, ...es } : page;
}

export function getServicePageBySlug(lang: Lang, slug: string): ServicePage | undefined {
  const page = SERVICE_PAGES.find((p) => p.slug === slug);
  return page ? servicePage(lang, page) : undefined;
}

// Neighborhood names stay as-is (proper names); only generic English words are translated.
const COMMUNITY_ES: Record<string, string> = {
  "Champions area": "Zona de Champions",
  "Vintage Park area": "Zona de Vintage Park",
  "Kuykendahl corridor": "Corredor de Kuykendahl",
  "Tomball Parkway (SH 249) corridor": "Corredor de Tomball Parkway (SH 249)",
  "Downtown Humble": "Centro de Humble",
  "Lake Houston area": "Zona del Lago Houston",
  "Town Center area": "Zona de Town Center",
  "Downtown Conroe": "Centro de Conroe",
  "Lake Conroe area": "Zona del Lago Conroe",
  "April Sound area": "Zona de April Sound",
};

export function localizeArea(lang: Lang, area: ServiceArea): ServiceArea {
  if (lang === "en") return area;
  const es = AREAS_ES[area.slug];
  return { ...area, ...(es ?? {}), communities: area.communities.map((c) => COMMUNITY_ES[c] ?? c) };
}

export function getAreaBySlug(lang: Lang, slug: string): ServiceArea | undefined {
  const area = AREAS.find((a) => a.slug === slug);
  return area ? localizeArea(lang, area) : undefined;
}

export function category(lang: Lang, cat: ServiceCategory): ServiceCategory {
  if (lang === "en") return cat;
  const es = CATEGORY_ES[cat.id];
  return es ? { ...cat, ...es } : cat;
}

export function categoryById(lang: Lang, id: CategoryId): ServiceCategory {
  return category(lang, CATEGORIES.find((c) => c.id === id)!);
}

export type LocalizedService = { id: string; name: string; description: string };

/** Pick the English or Spanish name/description of a catalog/admin service. */
export function serviceText(
  lang: Lang,
  s: { id: string; name: string; description: string; nameEs?: string; descriptionEs?: string },
): LocalizedService {
  return lang === "es"
    ? { id: s.id, name: s.nameEs || s.name, description: s.descriptionEs || s.description }
    : { id: s.id, name: s.name, description: s.description };
}

export function faqGroups(lang: Lang): { title: string; items: Faq[] }[] {
  return lang === "es" ? FAQ_GROUPS_ES : FAQ_GROUPS;
}

export function allFaqs(lang: Lang): Faq[] {
  return faqGroups(lang).flatMap((g) => g.items);
}

/** The FAQ in `lang` that corresponds to an English question (items are index-aligned). */
export function faqByEnglishQuestion(lang: Lang, englishQuestion: string): Faq | undefined {
  const i = ALL_FAQS.findIndex((f) => f.q === englishQuestion);
  return i < 0 ? undefined : allFaqs(lang)[i];
}
