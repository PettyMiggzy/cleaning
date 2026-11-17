import { AREAS } from "@/lib/areas";
import { getI18n } from "@/i18n/server";

// Simple equirectangular projection tuned for the north Houston area.
const LNG_MIN = -95.76;
const LAT_MAX = 30.37;
const SX = 1250;
const SY = 1443;
const px = (lat: number, lng: number) => [(lng - LNG_MIN) * SX, (LAT_MAX - lat) * SY] as const;
const path = (pts: [number, number][]) =>
  pts
    .map(([lat, lng], i) => {
      const [x, y] = px(lat, lng);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

const ROADS: { label: string; pts: [number, number][]; at: [number, number] }[] = [
  { label: "I-45", pts: [[29.93, -95.405], [30.02, -95.418], [30.08, -95.43], [30.17, -95.452], [30.25, -95.462], [30.37, -95.48]], at: [30.22, -95.448] },
  { label: "99", pts: [[29.985, -95.745], [30.04, -95.69], [30.09, -95.6], [30.115, -95.5], [30.11, -95.4], [30.085, -95.33], [30.055, -95.25], [30.03, -95.14]], at: [30.12, -95.53] },
  { label: "249", pts: [[29.93, -95.535], [30.0, -95.555], [30.06, -95.59], [30.11, -95.63], [30.2, -95.72]], at: [29.965, -95.545] },
  { label: "290", pts: [[29.93, -95.6], [29.96, -95.67], [29.99, -95.73], [30.0, -95.76]], at: [29.947, -95.655] },
  { label: "69", pts: [[29.93, -95.33], [29.98, -95.285], [30.03, -95.235], [30.08, -95.18], [30.13, -95.13]], at: [29.955, -95.29] },
];

const LABEL_POS: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  "spring-tx": { dx: 18, dy: 6, anchor: "start" },
  "klein-tx": { dx: 18, dy: 8, anchor: "start" },
  "the-woodlands-tx": { dx: 16, dy: -8, anchor: "start" },
  "tomball-tx": { dx: -16, dy: -8, anchor: "end" },
  "cypress-tx": { dx: 16, dy: -10, anchor: "start" },
  "humble-tx": { dx: -12, dy: 26, anchor: "middle" },
  "kingwood-tx": { dx: 0, dy: -18, anchor: "middle" },
  "conroe-tx": { dx: 16, dy: 6, anchor: "start" },
};

export async function ServiceAreaMap({ active }: { active?: string }) {
  const { t, href } = await getI18n();
  const [sx, sy] = px(30.0799, -95.4172);
  return (
    <figure className="silver-ring card relative overflow-hidden bg-white shadow-lift" style={{ borderRadius: "2rem" }}>
      <svg viewBox="0 0 800 640" role="img" aria-labelledby="map-title map-desc" className="h-auto w-full">
        <title id="map-title">{t("Emili's Cleaning Co. service area map", "Mapa de las zonas de servicio de Emili's Cleaning Co.")}</title>
        <desc id="map-desc">
          {t("Map of the north Houston area showing the communities we serve: ", "Mapa del norte del área de Houston con las comunidades que atendemos: ")}
          {AREAS.map((a) => a.label).join(", ")}.
        </desc>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#efe9f6" strokeWidth="1" />
          </pattern>
          <radialGradient id="zone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b787e4" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#d2b2f1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#d2b2f1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="road" x1="0" x2="1">
            <stop offset="0" stopColor="#c9ccd4" />
            <stop offset=".5" stopColor="#e9ebef" />
            <stop offset="1" stopColor="#b9bdc6" />
          </linearGradient>
        </defs>
        <rect width="800" height="640" fill="#fcfaff" />
        <rect width="800" height="640" fill="url(#grid)" />
        {/* Lakes */}
        <path d="M95 18c30-10 70 8 76 34s-18 46-44 44-58-14-62-38 0-32 30-40Z" fill="#e6dcf5" opacity=".8" />
        <text x="122" y="64" textAnchor="middle" className="fill-plum-400" style={{ font: "italic 600 17px var(--font-serif)" }}>
          {t("Lake Conroe", "Lago Conroe")}
        </text>
        <path d="M748 470c18 6 34 34 30 62s-22 58-40 56-20-40-16-70 8-54 26-48Z" fill="#e6dcf5" opacity=".8" />
        <text x="760" y="610" textAnchor="end" className="fill-plum-400" style={{ font: "italic 600 17px var(--font-serif)" }}>
          {t("Lake Houston", "Lago Houston")}
        </text>
        {/* Service zone glow */}
        <ellipse cx={sx - 20} cy={sy - 20} rx="440" ry="330" fill="url(#zone)" />
        {/* Roads */}
        {ROADS.map((r) => {
          const [lx, ly] = px(...r.at);
          return (
            <g key={r.label}>
              <path d={path(r.pts)} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <path d={path(r.pts)} fill="none" stroke="url(#road)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <g transform={`translate(${lx} ${ly})`}>
                <rect x="-22" y="-13" width="44" height="26" rx="7" fill="#fff" stroke="#c9ccd4" />
                <text textAnchor="middle" y="5.5" style={{ font: "700 14px var(--font-sans)" }} fill="#6b6574">
                  {r.label}
                </text>
              </g>
            </g>
          );
        })}
        {/* Cities */}
        {AREAS.map((a) => {
          const [x, y] = px(a.lat, a.lng);
          const pos = LABEL_POS[a.slug];
          const isActive = active ? active === a.slug : a.homeBase;
          return (
            <a key={a.slug} href={href(`/service-areas/${a.slug}`)} aria-label={t(`${a.label} cleaning services`, `Servicios de limpieza en ${a.label}`)}>
              <g className="cursor-pointer [&:hover_circle.dot]:fill-plum-500">
                {isActive && (
                  <circle cx={x} cy={y} r="14" fill="#9a5cd3" opacity=".35">
                    <animate attributeName="r" values="12;26;12" dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values=".45;0;.45" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={x} cy={y} r={isActive ? 14 : 11} fill="#fff" stroke="#7e3fbf" strokeWidth="3.5" />
                <circle className="dot transition-colors" cx={x} cy={y} r={isActive ? 7 : 5.5} fill="#7e3fbf" />
                <text
                  x={x + pos.dx}
                  y={y + pos.dy}
                  textAnchor={pos.anchor}
                  className={isActive ? "map-label-active" : "map-label"}
                  style={{ fontFamily: "var(--font-sans)", fontWeight: isActive ? 700 : 600, paintOrder: "stroke" }}
                  stroke="#fff"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  fill="#16131a"
                >
                  {a.name}
                </text>
                {a.homeBase && (
                  <text
                    x={x + pos.dx}
                    y={y + pos.dy + 22}
                    style={{ font: "700 13px var(--font-sans)", letterSpacing: ".14em", paintOrder: "stroke" }}
                    stroke="#fff"
                    strokeWidth="4"
                    fill="#6a2fa6"
                  >
                    {t("HOME BASE", "BASE PRINCIPAL")}
                  </text>
                )}
              </g>
            </a>
          );
        })}
        {/* Compass */}
        <g transform="translate(748 52)">
          <circle r="22" fill="#fff" stroke="#e3e5ea" />
          <path d="M0-15 5 0 0 15-5 0Z" fill="#7e3fbf" />
          <text y="-26" textAnchor="middle" style={{ font: "700 11px var(--font-sans)" }} fill="#6b6574">
            N
          </text>
        </g>
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-silver-100 bg-plum-50/60 px-5 py-3 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-plum-600" /> {t("Communities we serve — tap a city for details", "Comunidades que atendemos — toque una ciudad para ver detalles")}
        </span>
        <span>{t("Map is illustrative, not to scale", "Mapa ilustrativo, no está a escala")}</span>
      </figcaption>
    </figure>
  );
}
