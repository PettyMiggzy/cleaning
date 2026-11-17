"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { Icon } from "@/components/Icon";
import { deleteCustomService, saveServiceDescription, setCategoryEnabled, setServiceEnabled } from "../../actions";
import type { CategoryId } from "@/lib/services-catalog";

type Svc = {
  id: string;
  name: string;
  description: string;
  descriptionEs?: string;
  defaultDescription: string;
  defaultDescriptionEs: string;
  categories: CategoryId[];
  enabled: boolean;
  custom: boolean;
};

export function ServicesManager({ categories, services }: { categories: { id: CategoryId; name: string; optional: boolean }[]; services: Svc[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(categories[0]?.id ?? null);
  const [optimistic, setOptimistic] = useOptimistic(
    Object.fromEntries(services.map((s) => [s.id, s.enabled])) as Record<string, boolean>,
    (state, patch: Record<string, boolean>) => ({ ...state, ...patch }),
  );

  const q = query.trim().toLowerCase();

  function toggle(id: string, enabled: boolean) {
    start(async () => {
      setOptimistic({ [id]: enabled });
      await setServiceEnabled(id, enabled);
      router.refresh();
    });
  }
  function toggleCategory(cat: CategoryId, enabled: boolean) {
    start(async () => {
      setOptimistic(Object.fromEntries(services.filter((s) => s.categories.includes(cat)).map((s) => [s.id, enabled])));
      await setCategoryEnabled(cat, enabled);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="relative mb-5">
        <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-plum-500" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services…" className="field pl-12" aria-label="Search services" />
      </div>
      <div className="space-y-3">
        {categories.map((cat) => {
          const items = services.filter((s) => s.categories.includes(cat.id) && (!q || s.name.toLowerCase().includes(q)));
          if (!items.length) return null;
          const onCount = items.filter((s) => optimistic[s.id]).length;
          const isOpen = !!q || open === cat.id;
          return (
            <section key={cat.id} className="overflow-hidden rounded-3xl border border-silver-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                <button type="button" onClick={() => setOpen(isOpen && !q ? null : cat.id)} className="flex flex-1 items-center gap-3 text-left" aria-expanded={isOpen}>
                  <Icon name="chevronDown" className={`size-5 text-plum-600 transition ${isOpen ? "" : "-rotate-90"}`} />
                  <span>
                    <span className="block font-serif text-xl font-semibold text-ink">{cat.name}</span>
                    <span className="text-xs font-semibold text-muted">
                      {onCount} of {items.length} enabled{cat.optional ? " · optional services (start disabled)" : ""}
                    </span>
                  </span>
                </button>
                <div className="flex gap-2">
                  <button type="button" disabled={pending} onClick={() => toggleCategory(cat.id, true)} className="rounded-full border border-silver-200 px-3 py-1.5 text-xs font-bold hover:border-plum-300">
                    Enable all
                  </button>
                  <button type="button" disabled={pending} onClick={() => toggleCategory(cat.id, false)} className="rounded-full border border-silver-200 px-3 py-1.5 text-xs font-bold hover:border-plum-300">
                    Disable all
                  </button>
                </div>
              </div>
              {isOpen && (
                <ul className="divide-y divide-silver-100 border-t border-silver-100">
                  {items.map((s) => (
                    <ServiceRow key={s.id} s={s} enabled={!!optimistic[s.id]} onToggle={(v) => toggle(s.id, v)} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ServiceRow({ s, enabled, onToggle }: { s: Svc; enabled: boolean; onToggle: (v: boolean) => void }) {
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <li className="px-5 py-4">
      <div className="flex items-start gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={`${enabled ? "Disable" : "Enable"} ${s.name}`}
          onClick={() => onToggle(!enabled)}
          className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition ${enabled ? "bg-plum-600" : "bg-silver-300"}`}
        >
          <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${enabled ? "left-6" : "left-1"}`} />
        </button>
        <div className="min-w-0 flex-1">
          <p className={`font-semibold ${enabled ? "text-ink" : "text-muted"}`}>
            {s.name}
            {s.custom && <span className="ml-2 rounded-full bg-plum-100 px-2 py-0.5 text-[0.65rem] font-bold text-plum-800 uppercase">Custom</span>}
            {s.categories.length > 1 && <span className="ml-2 text-xs font-normal text-muted">(also in {s.categories.length - 1} other)</span>}
          </p>
          {!editing ? (
            <p className="mt-0.5 text-sm text-muted">
              {s.description}
              {s.descriptionEs && s.descriptionEs !== s.description && (
                <span className="mt-1 block text-xs text-muted/90">
                  <strong className="font-semibold">ES:</strong> {s.descriptionEs}
                </span>
              )}{" "}
              <button type="button" onClick={() => setEditing(true)} className="font-semibold text-plum-700 hover:underline">
                Edit
              </button>
            </p>
          ) : (
            <form
              action={(fd) =>
                start(async () => {
                  await saveServiceDescription(fd);
                  setEditing(false);
                  router.refresh();
                })
              }
              className="mt-2 space-y-2"
            >
              <input type="hidden" name="id" value={s.id} />
              <label className="block text-xs font-bold text-muted uppercase">English description</label>
              <textarea name="description" defaultValue={s.description} maxLength={600} className="field !min-h-20 text-sm" />
              <label className="block text-xs font-bold text-muted uppercase">Spanish description (Español)</label>
              <textarea name="descriptionEs" defaultValue={s.descriptionEs ?? ""} maxLength={600} className="field !min-h-20 text-sm" />
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
                  Save
                </button>
                <button className="btn btn-outline btn-sm" type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                {!s.custom && (s.description !== s.defaultDescription || (s.descriptionEs ?? "") !== s.defaultDescriptionEs) && (
                  <button
                    className="btn btn-outline btn-sm"
                    type="button"
                    onClick={() =>
                      start(async () => {
                        const fd = new FormData();
                        fd.set("id", s.id);
                        fd.set("description", s.defaultDescription);
                        fd.set("descriptionEs", s.defaultDescriptionEs);
                        await saveServiceDescription(fd);
                        setEditing(false);
                        router.refresh();
                      })
                    }
                  >
                    Reset to default
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
        {s.custom && (
          <button
            type="button"
            onClick={() =>
              confirm(`Delete "${s.name}"?`) &&
              start(async () => {
                await deleteCustomService(s.id);
                router.refresh();
              })
            }
            className="rounded-full p-2 text-rose-700 hover:bg-rose-50"
            aria-label={`Delete ${s.name}`}
          >
            <Icon name="trash" className="size-4" />
          </button>
        )}
      </div>
    </li>
  );
}
