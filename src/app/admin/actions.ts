"use server";

import { updateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, createSessionValue, requireAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/data";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { CATEGORIES, CATALOG, slugify, type CategoryId } from "@/lib/services-catalog";
import { newId, store, type GalleryItem, type Review, type ServiceSettings, type SiteSettings, type SubmissionStatus } from "@/lib/store";

/* ─────────────── Auth ─────────────── */

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) return { error: "Too many attempts. Please wait 15 minutes and try again." };
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Incorrect password." };
  const { value, maxAge } = createSessionValue();
  (await cookies()).set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* ─────────────── Requests ─────────────── */

const STATUSES: SubmissionStatus[] = ["new", "contacted", "scheduled", "completed", "declined"];

export async function setSubmissionStatus(id: string, status: SubmissionStatus) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return;
  await store().updateSubmission(id, { status });
}

export async function saveSubmissionNotes(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  await store().updateSubmission(id, { notes });
}

export async function deleteSubmission(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const s = store();
  const sub = await s.getSubmission(id);
  if (sub) {
    await Promise.all(sub.photos.map((k) => s.deleteFile("private", k).catch(() => {})));
    await s.deleteSubmission(id);
  }
  redirect("/admin/requests");
}

/* ─────────────── Services ─────────────── */

async function readServices(): Promise<ServiceSettings> {
  const doc = await store().readDoc<ServiceSettings>("services");
  return { overrides: doc?.overrides ?? {}, custom: doc?.custom ?? [] };
}

async function writeServices(next: ServiceSettings) {
  await store().writeDoc("services", next);
  updateTag(TAGS.services);
}

export async function setServiceEnabled(id: string, enabled: boolean) {
  await requireAdmin();
  const s = await readServices();
  const custom = s.custom.find((c) => c.id === id);
  if (custom) custom.enabled = enabled;
  else if (CATALOG.some((c) => c.id === id)) s.overrides[id] = { ...s.overrides[id], enabled };
  await writeServices(s);
}

export async function setCategoryEnabled(category: CategoryId, enabled: boolean) {
  await requireAdmin();
  const s = await readServices();
  for (const svc of CATALOG.filter((c) => c.categories.includes(category))) {
    s.overrides[svc.id] = { ...s.overrides[svc.id], enabled };
  }
  for (const c of s.custom) if (c.category === category) c.enabled = enabled;
  await writeServices(s);
}

export async function saveServiceDescription(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const description = String(formData.get("description") ?? "").trim().slice(0, 600);
  const descriptionEs = String(formData.get("descriptionEs") ?? "").trim().slice(0, 600);
  const s = await readServices();
  const custom = s.custom.find((c) => c.id === id);
  if (custom) {
    if (description) custom.description = description;
    custom.descriptionEs = descriptionEs || undefined;
  } else if (CATALOG.some((c) => c.id === id)) {
    const base = CATALOG.find((c) => c.id === id)!;
    s.overrides[id] = {
      ...s.overrides[id],
      description: description && description !== base.description ? description : undefined,
      descriptionEs: descriptionEs && descriptionEs !== base.descriptionEs ? descriptionEs : undefined,
    };
  }
  await writeServices(s);
}

export async function addCustomService(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const description = String(formData.get("description") ?? "").trim().slice(0, 600);
  const nameEs = String(formData.get("nameEs") ?? "").trim().slice(0, 100);
  const descriptionEs = String(formData.get("descriptionEs") ?? "").trim().slice(0, 600);
  const category = String(formData.get("category") ?? "") as CategoryId;
  if (name.length < 3 || !CATEGORIES.some((c) => c.id === category)) return;
  const s = await readServices();
  let id = `custom-${slugify(name)}`;
  if (s.custom.some((c) => c.id === id)) id = `${id}-${newId().slice(-4)}`;
  s.custom.push({
    id,
    name,
    description: description || `${name} — contact us for details.`,
    nameEs: nameEs || undefined,
    descriptionEs: descriptionEs || undefined,
    category,
    enabled: true,
  });
  await writeServices(s);
}

export async function deleteCustomService(id: string) {
  await requireAdmin();
  const s = await readServices();
  s.custom = s.custom.filter((c) => c.id !== id);
  await writeServices(s);
}

/* ─────────────── Reviews ─────────────── */

async function readReviews() {
  return (await store().readDoc<Review[]>("reviews")) ?? [];
}

async function writeReviews(list: Review[]) {
  await store().writeDoc("reviews", list);
  updateTag(TAGS.reviews);
}

export async function saveReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const text = String(formData.get("text") ?? "").trim().slice(0, 2000);
  if (!name || !text) return;
  const rating = Math.min(5, Math.max(1, Math.round(Number(formData.get("rating")) || 5)));
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(formData.get("date"))) ? String(formData.get("date")) : new Date().toISOString().slice(0, 10);
  const patch = {
    name,
    text,
    rating,
    date,
    location: String(formData.get("location") ?? "").trim().slice(0, 80),
    source: String(formData.get("source") ?? "Direct").trim().slice(0, 40) || "Direct",
    service: String(formData.get("service") ?? "").trim().slice(0, 120) || undefined,
    published: formData.get("published") === "on",
  };
  const list = await readReviews();
  const existing = list.find((r) => r.id === id);
  if (existing) Object.assign(existing, patch);
  else list.unshift({ id: newId("r"), createdAt: new Date().toISOString(), ...patch });
  await writeReviews(list);
}

export async function setReviewPublished(id: string, published: boolean) {
  await requireAdmin();
  const list = await readReviews();
  const r = list.find((x) => x.id === id);
  if (r) r.published = published;
  await writeReviews(list);
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await writeReviews((await readReviews()).filter((r) => r.id !== id));
}

/* ─────────────── Gallery ─────────────── */

async function readGallery() {
  return (await store().readDoc<GalleryItem[]>("gallery")) ?? [];
}

export async function updateGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const list = await readGallery();
  const g = list.find((x) => x.id === id);
  if (!g) return;
  g.title = String(formData.get("title") ?? g.title).trim().slice(0, 120) || g.title;
  g.description = String(formData.get("description") ?? "").trim().slice(0, 600);
  g.titleEs = String(formData.get("titleEs") ?? "").trim().slice(0, 120) || undefined;
  g.descriptionEs = String(formData.get("descriptionEs") ?? "").trim().slice(0, 600) || undefined;
  g.location = String(formData.get("location") ?? "").trim().slice(0, 80);
  g.service = String(formData.get("service") ?? "").trim().slice(0, 120);
  g.published = formData.get("published") === "on";
  await store().writeDoc("gallery", list);
  updateTag(TAGS.gallery);
}

export async function deleteGalleryItem(id: string) {
  await requireAdmin();
  const s = store();
  const list = await readGallery();
  const g = list.find((x) => x.id === id);
  if (g) {
    for (const url of [g.before, g.after]) {
      const key = url?.split("/").pop();
      if (key) await s.deleteFile("public", key).catch(() => {});
    }
  }
  await s.writeDoc(
    "gallery",
    list.filter((x) => x.id !== id),
  );
  updateTag(TAGS.gallery);
}

/* ─────────────── Settings ─────────────── */

function cleanUrl(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  if (!s) return undefined;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const next: SiteSettings = {
    social: {
      facebook: cleanUrl(formData.get("facebook")),
      instagram: cleanUrl(formData.get("instagram")),
      tiktok: cleanUrl(formData.get("tiktok")),
      google: cleanUrl(formData.get("google")),
      yelp: cleanUrl(formData.get("yelp")),
      nextdoor: cleanUrl(formData.get("nextdoor")),
    },
    googleReviewUrl: cleanUrl(formData.get("googleReviewUrl")),
  };
  await store().writeDoc("settings", next);
  updateTag(TAGS.settings);
}
