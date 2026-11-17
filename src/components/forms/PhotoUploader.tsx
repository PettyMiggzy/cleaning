"use client";

import { useEffect, useId, useRef, useState } from "react";
import { compressImage } from "@/lib/image-compress";
import { useI18n } from "@/i18n/client";
import { Icon } from "../Icon";

export const MAX_PHOTOS = 10;

export type PickedPhoto = { id: string; file: File; url: string };

export function PhotoUploader({
  photos,
  onChange,
  required = false,
  error,
  label,
  hint,
}: {
  photos: PickedPhoto[];
  onChange: (next: PickedPhoto[]) => void;
  required?: boolean;
  error?: string;
  label?: string;
  hint?: string;
}) {
  const { t } = useI18n();
  const id = useId();
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [drag, setDrag] = useState(false);
  const [note, setNote] = useState("");
  const latest = useRef(photos);
  useEffect(() => {
    latest.current = photos;
  }, [photos]);

  useEffect(() => () => latest.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  async function add(list: FileList | File[] | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    const room = MAX_PHOTOS - latest.current.length;
    if (incoming.length > room)
      setNote(
        t(
          `Only ${MAX_PHOTOS} photos can be uploaded — you can text more to us anytime.`,
          `Solo se pueden subir ${MAX_PHOTOS} fotos — puede enviarnos más por texto cuando quiera.`,
        ),
      );
    else setNote("");
    const take = incoming.slice(0, Math.max(0, room));
    if (!take.length) return;
    setBusy((b) => b + take.length);
    const processed = await Promise.all(
      take.map(async (f) => {
        const file = await compressImage(f);
        return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file, url: URL.createObjectURL(file) };
      }),
    );
    setBusy((b) => b - take.length);
    onChange([...latest.current, ...processed].slice(0, MAX_PHOTOS));
  }

  function remove(pid: string) {
    const p = photos.find((x) => x.id === pid);
    if (p) URL.revokeObjectURL(p.url);
    onChange(photos.filter((x) => x.id !== pid));
  }

  return (
    <div>
      <p className="field-label" id={`${id}-label`}>
        {label ?? t("Upload pictures", "Subir fotos")}{" "}
        {required ? <span className="text-plum-600">*</span> : <span className="font-normal text-muted">{t("(optional)", "(opcional)")}</span>}
      </p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={`rounded-3xl border-2 border-dashed p-5 text-center transition-colors sm:p-7 ${
          error ? "border-[#c2405b] bg-red-50/40" : drag ? "border-plum-500 bg-plum-50" : "border-plum-200 bg-plum-50/50"
        }`}
        aria-labelledby={`${id}-label`}
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-plum-700 shadow-soft">
          <Icon name="imagePlus" className="size-7" />
        </span>
        <p className="mt-3 font-semibold text-ink">
          <span className="sm:hidden">{t("Take photos or choose from your gallery", "Tome fotos o elíjalas de su galería")}</span>
          <span className="hidden sm:inline">{t("Drag & drop photos here, or choose files", "Arrastre y suelte fotos aquí, o elija archivos")}</span>
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted">
          {hint ?? t("Add up to 10 photos of the rooms or areas you need cleaned.", "Agregue hasta 10 fotos de los cuartos o áreas que necesita limpiar.")}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => galleryRef.current?.click()}>
            <Icon name="image" className="size-4" /> {t("Choose Photos", "Elegir fotos")}
          </button>
          <button type="button" className="btn btn-outline btn-sm sm:hidden" onClick={() => cameraRef.current?.click()}>
            <Icon name="camera" className="size-4" /> {t("Take a Photo", "Tomar una foto")}
          </button>
        </div>
        <input
          ref={galleryRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {(photos.length > 0 || busy > 0) && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {photos.map((p, i) => (
            <li key={p.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-silver-100 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`${t("Selected photo", "Foto seleccionada")} ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="absolute top-1.5 right-1.5 grid size-8 place-items-center rounded-full bg-white/95 text-ink shadow"
                aria-label={`${t("Remove photo", "Quitar foto")} ${i + 1}`}
              >
                <Icon name="x" className="size-4" />
              </button>
            </li>
          ))}
          {Array.from({ length: busy }).map((_, i) => (
            <li
              key={`busy-${i}`}
              className="grid aspect-square place-items-center rounded-2xl bg-plum-50 text-xs font-semibold text-plum-700"
            >
              <span className="flex flex-col items-center gap-2">
                <span className="size-6 animate-spin rounded-full border-2 border-plum-200 border-t-plum-600" />
                {t("Optimizing…", "Optimizando…")}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-sm text-muted" aria-live="polite">
        {photos.length}/{MAX_PHOTOS} {t("photos added", "fotos agregadas")}{note ? ` · ${note}` : ""}
      </p>
      {error && (
        <p className="mt-1 text-sm font-semibold text-[#b0324d]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
