"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { Icon } from "./Icon";

export function BeforeAfter({ before, after, alt }: { before?: string; after?: string; alt: string }) {
  const { t } = useI18n();
  const [pos, setPos] = useState(50);

  if (!before || !after) {
    const src = before || after;
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-silver-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wider text-plum-800 uppercase">
          {before ? t("Before", "Antes") : t("After", "Después")}
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] touch-pan-y overflow-hidden rounded-[1.5rem] bg-silver-100 select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={`${t("After", "Después")}: ${alt}`} loading="lazy" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={`${t("Before", "Antes")}: ${alt}`} loading="lazy" className="size-full object-cover" />
      </div>
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur">
        {t("Before", "Antes")}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-plum-700/90 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur">
        {t("After", "Después")}
      </span>
      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_14px_rgba(0,0,0,.35)]" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-plum-700 shadow-lift">
          <Icon name="chevronRight" className="absolute left-[3px] size-4 rotate-180" strokeWidth={2.6} />
          <Icon name="chevronRight" className="absolute right-[3px] size-4" strokeWidth={2.6} />
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t("Drag to compare before and after", "Arrastre para comparar el antes y el después")}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
