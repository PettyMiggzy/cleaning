"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CREWS,
  estimatePrice,
  formatHours,
  formatUSD,
  HOUR_STEP,
  MAX_HOURS,
  MIN_HOURS,
  type CrewSize,
  type PricingMode,
} from "@/lib/pricing";
import { useI18n } from "@/i18n/client";
import { Icon, Sparkle } from "./Icon";

const TYPES: { id: string; label: [string, string]; mode: PricingMode; note: [string, string] }[] = [
  { id: "standard", label: ["Standard Cleaning", "Limpieza estándar"], mode: "hourly", note: ["Hourly crew rate", "Tarifa por hora del equipo"] },
  { id: "deep", label: ["Deep Cleaning", "Limpieza profunda"], mode: "deep", note: ["+25–30% additional", "+25–30% adicional"] },
  { id: "move", label: ["Move-In / Move-Out", "Mudanza (entrada / salida)"], mode: "custom", note: ["Custom estimate", "Estimado personalizado"] },
  { id: "commercial", label: ["Commercial", "Comercial"], mode: "custom", note: ["Custom estimate", "Estimado personalizado"] },
];

const SERVICE_FOR_TYPE: Record<string, string> = {
  standard: "house-cleaning",
  deep: "deep-house-cleaning",
  move: "move-out-cleaning",
  commercial: "commercial-cleaning",
};

export function PriceCalculator({ dark = false }: { dark?: boolean }) {
  const { lang, t, href } = useI18n();
  const [crew, setCrew] = useState<CrewSize>(2);
  const [hours, setHours] = useState(3);
  const [type, setType] = useState("standard");
  const tp = TYPES.find((x) => x.id === type)!;
  const typeLabel = t(tp.label[0], tp.label[1]);
  const est = estimatePrice(crew, hours, tp.mode);
  const fill = ((hours - MIN_HOURS) / (MAX_HOURS - MIN_HOURS)) * 100;
  const atMinimum = est.base === CREWS.find((c) => c.size === crew)!.minimum && hours <= MIN_HOURS;

  const bookHref = href(`/book?service=${SERVICE_FOR_TYPE[type]}&crew=${crew}&hours=${hours}`);

  return (
    <div className="silver-ring card relative overflow-hidden bg-white shadow-lift" style={{ borderRadius: "2rem" }}>
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        {/* Controls */}
        <div className="space-y-8 p-6 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-plum-100 text-plum-700">
              <Icon name="calculator" />
            </span>
            <div>
              <h3 className="font-serif text-2xl">{t("Instant Price Estimator", "Calculadora de precio al instante")}</h3>
              <p className="text-sm text-muted">{t("Choose your crew and hours — 2-hour minimum applies.", "Elija su equipo y las horas — aplica un mínimo de 2 horas.")}</p>
            </div>
          </div>

          <fieldset>
            <legend className="field-label">{t("1. Type of cleaning", "1. Tipo de limpieza")}</legend>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setType(x.id)}
                  aria-pressed={type === x.id}
                  className={`rounded-2xl border-2 px-3 py-3 text-left transition-all ${
                    type === x.id
                      ? "border-plum-600 bg-plum-50 shadow-soft"
                      : "border-silver-200 bg-white hover:border-plum-300"
                  }`}
                >
                  <span className="block text-[0.95rem] font-bold text-ink">{t(x.label[0], x.label[1])}</span>
                  <span className="block text-xs text-muted">{t(x.note[0], x.note[1])}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">{t("2. Crew size", "2. Tamaño del equipo")}</legend>
            <div className="grid grid-cols-3 gap-2">
              {CREWS.map((c) => (
                <button
                  key={c.size}
                  type="button"
                  onClick={() => setCrew(c.size)}
                  aria-pressed={crew === c.size}
                  className={`rounded-2xl border-2 px-2 py-3 text-center transition-all ${
                    crew === c.size
                      ? "border-plum-600 bg-plum-50 shadow-soft"
                      : "border-silver-200 bg-white hover:border-plum-300"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1 text-plum-700">
                    {Array.from({ length: c.size }).map((_, i) => (
                      <Icon key={i} name="users" className="hidden size-3.5 first:inline" />
                    ))}
                  </span>
                  <span className="block font-serif text-2xl font-semibold text-ink">{c.size}</span>
                  <span className="block text-xs font-semibold text-muted">{t("cleaners", "profesionales")}</span>
                  <span className="mt-1 block text-sm font-bold text-plum-700">{formatUSD(c.rate)}/hr</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <div className="flex items-end justify-between">
              <label htmlFor="calc-hours" className="field-label mb-0">
                {t("3. Estimated hours", "3. Horas estimadas")}
              </label>
              <span className="font-serif text-2xl font-semibold text-ink">{formatHours(hours, lang)}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                className="silver-ring card grid size-11 shrink-0 place-items-center rounded-full text-plum-700 disabled:opacity-40"
                onClick={() => setHours((h) => Math.max(MIN_HOURS, h - HOUR_STEP))}
                disabled={hours <= MIN_HOURS}
                aria-label={t("Fewer hours", "Menos horas")}
              >
                <span className="text-2xl leading-none">−</span>
              </button>
              <input
                id="calc-hours"
                type="range"
                className="range"
                min={MIN_HOURS}
                max={MAX_HOURS}
                step={HOUR_STEP}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                style={{ ["--fill" as string]: `${fill}%` }}
              />
              <button
                type="button"
                className="silver-ring card grid size-11 shrink-0 place-items-center rounded-full text-plum-700 disabled:opacity-40"
                onClick={() => setHours((h) => Math.min(MAX_HOURS, h + HOUR_STEP))}
                disabled={hours >= MAX_HOURS}
                aria-label={t("More hours", "Más horas")}
              >
                <Icon name="plus" className="size-5" />
              </button>
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-muted">
              <span>{t(`${MIN_HOURS} hr minimum`, `Mínimo ${MIN_HOURS} hr`)}</span>
              <span>{MAX_HOURS}+ hrs</span>
            </div>
            <p className="mt-3 text-sm text-muted">
              {t("Not sure how long it will take?", "¿No está seguro de cuánto tardará?")}{" "}
              <Link href={href("/photo-estimate")} className="font-semibold text-plum-700 underline underline-offset-4">
                {t("Send us pictures", "Envíenos fotos")}
              </Link>{" "}
              {t("for a free time estimate.", "para un estimado de tiempo gratis.")}
            </p>
          </div>
        </div>

        {/* Result */}
        <div
          className={`relative flex flex-col justify-between overflow-hidden p-6 sm:p-9 ${
            dark ? "bg-plum-luxe text-white" : "bg-plum-luxe text-white"
          }`}
        >
          <Sparkle className="animate-twinkle absolute top-6 right-8 size-6 text-plum-300" />
          <Sparkle className="animate-twinkle absolute right-20 bottom-24 size-3 text-white/60 [animation-delay:1.2s]" />
          <div aria-live="polite">
            <p className="text-xs font-bold tracking-[0.2em] text-plum-200 uppercase">
              {tp.mode === "custom" ? t("Hourly reference", "Referencia por hora") : t("Your estimated price", "Su precio estimado")}
            </p>
            <p className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
              {est.low === est.high ? (
                formatUSD(est.low)
              ) : (
                <>
                  {formatUSD(est.low)}
                  <span className="mx-2 text-3xl text-plum-300">–</span>
                  {formatUSD(est.high)}
                </>
              )}
            </p>
            <dl className="mt-6 space-y-2 text-[0.95rem] text-plum-100">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                <dt>{t("Crew", "Equipo")}</dt>
                <dd className="font-semibold text-white">{t(`${crew} professional cleaners`, `${crew} profesionales de limpieza`)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                <dt>{t("Rate (entire crew)", "Tarifa (todo el equipo)")}</dt>
                <dd className="font-semibold text-white">{formatUSD(est.rate)}/hr</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                <dt>{t("Time", "Tiempo")}</dt>
                <dd className="font-semibold text-white">{formatHours(est.hours, lang)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                <dt>Base</dt>
                <dd className="font-semibold text-white">{formatUSD(est.base)}</dd>
              </div>
              {tp.mode === "deep" && (
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <dt>{t("Deep cleaning", "Limpieza profunda")}</dt>
                  <dd className="font-semibold text-white">+25–30%</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-plum-200">
              {tp.mode === "custom"
                ? t(
                    `${typeLabel} is quoted as a custom estimate. The hourly figure above is for reference — send pictures for an accurate quote.`,
                    `${typeLabel} se cotiza como un estimado personalizado. La cifra por hora es solo de referencia — envíe fotos para una cotización precisa.`,
                  )
                : atMinimum
                  ? t("2-hour minimum applied. ", "Se aplicó el mínimo de 2 horas. ")
                  : ""}
              {tp.mode !== "custom" && t("This is an estimate until we review and approve your request.", "Este es un estimado hasta que revisemos y aprobemos su solicitud.")}
            </p>
          </div>
          <div className="mt-8 grid gap-3">
            <Link href={bookHref} className="btn btn-light w-full">
              <Icon name="calendar" className="size-5" /> {t("Book This Cleaning", "Reservar esta limpieza")}
            </Link>
            <Link href={href("/photo-estimate")} className="btn btn-ghost-light w-full">
              <Icon name="camera" className="size-5" /> {t("Get a Free Photo Estimate", "Estimado gratis con fotos")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
