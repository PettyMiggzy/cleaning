import "server-only";
import type { ServiceGroup } from "@/components/forms/BookingForm";
import { category, serviceText } from "@/i18n/content";
import { getLang } from "@/i18n/server";
import { getEnabledByCategory } from "./data";

/** Enabled services grouped by category (in the current page language), for <select> menus in the forms. */
export async function getFormServiceGroups(): Promise<ServiceGroup[]> {
  const [lang, groups] = await Promise.all([getLang(), getEnabledByCategory()]);
  return groups.map((g) => ({
    label: category(lang, g.category).name,
    options: g.services.map((s) => ({ id: s.id, name: serviceText(lang, s).name, pricing: s.pricing })),
  }));
}
