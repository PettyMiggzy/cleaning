"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Icon } from "@/components/Icon";
import { compressImage } from "@/lib/image-compress";
import { deleteGalleryItem } from "../../actions";

function Picker({ label, file, onPick }: { label: string; file: File | null; onPick: (f: File | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  return (
    <div>
      <p className="field-label">{label}</p>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-plum-200 bg-plum-50/60 text-plum-700 hover:border-plum-400"
      >
        {file && url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm font-semibold">
            <Icon name="imagePlus" className="size-8" /> Choose photo
          </span>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const c = await compressImage(f, 2000, 0.85);
          if (url) URL.revokeObjectURL(url);
          setUrl(URL.createObjectURL(c));
          onPick(c);
        }}
      />
    </div>
  );
}

export function GalleryUpload() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [before, setBefore] = useState<File | null>(null);
  const [after, setAfter] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [key, setKey] = useState(0);

  return (
    <form
      key={key}
      ref={formRef}
      className="mt-5 grid gap-4 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        const fd = new FormData(e.currentTarget);
        if (before) fd.set("before", before);
        if (after) fd.set("after", after);
        const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
        const body = await res.json().catch(() => ({}));
        setBusy(false);
        if (res.ok && body.ok) {
          setMsg({ ok: true, text: "Uploaded!" });
          setBefore(null);
          setAfter(null);
          setKey((k) => k + 1);
          router.refresh();
        } else setMsg({ ok: false, text: body.message || "Upload failed." });
      }}
    >
      <Picker label="Before photo" file={before} onPick={setBefore} />
      <Picker label="After photo" file={after} onPick={setAfter} />
      <div className="sm:col-span-2">
        <label className="field-label">Title</label>
        <input name="title" required className="field" placeholder="e.g. Kitchen deep clean" />
      </div>
      <div>
        <label className="field-label">Service</label>
        <input name="service" className="field" placeholder="e.g. Deep Cleaning" />
      </div>
      <div>
        <label className="field-label">Location</label>
        <input name="location" list="area-list" className="field" placeholder="e.g. Spring, TX" />
      </div>
      <div>
        <label className="field-label">
          Title in Spanish <span className="font-normal text-muted">(optional)</span>
        </label>
        <input name="titleEs" className="field" placeholder="ej. Limpieza profunda de cocina" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Description</label>
        <textarea name="description" className="field !min-h-20" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">
          Description in Spanish <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea name="descriptionEs" className="field !min-h-20" />
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold text-ink">
        <input type="checkbox" name="published" defaultChecked className="size-5 accent-plum-700" /> Show on website
      </label>
      <div className="flex items-center justify-end gap-3">
        {msg && <span className={`text-sm font-semibold ${msg.ok ? "text-emerald-700" : "text-rose-700"}`}>{msg.text}</span>}
        <button className="btn btn-primary" type="submit" disabled={busy || (!before && !after)}>
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}

export function GalleryDelete({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-full px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
      onClick={() =>
        confirm("Delete these photos from the gallery?") &&
        start(async () => {
          await deleteGalleryItem(id);
          router.refresh();
        })
      }
    >
      Delete
    </button>
  );
}
