import type { ReactNode } from "react";
import type { Submission, SubmissionStatus, SubmissionType } from "@/lib/store";

export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-silver-200 bg-white p-5 shadow-sm sm:p-7 ${className}`}>{children}</div>;
}

export const TYPE_LABEL: Record<SubmissionType, string> = {
  booking: "Booking",
  estimate: "Photo Estimate",
  contact: "Message",
};

export const STATUS_STYLE: Record<SubmissionStatus, string> = {
  new: "bg-plum-600 text-white",
  contacted: "bg-sky-100 text-sky-800",
  scheduled: "bg-emerald-100 text-emerald-800",
  completed: "bg-silver-200 text-ink",
  declined: "bg-rose-100 text-rose-800",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${STATUS_STYLE[status]}`}>{status}</span>
  );
}

export function TypeBadge({ type }: { type: SubmissionType }) {
  return <span className="inline-flex rounded-full bg-plum-100 px-2.5 py-1 text-xs font-bold text-plum-800">{TYPE_LABEL[type]}</span>;
}

export function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fieldValue(s: Submission, label: string) {
  return s.fields.find(([k]) => k === label)?.[1] ?? "";
}
