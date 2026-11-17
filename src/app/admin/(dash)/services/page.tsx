import { requireAdmin } from "@/lib/auth";
import { resolveServices } from "@/lib/data";
import { CATALOG, CATEGORIES } from "@/lib/services-catalog";
import { store, type ServiceSettings } from "@/lib/store";
import { addCustomService } from "../../actions";
import { AdminHeader, Panel } from "../shared";
import { ServicesManager } from "./ServicesManager";

export default async function AdminServices() {
  await requireAdmin();
  const doc = await store().readDoc<ServiceSettings>("services").catch(() => null);
  const services = resolveServices({ overrides: doc?.overrides ?? {}, custom: doc?.custom ?? [] });
  const defaults = Object.fromEntries(CATALOG.map((c) => [c.id, c.description]));

  return (
    <>
      <AdminHeader
        title="Services"
        subtitle="Turn services on or off and edit their descriptions. Only enabled services appear on the website and in the booking forms."
      />
      <ServicesManager
        categories={CATEGORIES.map((c) => ({ id: c.id, name: c.name, optional: !!c.optional }))}
        services={services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          defaultDescription: defaults[s.id] ?? "",
          categories: s.categories,
          enabled: s.enabled,
          custom: !!s.custom,
        }))}
      />
      <Panel className="mt-8">
        <h2 className="font-serif text-2xl">Add a custom service</h2>
        <p className="mt-1 text-sm text-muted">
          Tip: use the same name as your Google Business Profile service so everything stays consistent.
        </p>
        <form action={addCustomService} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
          <div>
            <label className="field-label" htmlFor="cs-name">
              Service name
            </label>
            <input id="cs-name" name="name" required minLength={3} maxLength={100} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="cs-category">
              Category
            </label>
            <select id="cs-category" name="category" className="field" defaultValue="residential">
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="field-label" htmlFor="cs-desc">
              Short description
            </label>
            <textarea id="cs-desc" name="description" maxLength={600} className="field !min-h-24" />
          </div>
          <div>
            <button className="btn btn-primary" type="submit">
              Add service
            </button>
          </div>
        </form>
      </Panel>
    </>
  );
}
