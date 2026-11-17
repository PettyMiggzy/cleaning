"use client";

import { useI18n } from "@/i18n/client";
import { CONTACT_TOPIC_OPTIONS, Field, LanguagePicker, SpamGuard, SubmitBar, SuccessPanel, useSubmit } from "./FormKit";

export function ContactForm() {
  const { t } = useI18n();
  const { state, submit, reset, errors } = useSubmit("contact");

  if (state.status === "success") {
    return (
      <SuccessPanel
        title={t("Message sent!", "¡Mensaje enviado!")}
        id={state.id}
        message={<p>{t("Thanks for reaching out. We'll get back to you as soon as possible.", "Gracias por escribirnos. Le responderemos lo antes posible.")}</p>}
        onReset={reset}
        resetLabel={t("Send another message", "Enviar otro mensaje")}
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget);
      }}
      className="silver-ring card relative bg-white p-5 shadow-lift sm:p-9"
      style={{ borderRadius: "2rem" }}
    >
      <SpamGuard />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("Full name", "Nombre completo")} name="name" required error={errors.name} className="sm:col-span-2">
          <input id="name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
        </Field>
        <Field label={t("Phone number", "Número de teléfono")} name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!errors.phone} />
        </Field>
        <Field label={t("Email address", "Correo electrónico")} name="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} />
        </Field>
        <Field label={t("Topic", "Tema")} name="topic" className="sm:col-span-2">
          <select id="topic" name="topic" className="field" defaultValue={CONTACT_TOPIC_OPTIONS[0][0]}>
            {CONTACT_TOPIC_OPTIONS.map(([v, vEs]) => (
              <option key={v} value={v}>
                {t(v, vEs)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("Message", "Mensaje")} name="message" required error={errors.message} className="sm:col-span-2">
          <textarea id="message" name="message" className="field" maxLength={4000} aria-invalid={!!errors.message} />
        </Field>
        <LanguagePicker className="sm:col-span-2" />
      </div>
      <p className="mt-4 text-sm text-muted">{t("Please include a phone number or email so we can reply.", "Incluya un número de teléfono o correo electrónico para que podamos responderle.")}</p>
      <div className="mt-5">
        <SubmitBar state={state} label={t("Send Message", "Enviar mensaje")} />
      </div>
    </form>
  );
}
