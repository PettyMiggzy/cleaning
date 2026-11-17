import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ADDITIONAL_PRICING, CREWS, formatUSD } from "@/lib/pricing";
import { breadcrumbSchema } from "@/lib/schema";
import { COPY } from "@/lib/site";
import { getI18n } from "@/i18n/server";
import { Icon, Sparkle } from "./Icon";
import { JsonLd } from "./JsonLd";
import { PhoneLines, PrimaryCtas } from "./ui";

export async function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const { t, href } = await getI18n();
  const all = [{ name: t("Home", "Inicio"), path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all.map((i) => ({ name: i.name, path: href(i.path) })))} />
      <nav aria-label={t("Breadcrumb", "Ruta de navegación")} className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted">
          {all.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevronRight" className="size-3.5 text-silver-400" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-semibold text-plum-700">
                  {it.name}
                </span>
              ) : (
                <Link href={href(it.path)} className="hover:text-plum-700">
                  {it.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Elegant inner-page hero. */
export async function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "",
  children,
}: {
  crumbs: { name: string; path: string }[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  const { t } = await getI18n();
  return (
    <section className="bg-lavender relative overflow-hidden">
      <Sparkle className="animate-twinkle absolute top-16 right-[8%] hidden size-6 text-plum-300 md:block" />
      <Sparkle className="animate-twinkle absolute bottom-10 left-[6%] hidden size-4 text-plum-300 [animation-delay:1.4s] md:block" />
      <div
        className={`container-x relative grid items-center gap-10 py-12 md:py-16 ${image ? "lg:grid-cols-[1.15fr_1fr] lg:gap-16" : ""}`}
      >
        <div className={image ? "" : "mx-auto max-w-3xl text-center"}>
          <div className={`animate-fade ${image ? "" : "flex justify-center"}`}>
            <Breadcrumbs items={crumbs} />
          </div>
          {eyebrow && (
            <p className={`eyebrow animate-rise mt-7 ${image ? "" : "justify-center"}`}>
              <Sparkle className="size-3 text-plum-400" />
              {eyebrow}
            </p>
          )}
          <h1 className="display animate-rise delay-1 mt-4">{title}</h1>
          {lead && <div className="lead animate-rise delay-2 mt-5">{lead}</div>}
          {children && <div className="animate-rise delay-3 mt-8">{children}</div>}
        </div>
        {image && (
          <div className="animate-rise delay-2 relative mx-auto w-full max-w-xl">
            <div className="silver-frame rounded-[2.5rem]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.1rem]">
                <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="silver-ring card animate-float absolute -bottom-6 -left-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift sm:-left-8">
              <span className="grid size-10 place-items-center rounded-full bg-plum-100 text-plum-700">
                <Icon name="sparkles" className="size-5" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-bold text-ink">{t("From $100/hr", "Desde $100/hora")}</span>
                <span className="text-muted">{t("for a 2-person crew", "para un equipo de 2")}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export async function PricingCards({ compact = false }: { compact?: boolean }) {
  const { lang, t, href } = await getI18n();
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {CREWS.map((c, i) => {
        const featured = i === 1;
        return (
          <article
            key={c.size}
            className={`card card-hover reveal relative flex flex-col overflow-hidden p-7 sm:p-8 ${
              featured ? "bg-plum-luxe text-white shadow-lift md:-translate-y-3" : "silver-ring bg-white shadow-soft"
            }`}
            style={{ borderRadius: "2rem" }}
          >
            {featured && (
              <span className="absolute top-5 right-5 rounded-full bg-white/15 px-3 py-1 text-[0.68rem] font-bold tracking-[0.15em] text-white uppercase backdrop-blur">
                {t("Most Popular", "Más popular")}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: c.size }).map((_, k) => (
                <span
                  key={k}
                  className={`grid size-9 place-items-center rounded-full ${featured ? "bg-white/15 text-white" : "bg-plum-100 text-plum-700"}`}
                >
                  <Icon name="users" className="size-4" />
                </span>
              ))}
            </div>
            <h3 className={`mt-5 font-serif text-2xl ${featured ? "text-white" : ""}`}>{t(c.title, c.titleEs)}</h3>
            <p className={`mt-1 text-sm ${featured ? "text-plum-200" : "text-muted"}`}>{t(c.bestFor, c.bestForEs)}</p>
            <p className="mt-6 flex items-end gap-1">
              <span className={`font-serif text-6xl font-semibold tracking-tight ${featured ? "text-white" : "text-ink"}`}>
                {formatUSD(c.rate)}
              </span>
              <span className={`mb-2 text-base font-semibold ${featured ? "text-plum-200" : "text-muted"}`}>{t("/ hour", "/ hora")}</span>
            </p>
            <p className={`mt-1 text-sm font-semibold ${featured ? "text-plum-100" : "text-plum-700"}`}>
              {t("2-hour minimum:", "Mínimo de 2 horas:")} {formatUSD(c.minimum)}
            </p>
            <div className={`my-6 h-px ${featured ? "bg-white/15" : "divider-silver"}`} />
            {!compact && (
              <ul className={`mb-7 space-y-2.5 text-[0.95rem] ${featured ? "text-plum-100" : ""}`}>
                {[
                  t(`Rate covers all ${c.size} cleaners`, `La tarifa cubre a los ${c.size} profesionales`),
                  t("Choose your hours (2+)", "Elija sus horas (2 o más)"),
                  t("Residential or commercial", "Residencial o comercial"),
                  t("Free photo estimates", "Estimados gratis con fotos"),
                ].map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <Icon name="check" className={`mt-1 size-4 shrink-0 ${featured ? "text-plum-300" : "text-plum-600"}`} strokeWidth={2.6} />
                    {line}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={href(`/book?crew=${c.size}&hours=2`)}
              className={`btn mt-auto w-full ${featured ? "btn-light" : "btn-primary"}`}
            >
              {lang === "es" ? `Reservar ${c.size} profesionales` : `Book ${c.size} Cleaners`}
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export async function AdditionalPricing() {
  const { t } = await getI18n();
  return (
    <div className="silver-ring card overflow-hidden bg-white shadow-soft" style={{ borderRadius: "1.75rem" }}>
      <div className="flex items-center gap-3 border-b border-silver-100 bg-plum-50/70 px-6 py-4">
        <Icon name="layers" className="size-5 text-plum-700" />
        <h3 className="font-sans text-sm font-bold tracking-[0.15em] text-ink uppercase">{t("Additional Pricing", "Precios adicionales")}</h3>
      </div>
      <dl className="divide-y divide-silver-100">
        {ADDITIONAL_PRICING.map((row) => (
          <div key={row.label} className="flex flex-col justify-between gap-1 px-6 py-4 sm:flex-row sm:items-center">
            <dt className="font-semibold text-ink">{t(row.label, row.labelEs)}</dt>
            <dd className="font-semibold text-plum-700">{t(row.value, row.valueEs)}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-silver-100 bg-silver-50 px-6 py-4 text-sm text-muted">
        {t(
          "The hourly rate covers the entire crew, not each individual cleaner. A 2-hour minimum applies to all bookings.",
          "La tarifa por hora cubre a todo el equipo, no a cada profesional por separado. Todas las reservaciones tienen un mínimo de 2 horas.",
        )}
      </p>
    </div>
  );
}

/** Premium dark CTA band used at the end of most pages. */
export async function CTASection({ title, lead }: { title?: ReactNode; lead?: ReactNode }) {
  const { lang, t } = await getI18n();
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="bg-plum-luxe reveal relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-white shadow-lift sm:px-12 md:py-20">
          <Sparkle className="animate-twinkle absolute top-10 left-[8%] size-6 text-plum-300" />
          <Sparkle className="animate-twinkle absolute top-[30%] right-[10%] size-4 text-white/70 [animation-delay:.8s]" />
          <Sparkle className="animate-twinkle absolute bottom-12 left-[40%] size-3 text-plum-200 [animation-delay:1.6s]" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="font-script text-4xl text-plum-200 md:text-5xl">{COPY[lang].slogan}</p>
              <h2 className="h2 mt-3 text-white">{title ?? t("Ready for a cleaner home?", "¿Listo para un hogar más limpio?")}</h2>
              <p className="mt-4 max-w-xl text-lg text-plum-100">
                {lead ??
                  t(
                    "Send us pictures for a free time estimate, or book your cleaning online in minutes.",
                    "Envíenos fotos para un estimado de tiempo gratis, o reserve su limpieza en línea en minutos.",
                  )}
              </p>
              <PrimaryCtas light className="mt-8" />
            </div>
            <PhoneLines dark />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f) => (
        <details key={f.q} className="silver-ring card group bg-white shadow-soft open:shadow-lift" style={{ borderRadius: "1.25rem" }}>
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-5 sm:px-6">
            <span className="font-serif text-lg font-semibold text-ink sm:text-xl">{f.q}</span>
            <span className="acc-icon grid size-9 shrink-0 place-items-center rounded-full bg-plum-100 text-plum-700 transition-transform duration-300">
              <Icon name="plus" className="size-4" strokeWidth={2.4} />
            </span>
          </summary>
          <div className="px-5 pb-6 text-[1.02rem] leading-relaxed text-ink-soft sm:px-6">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export async function TrustStrip() {
  const { t } = await getI18n();
  const items = [
    { icon: "dollar" as const, title: t("Transparent Pricing", "Precios transparentes"), text: t("Hourly crew rates, shown up front", "Tarifas por hora del equipo, claras desde el inicio") },
    { icon: "calendar" as const, title: t("Flexible Scheduling", "Horarios flexibles"), text: t("One-time or recurring service", "Servicio de una vez o recurrente") },
    { icon: "camera" as const, title: t("Free Photo Estimates", "Estimados gratis con fotos"), text: t("Send pictures, get a time estimate", "Envíe fotos y reciba un estimado de tiempo") },
    { icon: "message" as const, title: t("English & Spanish", "Español e inglés"), text: t("Hablamos español — call or text", "Hablamos español — llame o envíe texto") },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.title} className="reveal flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className="silver-ring card grid size-14 shrink-0 place-items-center rounded-2xl text-plum-700 shadow-soft">
            <Icon name={it.icon} className="size-6" />
          </span>
          <span>
            <span className="block font-bold text-ink">{it.title}</span>
            <span className="block text-sm text-muted">{it.text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
