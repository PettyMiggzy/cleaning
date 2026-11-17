import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CREWS, formatUSD, ADDITIONAL_PRICING } from "@/lib/pricing";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { Icon, Sparkle } from "./Icon";
import { JsonLd } from "./JsonLd";
import { PhoneLines, PrimaryCtas } from "./ui";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted">
          {all.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevronRight" className="size-3.5 text-silver-400" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-semibold text-plum-700">
                  {it.name}
                </span>
              ) : (
                <Link href={it.path} className="hover:text-plum-700">
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
export function PageHero({
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
                <span className="block font-bold text-ink">From $100/hr</span>
                <span className="text-muted">for a 2-person crew</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function PricingCards({ compact = false }: { compact?: boolean }) {
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
                Most Popular
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
            <h3 className={`mt-5 font-serif text-2xl ${featured ? "text-white" : ""}`}>{c.title}</h3>
            <p className={`mt-1 text-sm ${featured ? "text-plum-200" : "text-muted"}`}>{c.bestFor}</p>
            <p className="mt-6 flex items-end gap-1">
              <span className={`font-serif text-6xl font-semibold tracking-tight ${featured ? "text-white" : "text-ink"}`}>
                {formatUSD(c.rate)}
              </span>
              <span className={`mb-2 text-base font-semibold ${featured ? "text-plum-200" : "text-muted"}`}>/ hour</span>
            </p>
            <p className={`mt-1 text-sm font-semibold ${featured ? "text-plum-100" : "text-plum-700"}`}>
              2-hour minimum: {formatUSD(c.minimum)}
            </p>
            <div className={`my-6 h-px ${featured ? "bg-white/15" : "divider-silver"}`} />
            {!compact && (
              <ul className={`mb-7 space-y-2.5 text-[0.95rem] ${featured ? "text-plum-100" : ""}`}>
                {[
                  `Rate covers all ${c.size} cleaners`,
                  "Choose your hours (2+)",
                  "Residential or commercial",
                  "Free photo estimates",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Icon name="check" className={`mt-1 size-4 shrink-0 ${featured ? "text-plum-300" : "text-plum-600"}`} strokeWidth={2.6} />
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`/book?crew=${c.size}&hours=2`}
              className={`btn mt-auto w-full ${featured ? "btn-light" : "btn-primary"}`}
            >
              Book {c.size} Cleaners
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function AdditionalPricing() {
  return (
    <div className="silver-ring card overflow-hidden bg-white shadow-soft" style={{ borderRadius: "1.75rem" }}>
      <div className="flex items-center gap-3 border-b border-silver-100 bg-plum-50/70 px-6 py-4">
        <Icon name="layers" className="size-5 text-plum-700" />
        <h3 className="font-sans text-sm font-bold tracking-[0.15em] text-ink uppercase">Additional Pricing</h3>
      </div>
      <dl className="divide-y divide-silver-100">
        {ADDITIONAL_PRICING.map((row) => (
          <div key={row.label} className="flex flex-col justify-between gap-1 px-6 py-4 sm:flex-row sm:items-center">
            <dt className="font-semibold text-ink">{row.label}</dt>
            <dd className="font-semibold text-plum-700">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-silver-100 bg-silver-50 px-6 py-4 text-sm text-muted">
        The hourly rate covers the entire crew, not each individual cleaner. A 2-hour minimum applies to all bookings.
      </p>
    </div>
  );
}

/** Premium dark CTA band used at the end of most pages. */
export function CTASection({
  title = "Ready for a cleaner home?",
  lead = "Send us pictures for a free time estimate, or book your cleaning online in minutes.",
}: {
  title?: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="bg-plum-luxe reveal relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-white shadow-lift sm:px-12 md:py-20">
          <Sparkle className="animate-twinkle absolute top-10 left-[8%] size-6 text-plum-300" />
          <Sparkle className="animate-twinkle absolute top-[30%] right-[10%] size-4 text-white/70 [animation-delay:.8s]" />
          <Sparkle className="animate-twinkle absolute bottom-12 left-[40%] size-3 text-plum-200 [animation-delay:1.6s]" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="font-script text-4xl text-plum-200 md:text-5xl">{SITE.slogan}</p>
              <h2 className="h2 mt-3 text-white">{title}</h2>
              <p className="mt-4 max-w-xl text-lg text-plum-100">{lead}</p>
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

export function TrustStrip() {
  const items = [
    { icon: "dollar" as const, title: "Transparent Pricing", text: "Hourly crew rates, shown up front" },
    { icon: "calendar" as const, title: "Flexible Scheduling", text: "One-time or recurring service" },
    { icon: "camera" as const, title: "Free Photo Estimates", text: "Send pictures, get a time estimate" },
    { icon: "message" as const, title: "Call or Text", text: "Two lines that accept calls & texts" },
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
