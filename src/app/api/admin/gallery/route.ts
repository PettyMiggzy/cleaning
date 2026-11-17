import { revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/data";
import { newId, store, type GalleryItem } from "@/lib/store";

const MAX = 12 * 1024 * 1024;

function sniff(buf: Buffer) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (buf[0] === 0x89 && buf.subarray(1, 4).toString("ascii") === "PNG") return { ext: "png", type: "image/png" };
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return { ext: "webp", type: "image/webp" };
  return null;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false, message: "Not signed in." }, { status: 401 });
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return Response.json({ ok: false, message: "Bad origin." }, { status: 403 });

  const fd = await req.formData();
  const title = String(fd.get("title") ?? "").trim().slice(0, 120);
  if (!title) return Response.json({ ok: false, message: "Please add a title." }, { status: 422 });

  const id = newId("g");
  const s = store();
  const urls: Partial<Record<"before" | "after", string>> = {};
  for (const slot of ["before", "after"] as const) {
    const f = fd.get(slot);
    if (!(f && typeof f === "object" && "arrayBuffer" in f && f.size > 0)) continue;
    if (f.size > MAX) return Response.json({ ok: false, message: `The ${slot} photo is too large.` }, { status: 413 });
    const buf = Buffer.from(await f.arrayBuffer());
    const kind = sniff(buf);
    if (!kind) return Response.json({ ok: false, message: `The ${slot} file must be a JPG, PNG or WebP image.` }, { status: 422 });
    const key = `${id}-${slot}.${kind.ext}`;
    await s.putFile("public", key, { data: buf, contentType: kind.type });
    urls[slot] = `/media/public/${key}`;
  }
  if (!urls.before && !urls.after) return Response.json({ ok: false, message: "Please add at least one photo." }, { status: 422 });

  const item: GalleryItem = {
    id,
    title,
    description: String(fd.get("description") ?? "").trim().slice(0, 600),
    titleEs: String(fd.get("titleEs") ?? "").trim().slice(0, 120) || undefined,
    descriptionEs: String(fd.get("descriptionEs") ?? "").trim().slice(0, 600) || undefined,
    location: String(fd.get("location") ?? "").trim().slice(0, 80),
    service: String(fd.get("service") ?? "").trim().slice(0, 120),
    before: urls.before,
    after: urls.after,
    published: fd.get("published") === "on",
    createdAt: new Date().toISOString(),
  };
  const list = (await s.readDoc<GalleryItem[]>("gallery")) ?? [];
  await s.writeDoc("gallery", [item, ...list]);
  revalidateTag(TAGS.gallery, { expire: 0 });
  return Response.json({ ok: true, id });
}
