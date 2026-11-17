import Link from "next/link";
import type { ReactNode } from "react";
import { PHONE_LINES, SITE } from "@/lib/site";
import { Icon, Sparkle } from "./Icon";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      <Sparkle className="size-3 text-plum-400" />
      {children}
      <Sparkle className="size-3 text-plum-400" />
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className = "",
  as: As = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
      <As className={`h2 mt-4 ${As === "h1" ? "display" : ""}`}>{title}</As>
      {lead && <p className="lead mt-5">{lead}</p>}
    </div>
  );
}

export function CallTextButtons({
  line = "primary",
  variant = "primary",
  size = "",
  className = "",
}: {
  line?: "primary" | "secondary";
  variant?: "primary" | "outline" | "light" | "ghost-light";
  size?: "" | "btn-sm" | "btn-lg";
  className?: string;
}) {
  const p = SITE.phones[line];
  const second = variant === "primary" ? "btn-outline" : variant === "light" ? "btn-ghost-light" : `btn-${variant}`;
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={p.tel} className={`btn btn-${variant} ${size}`} aria-label={`Call ${p.display}`}>
        <Icon name="phone" className="size-5" />
        Call {p.display}
      </a>
      <a href={p.sms} className={`btn ${second} ${size}`} aria-label={`Text ${p.display}`}>
        <Icon name="message" className="size-5" />
        Text Us
      </a>
    </div>
  );
}

/** Both business lines with clearly labeled call + text buttons. */
export function PhoneLines({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      {PHONE_LINES.map((p, i) => (
        <div
          key={p.e164}
          className={`rounded-3xl p-5 ${
            dark ? "border border-white/15 bg-white/[0.06] backdrop-blur" : "silver-ring card bg-white shadow-soft"
          }`}
        >
          <p className={`text-xs font-bold tracking-[0.18em] uppercase ${dark ? "text-plum-200" : "text-plum-700"}`}>
            {i === 0 ? "Primary · Call or Text" : "Secondary · Call or Text"}
          </p>
          <a
            href={p.tel}
            className={`mt-1 block font-serif text-2xl font-semibold tracking-tight md:text-[1.7rem] ${
              dark ? "text-white" : "text-ink"
            }`}
          >
            {p.display}
          </a>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href={p.tel} className={`btn btn-sm ${dark ? "btn-light" : "btn-primary"}`}>
              <Icon name="phone" className="size-4" /> Call
            </a>
            <a href={p.sms} className={`btn btn-sm ${dark ? "btn-ghost-light" : "btn-outline"}`}>
              <Icon name="message" className="size-4" /> Text
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PrimaryCtas({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Link href="/book" className={`btn btn-lg ${light ? "btn-light" : "btn-primary"}`}>
        <Icon name="calendar" className="size-5" />
        Book Your Cleaning
      </Link>
      <Link href="/photo-estimate" className={`btn btn-lg ${light ? "btn-ghost-light" : "btn-outline"}`}>
        <Icon name="camera" className="size-5" />
        Send Pictures for a Free Estimate
      </Link>
    </div>
  );
}

export function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`grid gap-3 ${className}`}>
      {items.map((it) => (
        <li key={it} className="flex gap-3">
          <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-plum-100 text-plum-700">
            <Icon name="check" className="size-3.5" strokeWidth={3} />
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Stars({ rating, className = "size-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5 text-plum-500" aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" className={className} fill={i <= rating ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </span>
  );
}
