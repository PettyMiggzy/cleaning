"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/client";
import { SITE } from "@/lib/site";
import { Icon, Sparkle } from "../Icon";
import type { PickedPhoto } from "./PhotoUploader";

export type FieldErrors = Record<string, string>;

export function Field({
  label,
  name,
  required,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div className={className}>
      <label htmlFor={name} className="field-label">
        {label} {required ? <span className="text-plum-600">*</span> : <span className="font-normal text-muted">{t("(optional)", "(opcional)")}</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-sm font-semibold text-[#b0324d]" role="alert" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Date input that can't pick today or earlier (min is set after hydration). */
export function FutureDateInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.min = tomorrow();
  }, []);
  return <input ref={ref} type="date" className="field" {...props} />;
}

/** English / Español preference so the team replies in the customer's language. */
export function LanguagePicker({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  return (
    <fieldset className={className}>
      <legend className="field-label">
        {t("Preferred language", "Idioma preferido")}
        {lang === "en" && <span className="font-normal text-muted"> · Idioma preferido</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {["English", "Español"].map((m) => (
          <label key={m} className="cursor-pointer">
            <input
              type="radio"
              name="language"
              value={m}
              defaultChecked={m === (lang === "es" ? "Español" : "English")}
              className="peer sr-only"
            />
            <span className="flex min-h-10 items-center rounded-full border-2 border-silver-200 px-5 text-sm font-semibold text-ink transition-all peer-checked:border-plum-600 peer-checked:bg-plum-50 peer-checked:text-plum-800 peer-focus-visible:ring-2 peer-focus-visible:ring-plum-400">
              {m}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Invisible anti-spam fields: a honeypot and a render timestamp. */
export function SpamGuard() {
  const tRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (tRef.current) tRef.current.value = String(Date.now());
  }, []);
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
      <input ref={tRef} type="hidden" name="_t" defaultValue="" />
    </div>
  );
}

type State =
  | { status: "idle" }
  | { status: "submitting"; progress: number }
  | { status: "success"; id: string; message: string }
  | { status: "error"; message: string; errors?: FieldErrors };

export function useSubmit(type: string) {
  const { lang, t } = useI18n();
  const [state, setState] = useState<State>({ status: "idle" });

  function submit(form: HTMLFormElement, photos: PickedPhoto[] = [], extra: Record<string, string> = {}) {
    const fd = new FormData(form);
    fd.delete("photos");
    fd.set("type", type);
    fd.set("lang", lang);
    for (const [k, v] of Object.entries(extra)) fd.set(k, v);
    photos.forEach((p) => fd.append("photos", p.file, p.file.name));

    setState({ status: "submitting", progress: 0 });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/submit");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setState({ status: "submitting", progress: Math.round((e.loaded / e.total) * 100) });
    };
    xhr.onload = () => {
      const body = (xhr.response ?? {}) as { ok?: boolean; id?: string; message?: string; errors?: FieldErrors };
      if (xhr.status >= 200 && xhr.status < 300 && body.ok) {
        setState({ status: "success", id: body.id ?? "", message: body.message ?? "" });
        window.scrollTo({ top: Math.max(0, form.getBoundingClientRect().top + window.scrollY - 140), behavior: "smooth" });
      } else {
        setState({
          status: "error",
          message:
            body.message ||
            (xhr.status === 413
              ? t(
                  "Your photos are too large to upload. Please remove a few, or text them to us.",
                  "Sus fotos son demasiado grandes para subirlas. Quite algunas o envíenoslas por texto.",
                )
              : t(
                  "Something went wrong. Please try again, or call or text us.",
                  "Algo salió mal. Inténtelo de nuevo, o llámenos o envíenos un texto.",
                )),
          errors: body.errors,
        });
        if (body.errors) {
          const first = Object.keys(body.errors)[0];
          const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
          el?.focus();
        }
      }
    };
    xhr.onerror = () =>
      setState({
        status: "error",
        message: t(
          "We couldn't reach the server. Check your connection and try again, or call or text us.",
          "No pudimos conectar con el servidor. Revise su conexión e inténtelo de nuevo, o llámenos o envíenos un texto.",
        ),
      });
    xhr.send(fd);
  }

  return {
    state,
    submit,
    reset: () => setState({ status: "idle" }),
    errors: state.status === "error" ? (state.errors ?? {}) : ({} as FieldErrors),
  };
}

export function SubmitBar({
  state,
  label,
  icon = "send",
}: {
  state: ReturnType<typeof useSubmit>["state"];
  label: string;
  icon?: "send" | "calendar" | "camera";
}) {
  const { t } = useI18n();
  const busy = state.status === "submitting";
  return (
    <div className="space-y-3">
      {state.status === "error" && (
        <div role="alert" className="flex gap-3 rounded-2xl border border-[#f1c8d1] bg-[#fdf3f5] p-4 text-[0.95rem] text-[#8d2a40]">
          <Icon name="x" className="mt-0.5 size-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}
      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy}>
        {busy ? (
          <>
            <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            {state.progress > 0 && state.progress < 100 ? `${t("Uploading…", "Subiendo…")} ${state.progress}%` : t("Sending…", "Enviando…")}
          </>
        ) : (
          <>
            <Icon name={icon} className="size-5" /> {label}
          </>
        )}
      </button>
      {busy && state.progress > 0 && (
        <div className="h-1.5 overflow-hidden rounded-full bg-plum-100">
          <div className="h-full rounded-full bg-plum-600 transition-all" style={{ width: `${state.progress}%` }} />
        </div>
      )}
    </div>
  );
}

export function SuccessPanel({
  title,
  message,
  id,
  onReset,
  resetLabel,
}: {
  title: string;
  message: ReactNode;
  id?: string;
  onReset?: () => void;
  resetLabel?: string;
}) {
  const { t, href } = useI18n();
  return (
    <div className="animate-rise relative overflow-hidden rounded-[2rem] bg-plum-luxe p-7 text-center text-white sm:p-10" role="status">
      <Sparkle className="animate-twinkle absolute top-6 left-8 size-5 text-plum-300" />
      <Sparkle className="animate-twinkle absolute right-10 bottom-10 size-4 text-white/70 [animation-delay:1s]" />
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-white text-plum-700 shadow-glow">
        <Icon name="check" className="size-8" strokeWidth={2.6} />
      </span>
      <h3 className="mt-5 font-serif text-3xl text-white">{title}</h3>
      <div className="mx-auto mt-3 max-w-lg text-plum-100">{message}</div>
      {id && <p className="mt-4 text-xs tracking-[0.18em] text-plum-300 uppercase">{t("Reference", "Referencia")} #{id.slice(-8).toUpperCase()}</p>}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a href={SITE.phones.primary.tel} className="btn btn-light">
          <Icon name="phone" className="size-5" /> {t("Call", "Llamar al")} {SITE.phones.primary.display}
        </a>
        <a href={SITE.phones.primary.sms} className="btn btn-ghost-light">
          <Icon name="message" className="size-5" /> {t("Text Us", "Envíenos un texto")}
        </a>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm">
        {onReset && (
          <button type="button" onClick={onReset} className="font-semibold text-plum-200 underline underline-offset-4">
            {resetLabel ?? t("Send another request", "Enviar otra solicitud")}
          </button>
        )}
        <Link href={href("/")} className="font-semibold text-plum-200 underline underline-offset-4">
          {t("Back to home", "Volver al inicio")}
        </Link>
      </div>
    </div>
  );
}

export {
  ARRIVAL_OPTIONS,
  CONTACT_PREF_OPTIONS,
  CONTACT_TOPIC_OPTIONS,
  FREQUENCY_OPTIONS,
  OTHER_CITY,
  PROPERTY_TYPE_OPTIONS,
} from "@/lib/form-options";
