"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { SubmissionStatus } from "@/lib/store/types";
import { setSubmissionStatus } from "../../../actions";

const OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "scheduled", label: "Scheduled / Approved" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
];

export function StatusPicker({ id, status }: { id: string; status: SubmissionStatus }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="grid grid-cols-2 gap-2">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await setSubmissionStatus(id, o.value);
              router.refresh();
            })
          }
          className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${
            status === o.value ? "border-plum-600 bg-plum-50 text-plum-800" : "border-silver-200 text-ink hover:border-plum-300"
          } ${pending ? "opacity-60" : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
