import "server-only";
import type { ServiceGroup } from "@/components/forms/BookingForm";
import { getEnabledByCategory } from "./data";

/** Enabled services grouped by category, for <select> menus in the forms. */
export async function getFormServiceGroups(): Promise<ServiceGroup[]> {
  const groups = await getEnabledByCategory();
  return groups.map((g) => ({
    label: g.category.name,
    options: g.services.map((s) => ({ id: s.id, name: s.name, pricing: s.pricing })),
  }));
}
