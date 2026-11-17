import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { store } from "./store";
import type { GalleryItem, Review, ServiceSettings, SiteSettings } from "./store/types";
import { CATALOG, CATEGORIES, type CategoryId, type Service } from "./services-catalog";

export const TAGS = {
  services: "ecc-services",
  reviews: "ecc-reviews",
  gallery: "ecc-gallery",
  settings: "ecc-settings",
} as const;

async function safeRead<T>(key: Parameters<ReturnType<typeof store>["readDoc"]>[0]): Promise<T | null> {
  try {
    return await store().readDoc<T>(key);
  } catch (err) {
    console.error(`[data] failed to read "${key}"`, err);
    return null;
  }
}

/* ----------------------------- cached readers ----------------------------- */

export async function getServiceSettings(): Promise<ServiceSettings> {
  "use cache";
  cacheTag(TAGS.services);
  cacheLife("minutes");
  const doc = await safeRead<ServiceSettings>("services");
  return { overrides: doc?.overrides ?? {}, custom: doc?.custom ?? [] };
}

export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheTag(TAGS.reviews);
  cacheLife("minutes");
  return (await safeRead<Review[]>("reviews")) ?? [];
}

export async function getGallery(): Promise<GalleryItem[]> {
  "use cache";
  cacheTag(TAGS.gallery);
  cacheLife("minutes");
  return (await safeRead<GalleryItem[]>("gallery")) ?? [];
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("minutes");
  const doc = await safeRead<SiteSettings>("settings");
  return { social: doc?.social ?? {}, googleReviewUrl: doc?.googleReviewUrl, announcement: doc?.announcement };
}

/* ------------------------------ derived views ----------------------------- */

export type ResolvedService = Service & { enabled: boolean };

export async function getAllServices(): Promise<ResolvedService[]> {
  return resolveServices(await getServiceSettings());
}

/** Merge the master catalog with admin overrides + custom services. */
export function resolveServices({ overrides, custom }: ServiceSettings): ResolvedService[] {
  const base = CATALOG.map((s) => {
    const o = overrides[s.id] ?? {};
    return {
      ...s,
      categories: [...s.categories],
      description: o.description?.trim() || s.description,
      descriptionEs: o.descriptionEs?.trim() || s.descriptionEs,
      enabled: o.enabled ?? s.defaultEnabled,
    };
  });
  const customs: ResolvedService[] = custom.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    nameEs: c.nameEs?.trim() || c.name,
    descriptionEs: c.descriptionEs?.trim() || c.description,
    categories: [c.category],
    pricing: CATEGORIES.find((cat) => cat.id === c.category)?.pricing ?? "custom",
    defaultEnabled: c.enabled,
    enabled: c.enabled,
    custom: true,
  }));
  return [...base, ...customs];
}

export async function getEnabledServices() {
  return (await getAllServices()).filter((s) => s.enabled);
}

export async function getEnabledByCategory() {
  const enabled = await getEnabledServices();
  return CATEGORIES.map((cat) => ({
    category: cat,
    services: enabled.filter((s) => s.categories.includes(cat.id)),
  })).filter((g) => g.services.length > 0);
}

export async function isServiceEnabled(id: string) {
  return (await getEnabledServices()).some((s) => s.id === id);
}

export async function getEnabledCategoryIds(): Promise<CategoryId[]> {
  return (await getEnabledByCategory()).map((g) => g.category.id);
}

export async function getPublishedReviews() {
  return (await getReviews())
    .filter((r) => r.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPublishedGallery() {
  return (await getGallery())
    .filter((g) => g.published && (g.before || g.after))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
