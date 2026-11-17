"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/client";
import { Icon } from "./Icon";

export type ExplorerGroup = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  pricing: string;
  services: { id: string; name: string; description: string }[];
};

const PRICING_LABEL: Record<string, [string, string]> = {
  hourly: ["Hourly crew rate", "Tarifa por hora del equipo"],
  deep: ["Hourly + 25–30%", "Por hora + 25–30%"],
  custom: ["Custom estimate", "Estimado personalizado"],
};

export function ServicesExplorer({ groups }: { groups: ExplorerGroup[] }) {
  const { t, lang } = useI18n();
  const [active, setActive] = useState(groups[0]?.id ?? "");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      if (groups.some((g) => g.id === h)) setActive(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [groups]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return null;
    const seen = new Set<string>();
    return groups.flatMap((g) =>
      g.services
        .filter((s) => (s.name + " " + s.description).toLowerCase().includes(q))
        .filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true)))
        .map((s) => ({ ...s, group: g.name })),
    );
  }, [q, groups]);

  const group = groups.find((g) => g.id === active) ?? groups[0];
  if (!group) return null;

  return (
    <div>
      <div className="relative mx-auto max-w-xl">
        <Icon name="search" className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-plum-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Search services — e.g. oven, baseboards, Airbnb…", "Buscar servicios — ej. horno, zoclos, Airbnb…")}
          className="field !rounded-full pl-13 shadow-soft"
          aria-label={t("Search cleaning services", "Buscar servicios de limpieza")}
        />
      </div>

      {results ? (
        <div className="mt-10">
          <p className="mb-5 text-center text-muted">
            {lang === "es"
              ? `${results.length} ${results.length === 1 ? "servicio encontrado" : "servicios encontrados"} para “${query}”`
              : `${results.length} service${results.length === 1 ? "" : "s"} found for “${query}”`}
          </p>
          <ServiceGrid services={results} />
        </div>
      ) : (
        <>
          <div role="tablist" aria-label={t("Service categories", "Categorías de servicios")} className="mt-10 flex gap-2 overflow-x-auto pb-3 lg:flex-wrap lg:justify-center">
            {groups.map((g) => (
              <button
                key={g.id}
                role="tab"
                id={`tab-${g.id}`}
                aria-selected={g.id === group.id}
                aria-controls={`panel-${g.id}`}
                onClick={() => {
                  setActive(g.id);
                  history.replaceState(null, "", `#${g.id}`);
                }}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                  g.id === group.id
                    ? "bg-gradient-to-br from-plum-600 to-plum-800 text-white shadow-glow"
                    : "silver-ring card text-ink hover:text-plum-700"
                }`}
              >
                {g.name}
                <span className={`ml-2 text-xs ${g.id === group.id ? "text-plum-200" : "text-muted"}`}>{g.services.length}</span>
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`panel-${group.id}`} aria-labelledby={`tab-${group.id}`} className="mt-8">
            <div className="silver-ring card mb-8 grid overflow-hidden bg-white shadow-soft md:grid-cols-[1fr_1.4fr]" style={{ borderRadius: "2rem" }}>
              <div className="relative min-h-56">
                <Image src={group.image} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
              </div>
              <div className="p-7 sm:p-10">
                <p className="eyebrow">{group.tagline}</p>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">{group.name}</h2>
                <p className="mt-3 text-ink-soft">{group.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="chip">
                    <Icon name="dollar" className="size-4" /> {t(PRICING_LABEL[group.pricing][0], PRICING_LABEL[group.pricing][1])}
                  </span>
                  <span className="chip">
                    <Icon name="layers" className="size-4" /> {group.services.length} {t("services", "servicios")}
                  </span>
                </div>
              </div>
            </div>
            <ServiceGrid services={group.services} />
          </div>
        </>
      )}
    </div>
  );
}

function ServiceGrid({ services }: { services: { id: string; name: string; description: string; group?: string }[] }) {
  const { t, href } = useI18n();
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <li key={s.id} className="silver-ring card card-hover flex flex-col bg-white p-6 shadow-soft">
          {s.group && <p className="text-xs font-bold tracking-[0.15em] text-plum-600 uppercase">{s.group}</p>}
          <h3 className="mt-1 flex items-start gap-2 font-serif text-xl">
            <Icon name="sparkles" className="mt-1 size-4 shrink-0 text-plum-500" />
            {s.name}
          </h3>
          <p className="mt-2 flex-1 text-[0.97rem] leading-relaxed text-ink-soft">{s.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={href(`/book?service=${s.id}`)} className="btn btn-primary btn-sm">
              {t("Get a Quote", "Pedir cotización")}
            </Link>
            <Link href={href("/photo-estimate")} className="btn btn-outline btn-sm">
              <Icon name="camera" className="size-4" /> {t("Photo Estimate", "Estimado con fotos")}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
