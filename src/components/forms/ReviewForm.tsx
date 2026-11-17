"use client";

import { useState } from "react";
import { AREA_NAMES } from "@/lib/areas";
import { Icon } from "../Icon";
import { Field, SpamGuard, SubmitBar, SuccessPanel, useSubmit } from "./FormKit";

export function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { state, submit, reset, errors } = useSubmit("review");

  if (state.status === "success") {
    return (
      <SuccessPanel
        title="Thank you for your review!"
        message={<p>We truly appreciate it. Reviews are published after a quick check by our team.</p>}
        onReset={() => {
          setRating(0);
          reset();
        }}
        resetLabel="Write another review"
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
            Your rating <span className="text-plum-600">*</span>
          </legend>
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                className="rounded-lg p-1 text-plum-500 transition-transform hover:scale-110"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
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
        <Field label="Your name" name="name" required error={errors.name} hint="First name and last initial is fine.">
          <input id="name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
        </Field>
        <Field label="City" name="city">
          <select id="city" name="city" className="field" defaultValue="">
            <option value="">Select…</option>
            {AREA_NAMES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Service you received" name="service" className="sm:col-span-2">
          <input id="service" name="service" className="field" placeholder="e.g. Deep cleaning, move-out cleaning" maxLength={120} />
        </Field>
        <Field label="Your review" name="text" required error={errors.text} className="sm:col-span-2">
          <textarea id="text" name="text" className="field" maxLength={2000} aria-invalid={!!errors.text} />
        </Field>
        <Field label="Phone or email" name="email" hint="Private — only used to verify you were a customer." className="sm:col-span-2">
          <input id="email" name="email" className="field" maxLength={160} />
        </Field>
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm text-ink-soft">
        <input type="checkbox" name="agree" value="yes" className="mt-1 size-5 shrink-0 accent-plum-700" />
        <span>I confirm this review is about my own genuine experience with Emili&apos;s Cleaning Co.</span>
      </label>
      {errors.agree && (
        <p className="mt-1 text-sm font-semibold text-[#b0324d]" role="alert">
          {errors.agree}
        </p>
      )}
      <div className="mt-5">
        <SubmitBar state={state} label="Submit Review" />
      </div>
    </form>
  );
}
