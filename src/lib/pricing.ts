export const MIN_HOURS = 2;
export const MAX_HOURS = 10;
export const HOUR_STEP = 0.5;

export type CrewSize = 2 | 3 | 4;

export const CREWS: {
  size: CrewSize;
  rate: number;
  minimum: number;
  title: string;
  bestFor: string;
}[] = [
  {
    size: 2,
    rate: 100,
    minimum: 200,
    title: "2 Professional Cleaners",
    bestFor: "Apartments, condos & routine home cleaning",
  },
  {
    size: 3,
    rate: 150,
    minimum: 300,
    title: "3 Professional Cleaners",
    bestFor: "Larger homes, deep cleans & move-outs",
  },
  {
    size: 4,
    rate: 200,
    minimum: 400,
    title: "4 Professional Cleaners",
    bestFor: "Big homes, offices & time-sensitive turnovers",
  },
];

export const DEEP_CLEAN_SURCHARGE = { min: 0.25, max: 0.3 } as const;

export const ADDITIONAL_PRICING = [
  { label: "Deep Cleaning", value: "25–30% additional" },
  { label: "Move-In / Move-Out Cleaning", value: "Custom estimate" },
  { label: "Commercial Cleaning", value: "Custom estimate" },
  { label: "Weekly / Biweekly Cleaning", value: "Discounts available upon approval" },
  { label: "Specialty Cleaning", value: "Custom estimate" },
];

/** How a selected service is priced. */
export type PricingMode = "hourly" | "deep" | "custom";

export function crewFor(size: number) {
  return CREWS.find((c) => c.size === size) ?? CREWS[0];
}

export function hourOptions() {
  const out: number[] = [];
  for (let h = MIN_HOURS; h <= MAX_HOURS; h += HOUR_STEP) out.push(h);
  return out;
}

export function clampHours(hours: number) {
  if (!Number.isFinite(hours)) return MIN_HOURS;
  const snapped = Math.round(hours / HOUR_STEP) * HOUR_STEP;
  return Math.min(MAX_HOURS, Math.max(MIN_HOURS, snapped));
}

export type Estimate = {
  crew: CrewSize;
  hours: number;
  rate: number;
  base: number;
  /** Low / high of the total (equal for plain hourly work). */
  low: number;
  high: number;
  mode: PricingMode;
};

/**
 * Estimated price = crew hourly rate × hours (2-hour minimum applies to every booking).
 * The hourly rate covers the entire crew, not each cleaner.
 */
export function estimatePrice(crewSize: number, hours: number, mode: PricingMode = "hourly"): Estimate {
  const crew = crewFor(crewSize);
  const h = clampHours(hours);
  const base = Math.max(crew.rate * h, crew.minimum);
  let low = base;
  let high = base;
  if (mode === "deep") {
    low = Math.round(base * (1 + DEEP_CLEAN_SURCHARGE.min));
    high = Math.round(base * (1 + DEEP_CLEAN_SURCHARGE.max));
  }
  return { crew: crew.size, hours: h, rate: crew.rate, base, low, high, mode };
}

export function formatUSD(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
}

export function formatHours(h: number) {
  return `${h % 1 === 0 ? h : h.toFixed(1)} hour${h === 1 ? "" : "s"}`;
}

export function describeEstimate(e: Estimate) {
  const range = e.low === e.high ? formatUSD(e.low) : `${formatUSD(e.low)} – ${formatUSD(e.high)}`;
  return `${e.crew} cleaners × ${formatHours(e.hours)} @ ${formatUSD(e.rate)}/hr = ${range}${
    e.mode === "deep" ? " (includes 25–30% deep cleaning)" : e.mode === "custom" ? " (hourly reference — custom estimate)" : ""
  }`;
}
