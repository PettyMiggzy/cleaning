"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteReview, setReviewPublished } from "../../actions";

export function ReviewActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <>
      <button
        type="button"
        disabled={pending}
        className={`btn btn-sm ${published ? "btn-outline" : "btn-primary"}`}
        onClick={() =>
          start(async () => {
            await setReviewPublished(id, !published);
            router.refresh();
          })
        }
      >
        {published ? "Hide from website" : "Publish"}
      </button>
      <button
        type="button"
        disabled={pending}
        className="rounded-full px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
        onClick={() =>
          confirm("Delete this review?") &&
          start(async () => {
            await deleteReview(id);
            router.refresh();
          })
        }
      >
        Delete
      </button>
    </>
  );
}
