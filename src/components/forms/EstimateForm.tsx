"use client";

import { useState } from "react";
import { AREA_NAMES } from "@/lib/areas";
import { SITE } from "@/lib/site";
import type { ServiceGroup } from "./BookingForm";
import { Field, FutureDateInput, LanguagePicker, PROPERTY_TYPES, SpamGuard, SubmitBar, SuccessPanel, useSubmit } from "./FormKit";
import { PhotoUploader, type PickedPhoto } from "./PhotoUploader";

export function EstimateForm({ groups, compact = false }: { groups: ServiceGroup[]; compact?: boolean }) {
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const { state, submit, reset, errors } = useSubmit("estimate");


  if (state.status === "success") {
    return (
      <SuccessPanel
        title="Pictures received!"
        id={state.id}
        message={
          <p>
            Thank you! Our team will review your photos, recommend the right cleaning crew, estimate how long the job will take
            and send you an estimated price before scheduling. Times and prices are estimates until reviewed and approved.
          </p>
        }
        onReset={() => {
          setPhotos([]);
          reset();
        }}
        resetLabel="Send more pictures"
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
            label="Pictures of the areas to clean"
            hint="Kitchens, bathrooms, bedrooms, living areas — a few wide shots of each room are perfect."
          />
        </div>

        <Field label="Full name" name="name" required error={errors.name} className="sm:col-span-6">
          <input id="name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Phone number" name="phone" required error={errors.phone} className="sm:col-span-3">
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!errors.phone} />
        </Field>
        <Field label="Email address" name="email" required error={errors.email} className="sm:col-span-3">
          <input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Property address" name="address" required error={errors.address} className="sm:col-span-6">
          <input id="address" name="address" autoComplete="street-address" className="field" aria-invalid={!!errors.address} />
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
        <Field label="Property type" name="propertyType" required error={errors.propertyType} className="sm:col-span-3">
          <select id="propertyType" name="propertyType" className="field" defaultValue="" aria-invalid={!!errors.propertyType}>
            <option value="" disabled>
              Select…
            </option>
            {PROPERTY_TYPES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Cleaning service requested" name="service" required error={errors.service} className="sm:col-span-6">
          <select id="service" name="service" className="field" defaultValue="" aria-invalid={!!errors.service}>
            <option value="" disabled>
              Select a service…
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
            <option value="not-sure">Not sure — please recommend</option>
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
        <Field label="Preferred appointment date" name="date" className="sm:col-span-6">
          <FutureDateInput id="date" name="date" />
        </Field>
        <Field
          label="Special instructions"
          name="instructions"
          hint="Priority rooms, pets, condition notes, or anything we should know."
          className="sm:col-span-6"
        >
          <textarea id="instructions" name="instructions" className="field" maxLength={3000} />
        </Field>
        <LanguagePicker className="sm:col-span-6" />
      </div>

      <div className="mt-7 space-y-4">
        <p className="rounded-2xl bg-plum-50 p-4 text-sm leading-relaxed text-ink-soft">
          <strong className="text-plum-800">Please note:</strong> completion times and pricing are estimates until our team
          reviews your request and you approve them.
        </p>
        <SubmitBar state={state} label="Send Pictures for My Free Estimate" icon="camera" />
        <p className="text-center text-sm text-muted">
          Prefer texting? Send pictures to{" "}
          <a href={SITE.phones.primary.sms} className="font-semibold text-plum-700">
            {SITE.phones.primary.display}
          </a>{" "}
          or{" "}
          <a href={SITE.phones.secondary.sms} className="font-semibold text-plum-700">
            {SITE.phones.secondary.display}
          </a>
        </p>
      </div>
    </form>
  );
}
