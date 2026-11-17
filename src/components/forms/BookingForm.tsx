"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
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
import {
  ARRIVAL_OPTIONS,
  CONTACT_PREF_OPTIONS,
  Field,
  FREQUENCY_OPTIONS,
  FutureDateInput,
  LanguagePicker,
  OTHER_CITY,
  PROPERTY_TYPE_OPTIONS,
  SpamGuard,
  SubmitBar,
  SuccessPanel,
  useSubmit,
} from "./FormKit";
import { PhotoUploader, type PickedPhoto } from "./PhotoUploader";

export type ServiceOption = { id: string; name: string; pricing: PricingMode };
export type ServiceGroup = { label: string; options: ServiceOption[] };

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
  const { lang, t, href } = useI18n();
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
        title={t("Booking request received!", "¡Solicitud de reservación recibida!")}
        id={state.id}
        message={
          <>
            {lang === "es" ? (
              <p>
                ¡Gracias! Su solicitud fue enviada a {SITE.name}. <strong className="text-white">Esto todavía no es una cita
                confirmada</strong> — le llamaremos o le enviaremos un texto pronto para confirmar la fecha, la hora de llegada, el
                equipo y el precio estimado.
              </p>
            ) : (
              <p>
                Thank you! Your request has been sent to {SITE.name}. <strong className="text-white">This is not yet a confirmed
                appointment</strong> — we&apos;ll call or text you shortly to confirm your date, arrival time, crew and estimated price.
              </p>
            )}
          </>
        }
        onReset={() => {
          setPhotos([]);
          reset();
        }}
        resetLabel={t("Make another booking request", "Hacer otra solicitud de reservación")}
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
        <Step n={1} title={t("Choose your cleaning", "Elija su limpieza")}>
          <div className="grid gap-6">
            <Field label={t("Cleaning service", "Servicio de limpieza")} name="service" required error={errors.service}>
              <select
                id="service"
                name="service"
                className="field"
                value={service}
                onChange={(e) => setService(e.target.value)}
                aria-invalid={!!errors.service}
              >
                <option value="">{t("Select a service…", "Seleccione un servicio…")}</option>
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
                {t("Number of cleaners", "Número de profesionales")} <span className="text-plum-600">*</span>
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
                    <span className="block text-xs font-semibold text-muted sm:text-sm">{t("cleaners", "profesionales")}</span>
                    <span className="mt-1 block text-sm font-bold text-plum-700">{formatUSD(c.rate)}/hr</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">{t("The hourly rate covers the entire crew, not each cleaner.", "La tarifa por hora cubre a todo el equipo, no a cada profesional.")}</p>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={t("Estimated hours", "Horas estimadas")} name="hours" required hint={t("2-hour minimum applies to all bookings.", "Todas las reservaciones tienen un mínimo de 2 horas.")}>
                <select id="hours" name="hours" className="field" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                  {hourOptions().map((h) => (
                    <option key={h} value={h}>
                      {formatHours(h, lang)}
                    </option>
                  ))}
                </select>
              </Field>
              <fieldset>
                <legend className="field-label">{t("How often?", "¿Con qué frecuencia?")}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {FREQUENCY_OPTIONS.map(([f, fEs]) => (
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
                      {t(f, fEs)}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            {(frequency === "Weekly" || frequency === "Biweekly") && (
              <p className="chip w-fit">
                <Icon name="sparkles" className="size-4" /> {t("Weekly & biweekly discounts available upon approval", "Descuentos semanales y quincenales disponibles con aprobación")}
              </p>
            )}
            <p className="text-sm text-muted">
              {t("Not sure about crew size or hours?", "¿No está seguro del tamaño del equipo o de las horas?")}{" "}
              <Link href={href("/photo-estimate")} className="font-semibold text-plum-700 underline underline-offset-4">
                {t("Send pictures for a free estimate", "Envíe fotos para un estimado gratis")}
              </Link>{" "}
              {t("or add photos below.", "o agregue fotos abajo.")}
            </p>
          </div>
        </Step>

        <Step n={2} title={t("Preferred date & arrival time", "Fecha y hora de llegada preferidas")}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("Preferred appointment date", "Fecha preferida de la cita")} name="date" required error={errors.date}>
              <FutureDateInput id="date" name="date" aria-invalid={!!errors.date} />
            </Field>
            <Field label={t("Preferred arrival time", "Hora de llegada preferida")} name="time" required error={errors.time}>
              <select id="time" name="time" className="field" defaultValue="" aria-invalid={!!errors.time}>
                <option value="" disabled>
                  {t("Select a time window…", "Seleccione un horario…")}
                </option>
                {ARRIVAL_OPTIONS.map(([w, wEs]) => (
                  <option key={w} value={w}>
                    {t(w, wEs)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <p className="mt-4 text-sm text-muted">
            {t(
              "We'll do our best to match your preference and confirm the exact time with you.",
              "Haremos lo posible por ajustarnos a su preferencia y confirmaremos la hora exacta con usted.",
            )}
          </p>
        </Step>

        <Step n={3} title={t("Property details", "Datos de la propiedad")}>
          <div className="grid gap-6 sm:grid-cols-6">
            <Field label={t("Property address", "Dirección de la propiedad")} name="address" required error={errors.address} className="sm:col-span-6">
              <input id="address" name="address" autoComplete="street-address" className="field" placeholder={t("Street address, unit #", "Calle y número, # de unidad")} aria-invalid={!!errors.address} />
            </Field>
            <Field label={t("City", "Ciudad")} name="city" required error={errors.city} className="sm:col-span-3">
              <select id="city" name="city" className="field" defaultValue="" aria-invalid={!!errors.city}>
                <option value="" disabled>
                  {t("Select a city…", "Seleccione una ciudad…")}
                </option>
                {AREA_NAMES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
                <option value={OTHER_CITY[0]}>{t(OTHER_CITY[0], OTHER_CITY[1])}</option>
              </select>
            </Field>
            <Field label={t("ZIP code", "Código postal")} name="zip" className="sm:col-span-3">
              <input id="zip" name="zip" inputMode="numeric" autoComplete="postal-code" maxLength={10} className="field" />
            </Field>
            <Field label={t("Property type", "Tipo de propiedad")} name="propertyType" className="sm:col-span-6">
              <select id="propertyType" name="propertyType" className="field" defaultValue="">
                <option value="">{t("Select…", "Seleccione…")}</option>
                {PROPERTY_TYPE_OPTIONS.map(([p, pEs]) => (
                  <option key={p} value={p}>
                    {t(p, pEs)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("Bedrooms", "Recámaras")} name="bedrooms" className="sm:col-span-2">
              <input id="bedrooms" name="bedrooms" inputMode="numeric" className="field" placeholder={t("e.g. 3", "ej. 3")} maxLength={3} />
            </Field>
            <Field label={t("Bathrooms", "Baños")} name="bathrooms" className="sm:col-span-2">
              <input id="bathrooms" name="bathrooms" inputMode="decimal" className="field" placeholder={t("e.g. 2.5", "ej. 2.5")} maxLength={4} />
            </Field>
            <Field label={t("Approx. sq. ft.", "Pies cuadrados (aprox.)")} name="sqft" className="sm:col-span-2">
              <input id="sqft" name="sqft" inputMode="numeric" className="field" placeholder={t("e.g. 2,000", "ej. 2,000")} maxLength={7} />
            </Field>
          </div>
        </Step>

        <Step n={4} title={t("Pictures & special instructions", "Fotos e instrucciones especiales")}>
          <div className="grid gap-6">
            <PhotoUploader photos={photos} onChange={setPhotos} hint={t("Optional, but pictures help us confirm the right crew and time.", "Opcional, pero las fotos nos ayudan a confirmar el equipo y el tiempo adecuados.")} />
            <Field
              label={t("Special instructions", "Instrucciones especiales")}
              name="instructions"
              hint={t("Pets, entry details, parking, priority rooms, products to avoid…", "Mascotas, cómo entrar, estacionamiento, cuartos prioritarios, productos que debemos evitar…")}
            >
              <textarea id="instructions" name="instructions" className="field" maxLength={3000} />
            </Field>
          </div>
        </Step>

        <Step n={5} title={t("Your contact information", "Su información de contacto")}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("Full name", "Nombre completo")} name="name" required error={errors.name} className="sm:col-span-2">
              <input id="name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
            </Field>
            <Field label={t("Phone number", "Número de teléfono")} name="phone" required error={errors.phone}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!errors.phone} />
            </Field>
            <Field label={t("Email address", "Correo electrónico")} name="email" required error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} />
            </Field>
            <fieldset className="sm:col-span-2">
              <legend className="field-label">{t("Best way to reach you", "La mejor forma de contactarle")}</legend>
              <div className="flex flex-wrap gap-2">
                {CONTACT_PREF_OPTIONS.map(([m, mEs], i) => (
                  <label key={m} className="cursor-pointer">
                    <input type="radio" name="contactPref" value={m} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="block rounded-full border-2 border-silver-200 px-5 py-2 text-sm font-semibold text-ink transition-all peer-checked:border-plum-600 peer-checked:bg-plum-50 peer-checked:text-plum-800 peer-focus-visible:ring-2 peer-focus-visible:ring-plum-400">
                      {t(m, mEs)}
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
              {mode === "custom" ? t("Hourly ref.", "Ref. por hora") : t("Est. price", "Precio est.")} · {crew} {t("cleaners", "profesionales")} · {hours} hrs
            </span>
            <span className="block font-serif text-xl font-semibold whitespace-nowrap">
              {est.low === est.high ? formatUSD(est.low) : `${formatUSD(est.low)}–${formatUSD(est.high)}`}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-xs font-bold">
            {t("Review", "Ver")} <Icon name="chevronDown" className="size-4" />
          </span>
        </button>
      </div>

      {/* Summary */}
      <aside ref={asideRef} className="scroll-mt-28 lg:sticky lg:top-32">
        <div className="overflow-hidden rounded-[2rem] shadow-lift">
          <div className="bg-plum-luxe p-6 text-white sm:p-7">
            <p className="text-xs font-bold tracking-[0.2em] text-plum-200 uppercase">
              {mode === "custom" ? t("Hourly reference", "Referencia por hora") : t("Estimated price", "Precio estimado")}
            </p>
            <p className="mt-2 font-serif text-4xl font-semibold" aria-live="polite">
              {est.low === est.high ? formatUSD(est.low) : `${formatUSD(est.low)}–${formatUSD(est.high)}`}
            </p>
            <dl className="mt-5 space-y-2 text-sm text-plum-100">
              <div className="flex justify-between gap-3">
                <dt>{t("Service", "Servicio")}</dt>
                <dd className="text-right font-semibold text-white">{selected?.name ?? t("Not selected", "Sin seleccionar")}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{t("Crew", "Equipo")}</dt>
                <dd className="font-semibold text-white">{crew} {t("cleaners", "profesionales")} · {formatUSD(est.rate)}/hr</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{t("Time", "Tiempo")}</dt>
                <dd className="font-semibold text-white">{formatHours(hours, lang)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{t("Frequency", "Frecuencia")}</dt>
                <dd className="font-semibold text-white">{t(frequency, FREQUENCY_OPTIONS.find(([f]) => f === frequency)?.[1] ?? frequency)}</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-4 bg-white p-6 sm:p-7">
            <p className="text-sm leading-relaxed text-muted">
              {mode === "deep" && t("Deep cleaning includes 25–30% additional. ", "La limpieza profunda incluye 25–30% adicional. ")}
              {mode === "custom" &&
                t(
                  "This service is quoted as a custom estimate — the hourly figure is for reference. ",
                  "Este servicio se cotiza como un estimado personalizado — la cifra por hora es solo de referencia. ",
                )}
              {lang === "es" ? (
                <>
                  Los precios y tiempos son estimados hasta que se revisen y aprueben. Al enviar, usted manda una{" "}
                  <strong>solicitud de reservación</strong>; nos comunicaremos con usted para confirmar antes de programar algo.
                </>
              ) : (
                <>
                  Prices and times are estimates until reviewed and approved. Submitting sends a <strong>booking request</strong>;
                  we&apos;ll contact you to confirm before anything is scheduled.
                </>
              )}
            </p>
            <label className="flex items-start gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                name="agree"
                value="yes"
                className="mt-1 size-5 shrink-0 accent-plum-700"
                aria-invalid={!!errors.agree}
              />
              <span>
                {t(
                  `I understand this is a request and my appointment is confirmed once ${SITE.name} approves it.`,
                  `Entiendo que esto es una solicitud y que mi cita se confirma cuando ${SITE.name} la apruebe.`,
                )}
              </span>
            </label>
            {errors.agree && (
              <p className="text-sm font-semibold text-[#b0324d]" role="alert">
                {errors.agree}
              </p>
            )}
            <SubmitBar state={state} label={t("Submit Booking Request", "Enviar solicitud de reservación")} icon="calendar" />
            <p className="text-center text-xs text-muted">
              {t("Prefer to talk? Call or text", "¿Prefiere hablar? Llame o envíe un texto al")}{" "}
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
