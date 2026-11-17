"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { Review } from "@/lib/store/types";
import { useI18n } from "@/i18n/client";
import { Icon } from "./Icon";

export function GoogleG({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

/**
 * Layout samples used ONLY on the private preview link (?preview=reviews) so the business owner can see
 * how the section will look. They are never rendered for normal visitors or search engines.
 */
const PREVIEW_REVIEWS: Review[] = [
  { id: "p1", name: "Jessica R.", location: "Spring, TX", rating: 5, source: "Google", date: "", published: true, createdAt: "", service: "Deep Cleaning", text: "Emili and her team did an amazing deep clean before my in-laws came to visit. Baseboards, ceiling fans, the shower glass — everything sparkled. Booking was so easy, I just texted pictures and had a price the same day." },
  { id: "p2", name: "Marcus T.", location: "The Woodlands, TX", rating: 5, source: "Google", date: "", published: true, createdAt: "", service: "Move-Out Cleaning", text: "Hired them for a move-out clean on our rental. The house looked better than when we moved in. Super professional, on time and the pricing was exactly what they quoted." },
  { id: "p3", name: "Ana L.", location: "Klein, TX", rating: 5, source: "Google", date: "", published: true, createdAt: "", service: "Biweekly Cleaning", text: "We've been using Emili's every other week and I honestly don't know how we lived without them. The team is friendly, careful with our things and great with our dogs." },
  { id: "p4", name: "Brittany W.", location: "Tomball, TX", rating: 5, source: "Google", date: "", published: true, createdAt: "", service: "House Cleaning", text: "Love that the hourly price covers the whole crew — no surprises. Three cleaners had our 4-bedroom done in a few hours. Kitchen and bathrooms were spotless!" },
  { id: "p5", name: "David P.", location: "Cypress, TX", rating: 5, source: "Google", date: "", published: true, createdAt: "", service: "Office Cleaning", text: "They clean our small office after hours and do a fantastic job. Communication by text is quick and easy. Highly recommend for any business." },
  { id: "p6", name: "Sofia M.", location: "Kingwood, TX", rating: 5, source: "Google", date: "", published: true, createdAt: "", service: "Apartment Cleaning", text: "Sent photos of my apartment and got a quick estimate. The crew was sweet, detail-oriented and left everything smelling fresh. A cleaner home, a happier me!" },
];
const PREVIEW_ES: Record<string, { text: string; service: string }> = {
  p1: {
    service: "Limpieza profunda",
    text: "Emili y su equipo hicieron una limpieza profunda increíble antes de que llegaran mis suegros. Zoclos, ventiladores de techo, el vidrio de la ducha — todo brillaba. Reservar fue muy fácil: solo envié fotos por texto y ese mismo día tenía un precio.",
  },
  p2: {
    service: "Limpieza de mudanza (salida)",
    text: "Los contraté para una limpieza de salida en nuestra casa de renta. Quedó mejor que cuando nos mudamos. Muy profesionales, puntuales y el precio fue exactamente el que cotizaron.",
  },
  p3: {
    service: "Limpieza quincenal",
    text: "Llevamos tiempo usando a Emili's cada dos semanas y sinceramente no sé cómo vivíamos sin ellos. El equipo es amable, cuidadoso con nuestras cosas y muy bueno con nuestros perros.",
  },
  p4: {
    service: "Limpieza de casas",
    text: "Me encanta que la tarifa por hora cubra a todo el equipo — sin sorpresas. Tres profesionales terminaron nuestra casa de 4 recámaras en unas pocas horas. ¡La cocina y los baños quedaron impecables!",
  },
  p5: {
    service: "Limpieza de oficinas",
    text: "Limpian nuestra oficina pequeña después del horario de trabajo y hacen un trabajo fantástico. La comunicación por texto es rápida y fácil. Los recomiendo ampliamente para cualquier negocio.",
  },
  p6: {
    service: "Limpieza de apartamentos",
    text: "Envié fotos de mi apartamento y recibí un estimado rápido. El equipo fue amable, detallista y dejó todo con olor fresco. ¡Un hogar más limpio, una vida más feliz!",
  },
};
const PREVIEW_WHEN: Record<"en" | "es", string[]> = {
  en: ["1 week ago", "2 weeks ago", "3 weeks ago", "a month ago", "a month ago", "2 months ago"],
  es: ["hace 1 semana", "hace 2 semanas", "hace 3 semanas", "hace un mes", "hace un mes", "hace 2 meses"],
};

function subscribe() {
  return () => {};
}
function usePreview() {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get("preview") === "reviews",
    () => false,
  );
}

function when(r: Review, i: number, preview: boolean, lang: "en" | "es") {
  if (preview) return PREVIEW_WHEN[lang][i % PREVIEW_WHEN[lang].length];
  const [y, m, d] = r.date.split("-").map(Number);
  if (!y || !m) return "";
  return new Date(Date.UTC(y, m - 1, d || 1)).toLocaleDateString(lang === "es" ? "es-US" : "en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function GoogleReviews({
  reviews,
  googleReviewUrl,
  limit,
  showWriteLink = true,
}: {
  reviews: Review[];
  googleReviewUrl?: string;
  limit?: number;
  showWriteLink?: boolean;
}) {
  const { lang, t, href } = useI18n();
  const preview = usePreview() && reviews.length === 0;
  const samples = lang === "es" ? PREVIEW_REVIEWS.map((r) => ({ ...r, ...PREVIEW_ES[r.id] })) : PREVIEW_REVIEWS;
  const list = (preview ? samples : reviews).slice(0, limit ?? 99);
  const count = list.length;
  const avg = preview ? 5 : reviews.reduce((n, r) => n + r.rating, 0) / Math.max(1, reviews.length);
  const leaveHref = googleReviewUrl || href("/reviews#write-a-review");

  return (
    <div>
      {/* Rating summary bar */}
      <div className="silver-ring card mx-auto flex max-w-3xl flex-col items-center justify-between gap-5 bg-white px-6 py-5 shadow-soft sm:flex-row" style={{ borderRadius: "1.5rem" }}>
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-white shadow-soft ring-1 ring-silver-200">
            <GoogleG className="size-8" />
          </span>
          <div>
            <p className="font-sans text-sm font-bold tracking-wide text-ink">{t("Google Reviews", "Reseñas de Google")}</p>
            {list.length > 0 ? (
              <p className="flex items-center gap-2">
                <span className="font-serif text-2xl font-semibold text-ink">{avg.toFixed(1)}</span>
                <span className="flex text-[#FBBC04]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon key={i} name="star" className="size-5" fill={i <= Math.round(avg) ? "currentColor" : "none"} strokeWidth={1.2} />
                  ))}
                </span>
                <span className="text-sm text-muted">
                  {lang === "es" ? `${count} ${count === 1 ? "reseña" : "reseñas"}` : `${count} review${count === 1 ? "" : "s"}`}
                </span>
              </p>
            ) : (
              <p className="text-sm text-muted">{t("Be one of the first to review us on Google", "Sea de los primeros en reseñarnos en Google")}</p>
            )}
          </div>
        </div>
        <a
          href={leaveHref}
          {...(googleReviewUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="btn btn-primary btn-sm"
        >
          <Icon name="star" className="size-4" /> {t("Review us on Google", "Reseñenos en Google")}
        </a>
      </div>

      {list.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => (
            <figure key={r.id} className="silver-ring card card-hover relative flex flex-col bg-white p-6 shadow-soft" style={{ borderRadius: "1.5rem" }}>
              <div className="flex items-center gap-3">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full font-sans text-lg font-semibold text-white"
                  style={{ background: ["#7e3fbf", "#1a73e8", "#0f9d58", "#e37400", "#c5221f", "#6a2fa6"][i % 6] }}
                >
                  {r.name.trim().charAt(0).toUpperCase()}
                </span>
                <figcaption className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate font-bold text-ink">{r.name}</span>
                  <span className="block truncate text-xs text-muted">{[r.location, r.service].filter(Boolean).join(" · ")}</span>
                </figcaption>
                {(preview || r.source === "Google") && <GoogleG className="size-5 shrink-0" />}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex text-[#FBBC04]" aria-label={t(`${r.rating} out of 5 stars`, `${r.rating} de 5 estrellas`)} role="img">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Icon key={n} name="star" className="size-4" fill={n <= r.rating ? "currentColor" : "none"} strokeWidth={1.2} />
                  ))}
                </span>
                <span className="text-xs text-muted">{when(r, i, preview, lang)}</span>
              </div>
              <blockquote className="mt-3 flex-1 text-[0.98rem] leading-relaxed text-ink-soft">{r.text}</blockquote>
            </figure>
          ))}
        </div>
      ) : (
        <div className="silver-ring card mx-auto mt-10 max-w-2xl bg-white p-8 text-center shadow-soft sm:p-10" style={{ borderRadius: "2rem" }}>
          <Icon name="quote" className="mx-auto size-10 text-plum-300" />
          <p className="mt-4 font-serif text-2xl text-ink">{t("Our Google reviews will appear here.", "Nuestras reseñas de Google aparecerán aquí.")}</p>
          <p className="mt-3 text-ink-soft">
            {t(
              "Had a great experience with Emili's Cleaning Co.? We'd love to hear about it — your feedback helps your neighbors find a cleaner they can trust.",
              "¿Tuvo una gran experiencia con Emili's Cleaning Co.? Nos encantaría saberlo — su opinión ayuda a sus vecinos a encontrar un servicio de limpieza de confianza.",
            )}
          </p>
          {showWriteLink && (
            <Link href={href("/reviews#write-a-review")} className="btn btn-outline mt-7">
              <Icon name="edit" className="size-4" /> {t("Write a review on our website", "Escribir una reseña en nuestro sitio")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
