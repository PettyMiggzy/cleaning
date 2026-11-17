"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { AREA_NAMES } from "@/lib/areas";
import { SITE } from "@/lib/site";
import type { ServiceGroup } from "./BookingForm";
import { Field, FutureDateInput, LanguagePicker, OTHER_CITY, PROPERTY_TYPE_OPTIONS, SpamGuard, SubmitBar, SuccessPanel, useSubmit } from "./FormKit";
import { PhotoUploader, type PickedPhoto } from "./PhotoUploader";

export function EstimateForm({ groups, compact = false }: { groups: ServiceGroup[]; compact?: boolean }) {
  const { t } = useI18n();
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const { state, submit, reset, errors } = useSubmit("estimate");


  if (state.status === "success") {
    return (
      <SuccessPanel
        title={t("Pictures received!", "¡Fotos recibidas!")}
        id={state.id}
        message={
          <p>
            {t(
              "Thank you! Our team will review your photos, recommend the right cleaning crew, estimate how long the job will take and send you an estimated price before scheduling. Times and prices are estimates until reviewed and approved.",
              "¡Gracias! Nuestro equipo revisará sus fotos, le recomendará el equipo de limpieza adecuado, calculará cuánto tiempo tomará el trabajo y le enviará un precio estimado antes de programar. Los tiempos y precios son estimados hasta que se revisen y aprueben.",
            )}
          </p>
        }
        onReset={() => {
          setPhotos([]);
          reset();
        }}
        resetLabel={t("Send more pictures", "Enviar más fotos")}
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
      className={`silver-ring card relative bg-white shadow-lift ${compact ? "p-5 sm:p-8" : "p-5 sm:p-10"}`}
      style={{ borderRadius: "2rem" }}
    >
      <SpamGuard />
      <div className="grid gap-5 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <PhotoUploader
            photos={photos}
            onChange={setPhotos}
            required
            error={errors.photos}
            label={t("Pictures of the areas to clean", "Fotos de las áreas a limpiar")}
            hint={t(
              "Kitchens, bathrooms, bedrooms, living areas — a few wide shots of each room are perfect.",
              "Cocinas, baños, recámaras, áreas de estar — unas cuantas fotos amplias de cada cuarto son perfectas.",
            )}
          />
        </div>

        <Field label={t("Full name", "Nombre completo")} name="name" required error={errors.name} className="sm:col-span-6">
          <input id="name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
        </Field>
        <Field label={t("Phone number", "Número de teléfono")} name="phone" required error={errors.phone} className="sm:col-span-3">
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!errors.phone} />
        </Field>
        <Field label={t("Email address", "Correo electrónico")} name="email" required error={errors.email} className="sm:col-span-3">
          <input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} />
        </Field>
        <Field label={t("Property address", "Dirección de la propiedad")} name="address" required error={errors.address} className="sm:col-span-6">
          <input id="address" name="address" autoComplete="street-address" className="field" aria-invalid={!!errors.address} />
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
        <Field label={t("Property type", "Tipo de propiedad")} name="propertyType" required error={errors.propertyType} className="sm:col-span-3">
          <select id="propertyType" name="propertyType" className="field" defaultValue="" aria-invalid={!!errors.propertyType}>
            <option value="" disabled>
              {t("Select…", "Seleccione…")}
            </option>
            {PROPERTY_TYPE_OPTIONS.map(([p, pEs]) => (
              <option key={p} value={p}>
                {t(p, pEs)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("Cleaning service requested", "Servicio de limpieza solicitado")} name="service" required error={errors.service} className="sm:col-span-6">
          <select id="service" name="service" className="field" defaultValue="" aria-invalid={!!errors.service}>
            <option value="" disabled>
              {t("Select a service…", "Seleccione un servicio…")}
            </option>
            {groups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={`${g.label}-${o.id}`} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="not-sure">{t("Not sure — please recommend", "No estoy seguro — por favor recomienden")}</option>
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
        <Field label={t("Preferred appointment date", "Fecha preferida de la cita")} name="date" className="sm:col-span-6">
          <FutureDateInput id="date" name="date" />
        </Field>
        <Field
          label={t("Special instructions", "Instrucciones especiales")}
          name="instructions"
          hint={t(
            "Priority rooms, pets, condition notes, or anything we should know.",
            "Cuartos prioritarios, mascotas, notas sobre el estado del lugar o cualquier cosa que debamos saber.",
          )}
          className="sm:col-span-6"
        >
          <textarea id="instructions" name="instructions" className="field" maxLength={3000} />
        </Field>
        <LanguagePicker className="sm:col-span-6" />
      </div>

      <div className="mt-7 space-y-4">
        <p className="rounded-2xl bg-plum-50 p-4 text-sm leading-relaxed text-ink-soft">
          {t(
            <>
              <strong className="text-plum-800">Please note:</strong> completion times and pricing are estimates until our team
              reviews your request and you approve them.
            </>,
            <>
              <strong className="text-plum-800">Importante:</strong> los tiempos de realización y los precios son estimados hasta que
              nuestro equipo revise su solicitud y usted los apruebe.
            </>,
          )}
        </p>
        <SubmitBar state={state} label={t("Send Pictures for My Free Estimate", "Enviar fotos para mi estimado gratis")} icon="camera" />
        <p className="text-center text-sm text-muted">
          {t("Prefer texting? Send pictures to", "¿Prefiere enviar un texto? Envíe sus fotos al")}{" "}
          <a href={SITE.phones.primary.sms} className="font-semibold text-plum-700">
            {SITE.phones.primary.display}
          </a>{" "}
          {t("or", "o al")}{" "}
          <a href={SITE.phones.secondary.sms} className="font-semibold text-plum-700">
            {SITE.phones.secondary.display}
          </a>
        </p>
      </div>
    </form>
  );
}
