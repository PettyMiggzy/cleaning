"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { AREA_NAMES } from "@/lib/areas";
import { Icon } from "../Icon";
import { Field, SpamGuard, SubmitBar, SuccessPanel, useSubmit } from "./FormKit";

export function ReviewForm() {
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { state, submit, reset, errors } = useSubmit("review");

  if (state.status === "success") {
    return (
      <SuccessPanel
        title={t("Thank you for your review!", "¡Gracias por su reseña!")}
        message={<p>{t("We truly appreciate it. Reviews are published after a quick check by our team.", "Se lo agradecemos mucho. Las reseñas se publican después de una revisión rápida de nuestro equipo.")}</p>}
        onReset={() => {
          setRating(0);
          reset();
        }}
        resetLabel={t("Write another review", "Escribir otra reseña")}
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget, [], { rating: String(rating) });
      }}
      className="silver-ring card relative bg-white p-5 shadow-lift sm:p-9"
      style={{ borderRadius: "2rem" }}
    >
      <SpamGuard />
      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset className="sm:col-span-2">
          <legend className="field-label">
            {t("Your rating", "Su calificación")} <span className="text-plum-600">*</span>
          </legend>
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                className="rounded-lg p-1 text-plum-500 transition-transform hover:scale-110"
                aria-label={t(`${n} star${n > 1 ? "s" : ""}`, `${n} estrella${n > 1 ? "s" : ""}`)}
                aria-pressed={rating === n}
              >
                <Icon name="star" className="size-9" fill={(hover || rating) >= n ? "currentColor" : "none"} strokeWidth={1.4} />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm font-semibold text-[#b0324d]" role="alert">
              {errors.rating}
            </p>
          )}
        </fieldset>
        <Field label={t("Your name", "Su nombre")} name="name" required error={errors.name} hint={t("First name and last initial is fine.", "Su nombre y la inicial del apellido está bien.")}>
          <input id="name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
        </Field>
        <Field label={t("City", "Ciudad")} name="city">
          <select id="city" name="city" className="field" defaultValue="">
            <option value="">{t("Select…", "Seleccione…")}</option>
            {AREA_NAMES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label={t("Service you received", "Servicio que recibió")} name="service" className="sm:col-span-2">
          <input id="service" name="service" className="field" placeholder={t("e.g. Deep cleaning, move-out cleaning", "ej. Limpieza profunda, limpieza de mudanza")} maxLength={120} />
        </Field>
        <Field label={t("Your review", "Su reseña")} name="text" required error={errors.text} className="sm:col-span-2">
          <textarea id="text" name="text" className="field" maxLength={2000} aria-invalid={!!errors.text} />
        </Field>
        <Field label={t("Phone or email", "Teléfono o correo electrónico")} name="email" hint={t("Private — only used to verify you were a customer.", "Privado — solo se usa para verificar que fue cliente.")} className="sm:col-span-2">
          <input id="email" name="email" className="field" maxLength={160} />
        </Field>
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm text-ink-soft">
        <input type="checkbox" name="agree" value="yes" className="mt-1 size-5 shrink-0 accent-plum-700" />
        <span>{t("I confirm this review is about my own genuine experience with Emili's Cleaning Co.", "Confirmo que esta reseña es sobre mi experiencia real con Emili's Cleaning Co.")}</span>
      </label>
      {errors.agree && (
        <p className="mt-1 text-sm font-semibold text-[#b0324d]" role="alert">
          {errors.agree}
        </p>
      )}
      <div className="mt-5">
        <SubmitBar state={state} label={t("Submit Review", "Enviar reseña")} />
      </div>
    </form>
  );
}
