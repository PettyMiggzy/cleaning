"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AREA_NAMES } from "@/lib/areas";
import {
  CREWS,
  clampHours,
  estimatePrice,
  formatHours,
  formatUSD,
  hourOptions,
  type CrewSize,
  type PricingMode,
} from "@/lib/pricing";
import { SITE } from "@/lib/site";
import { Icon } from "../Icon";
import { ARRIVAL_WINDOWS, Field, FutureDateInput, LanguagePicker, PROPERTY_TYPES, SpamGuard, SubmitBar, SuccessPanel, useSubmit } from "./FormKit";
import { PhotoUploader, type PickedPhoto } from "./PhotoUploader";

export type ServiceOption = { id: string; name: string; pricing: PricingMode };
export type ServiceGroup = { label: string; options: ServiceOption[] };

const FREQUENCIES = ["One-time", "Weekly", "Biweekly", "Monthly"];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="silver-ring card bg-white p-5 shadow-soft sm:p-8" aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="flex items-center gap-3 font-serif text-2xl">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-plum-500 to-plum-800 font-sans text-sm font-bold text-white shadow-glow">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function BookingForm({ groups }: { groups: ServiceGroup[] }) {
  const params = useSearchParams();
  const all = useMemo(() => groups.flatMap((g) => g.options), [groups]);
  const initialService = all.some((s) => s.id === params.get("service")) ? params.get("service")! : "";
  const initialCrew = ([2, 3, 4] as const).find((c) => String(c) === params.get("crew")) ?? 2;
  const initialHours = params.get("hours") ? clampHours(Number(params.get("hours"))) : 3;

  const [service, setService] = useState(initialService);
  const [crew, setCrew] = useState<CrewSize>(initialCrew);
  const [hours, setHours] = useState(initialHours);
  const [frequency, setFrequency] = useState("One-time");
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const { state, submit, reset, errors } = useSubmit("booking");
  const asideRef = useRef<HTMLElement>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);

  // On phones the price summary sits below the form, so show a compact sticky estimate until it scrolls into view.
  useEffect(() => {
    const el = asideRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setSummaryVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [state.status]);


  const selected = all.find((s) => s.id === service);
  const mode: PricingMode = selected?.pricing ?? "hourly";
  const est = estimatePrice(crew, hours, mode);

  if (state.status === "success") {
    return (
      <SuccessPanel
        title="Booking request received!"
        id={state.id}
        message={
          <>
            <p>
              Thank you! Your request has been sent to {SITE.name}. <strong className="text-white">This is not yet a confirmed
              appointment</strong> — we&apos;ll call or text you shortly to confirm your date, arrival time, crew and estimated price.
            </p>
          </>
        }
        onReset={() => {
          setPhotos([]);
          reset();
        }}
        resetLabel="Make another booking request"
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget, photos);
      }}
      className="relative grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start"
    >
      <SpamGuard />
      <div className="space-y-6">
        <Step n={1} title="Choose your cleaning">
          <div className="grid gap-6">
            <Field label="Cleaning service" name="service" required error={errors.service}>
              <select
                id="service"
                name="service"
                className="field"
                value={service}
                onChange={(e) => setService(e.target.value)}
                aria-invalid={!!errors.service}
              >
                <option value="">Select a service…</option>
                {groups.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.options.map((o) => (
                      <option key={`${g.label}-${o.id}`} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>

            <fieldset>
              <legend className="field-label">
                Number of cleaners <span className="text-plum-600">*</span>
              </legend>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {CREWS.map((c) => (
                  <label
                    key={c.size}
                    className={`cursor-pointer rounded-2xl border-2 p-3 text-center transition-all sm:p-4 ${
                      crew === c.size ? "border-plum-600 bg-plum-50 shadow-soft" : "border-silver-200 hover:border-plum-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="crew"
                      value={c.size}
                      checked={crew === c.size}
                      onChange={() => setCrew(c.size)}
                      className="sr-only"
                    />
                    <span className="block font-serif text-3xl font-semibold text-ink">{c.size}</span>
                    <span className="block text-xs font-semibold text-muted sm:text-sm">cleaners</span>
                    <span className="mt-1 block text-sm font-bold text-plum-700">{formatUSD(c.rate)}/hr</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">The hourly rate covers the entire crew, not each cleaner.</p>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Estimated hours" name="hours" required hint="2-hour minimum applies to all bookings.">
                <select id="hours" name="hours" className="field" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                  {hourOptions().map((h) => (
                    <option key={h} value={h}>
                      {formatHours(h)}
                    </option>
                  ))}
                </select>
              </Field>
              <fieldset>
                <legend className="field-label">How often?</legend>
                <div className="grid grid-cols-2 gap-2">
                  {FREQUENCIES.map((f) => (
                    <label
                      key={f}
                      className={`cursor-pointer rounded-xl border-2 px-3 py-2.5 text-center text-sm font-semibold transition-all ${
                        frequency === f ? "border-plum-600 bg-plum-50 text-plum-800" : "border-silver-200 text-ink hover:border-plum-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={f}
                        checked={frequency === f}
                        onChange={() => setFrequency(f)}
                        className="sr-only"
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            {(frequency === "Weekly" || frequency === "Biweekly") && (
              <p className="chip w-fit">
                <Icon name="sparkles" className="size-4" /> Weekly &amp; biweekly discounts available upon approval
              </p>
            )}
            <p className="text-sm text-muted">
              Not sure about crew size or hours?{" "}
              <Link href="/photo-estimate" className="font-semibold text-plum-700 underline underline-offset-4">
                Send pictures for a free estimate
              </Link>{" "}
              or add photos below.
            </p>
          </div>
        </Step>

        <Step n={2} title="Preferred date & arrival time">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Preferred appointment date" name="date" required error={errors.date}>
              <FutureDateInput id="date" name="date" aria-invalid={!!errors.date} />
            </Field>
            <Field label="Preferred arrival time" name="time" required error={errors.time}>
              <select id="time" name="time" className="field" defaultValue="" aria-invalid={!!errors.time}>
                <option value="" disabled>
                  Select a time window…
                </option>
                {ARRIVAL_WINDOWS.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </Field>
          </div>
          <p className="mt-4 text-sm text-muted">
            We&apos;ll do our best to match your preference and confirm the exact time with you.
          </p>
        </Step>

        <Step n={3} title="Property details">
          <div className="grid gap-6 sm:grid-cols-6">
            <Field label="Property address" name="address" required error={errors.address} className="sm:col-span-6">
              <input id="address" name="address" autoComplete="street-address" className="field" placeholder="Street address, unit #" aria-invalid={!!errors.address} />
            </Field>
            <Field label="City" name="city" required error={errors.city} className="sm:col-span-3">
              <select id="city" name="city" className="field" defaultValue="" aria-invalid={!!errors.city}>
                <option value="" disabled>
                  Select a city…
                </option>
                {AREA_NAMES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
                <option>Other nearby area</option>
              </select>
            </Field>
            <Field label="ZIP code" name="zip" className="sm:col-span-3">
              <input id="zip" name="zip" inputMode="numeric" autoComplete="postal-code" maxLength={10} className="field" />
            </Field>
            <Field label="Property type" name="propertyType" className="sm:col-span-6">
              <select id="propertyType" name="propertyType" className="field" defaultValue="">
                <option value="">Select…</option>
                {PROPERTY_TYPES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Bedrooms" name="bedrooms" className="sm:col-span-2">
              <input id="bedrooms" name="bedrooms" inputMode="numeric" className="field" placeholder="e.g. 3" maxLength={3} />
            </Field>
            <Field label="Bathrooms" name="bathrooms" className="sm:col-span-2">
              <input id="bathrooms" name="bathrooms" inputMode="decimal" className="field" placeholder="e.g. 2.5" maxLength={4} />
            </Field>
            <Field label="Approx. sq. ft." name="sqft" className="sm:col-span-2">
              <input id="sqft" name="sqft" inputMode="numeric" className="field" placeholder="e.g. 2,000" maxLength={7} />
            </Field>
          </div>
        </Step>

        <Step n={4} title="Pictures & special instructions">
          <div className="grid gap-6">
            <PhotoUploader photos={photos} onChange={setPhotos} hint="Optional, but pictures help us confirm the right crew and time." />
            <Field label="Special instructions" name="instructions" hint="Pets, entry details, parking, priority rooms, products to avoid…">
              <textarea id="instructions" name="instructions" className="field" maxLength={3000} />
            </Field>
          </div>
        </Step>

        <Step n={5} title="Your contact information">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Full name" name="name" required error={errors.name} className="sm:col-span-2">
              <input id="name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
            </Field>
            <Field label="Phone number" name="phone" required error={errors.phone}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!errors.phone} />
            </Field>
            <Field label="Email address" name="email" required error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} />
            </Field>
            <fieldset className="sm:col-span-2">
              <legend className="field-label">Best way to reach you</legend>
              <div className="flex flex-wrap gap-2">
                {["Text", "Call", "Email"].map((m, i) => (
                  <label key={m} className="cursor-pointer">
                    <input type="radio" name="contactPref" value={m} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="block rounded-full border-2 border-silver-200 px-5 py-2 text-sm font-semibold text-ink transition-all peer-checked:border-plum-600 peer-checked:bg-plum-50 peer-checked:text-plum-800 peer-focus-visible:ring-2 peer-focus-visible:ring-plum-400">
                      {m}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <LanguagePicker className="sm:col-span-2" />
          </div>
        </Step>
      </div>

      {/* Compact sticky estimate (phones only) */}
      <div
        className={`fixed inset-x-3 z-30 transition-all duration-300 lg:hidden ${
          summaryVisible ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
        }`}
        style={{ bottom: "calc(5.25rem + env(safe-area-inset-bottom))" }}
        aria-hidden={summaryVisible}
      >
        <button
          type="button"
          tabIndex={summaryVisible ? -1 : 0}
          onClick={() => asideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="flex w-full items-center justify-between gap-3 rounded-2xl bg-plum-950/95 px-4 py-3 text-left text-white shadow-lift backdrop-blur"
        >
          <span className="min-w-0">
            <span className="block truncate text-[0.62rem] font-bold tracking-[0.14em] text-plum-300 uppercase">
              {mode === "custom" ? "Hourly ref." : "Est. price"} · {crew} cleaners · {hours} hrs
            </span>
            <span className="block font-serif text-xl font-semibold whitespace-nowrap">
              {est.low === est.high ? formatUSD(est.low) : `${formatUSD(est.low)}–${formatUSD(est.high)}`}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-xs font-bold">
            Review <Icon name="chevronDown" className="size-4" />
          </span>
        </button>
      </div>

      {/* Summary */}
      <aside ref={asideRef} className="scroll-mt-28 lg:sticky lg:top-32">
        <div className="overflow-hidden rounded-[2rem] shadow-lift">
          <div className="bg-plum-luxe p-6 text-white sm:p-7">
            <p className="text-xs font-bold tracking-[0.2em] text-plum-200 uppercase">
              {mode === "custom" ? "Hourly reference" : "Estimated price"}
            </p>
            <p className="mt-2 font-serif text-4xl font-semibold" aria-live="polite">
              {est.low === est.high ? formatUSD(est.low) : `${formatUSD(est.low)}–${formatUSD(est.high)}`}
            </p>
            <dl className="mt-5 space-y-2 text-sm text-plum-100">
              <div className="flex justify-between gap-3">
                <dt>Service</dt>
                <dd className="text-right font-semibold text-white">{selected?.name ?? "Not selected"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Crew</dt>
                <dd className="font-semibold text-white">{crew} cleaners · {formatUSD(est.rate)}/hr</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Time</dt>
                <dd className="font-semibold text-white">{formatHours(hours)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Frequency</dt>
                <dd className="font-semibold text-white">{frequency}</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-4 bg-white p-6 sm:p-7">
            <p className="text-sm leading-relaxed text-muted">
              {mode === "deep" && "Deep cleaning includes 25–30% additional. "}
              {mode === "custom" && "This service is quoted as a custom estimate — the hourly figure is for reference. "}
              Prices and times are estimates until reviewed and approved. Submitting sends a <strong>booking request</strong>;
              we&apos;ll contact you to confirm before anything is scheduled.
            </p>
            <label className="flex items-start gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                name="agree"
                value="yes"
                className="mt-1 size-5 shrink-0 accent-plum-700"
                aria-invalid={!!errors.agree}
              />
              <span>I understand this is a request and my appointment is confirmed once {SITE.name} approves it.</span>
            </label>
            {errors.agree && (
              <p className="text-sm font-semibold text-[#b0324d]" role="alert">
                {errors.agree}
              </p>
            )}
            <SubmitBar state={state} label="Submit Booking Request" icon="calendar" />
            <p className="text-center text-xs text-muted">
              Prefer to talk? Call or text{" "}
              <a href={SITE.phones.primary.tel} className="font-semibold text-plum-700">
                {SITE.phones.primary.display}
              </a>
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}
