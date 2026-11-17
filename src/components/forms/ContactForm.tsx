"use client";

import { Field, SpamGuard, SubmitBar, SuccessPanel, useSubmit } from "./FormKit";

const TOPICS = ["General question", "Pricing question", "Recurring cleaning", "Commercial cleaning", "Existing appointment", "Other"];

export function ContactForm() {
  const { state, submit, reset, errors } = useSubmit("contact");

  if (state.status === "success") {
    return (
      <SuccessPanel
        title="Message sent!"
        id={state.id}
        message={<p>Thanks for reaching out. We&apos;ll get back to you as soon as possible.</p>}
        onReset={reset}
        resetLabel="Send another message"
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
        <Field label="Full name" name="name" required error={errors.name} className="sm:col-span-2">
          <input id="name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Phone number" name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!errors.phone} />
        </Field>
        <Field label="Email address" name="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Topic" name="topic" className="sm:col-span-2">
          <select id="topic" name="topic" className="field" defaultValue={TOPICS[0]}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Message" name="message" required error={errors.message} className="sm:col-span-2">
          <textarea id="message" name="message" className="field" maxLength={4000} aria-invalid={!!errors.message} />
        </Field>
      </div>
      <p className="mt-4 text-sm text-muted">Please include a phone number or email so we can reply.</p>
      <div className="mt-5">
        <SubmitBar state={state} label="Send Message" />
      </div>
    </form>
  );
}
