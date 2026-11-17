import { revalidateTag } from "next/cache";
import { AREA_NAMES } from "@/lib/areas";
import { getAllServices, TAGS } from "@/lib/data";
import { emailLayout, escapeHtml, notifyAddress, sendMail, type MailAttachment } from "@/lib/notify";
import { ARRIVAL_WINDOWS_SERVER, PROPERTY_TYPES_SERVER } from "@/lib/form-options";
import { describeEstimate, estimatePrice, type CrewSize } from "@/lib/pricing";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";
import { newId, store, type Review, type Submission, type SubmissionType } from "@/lib/store";

const MAX_FILES = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Record<string, string>;

function str(fd: FormData, key: string, max = 300) {
  const v = fd.get(key);
  return typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "";
}

function validPhone(p: string) {
  const digits = p.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function formatPhone(p: string) {
  const d = p.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : p;
}

function sniffImage(buf: Buffer): { ext: string; type: string } | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", type: "image/png" };
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return { ext: "webp", type: "image/webp" };
  if (buf.subarray(0, 4).toString("ascii") === "GIF8") return { ext: "gif", type: "image/gif" };
  if (buf.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = buf.subarray(8, 12).toString("ascii");
    if (/^(heic|heix|hevc|heim|heis|mif1|msf1)$/.test(brand)) return { ext: "heic", type: "image/heic" };
    if (/^(avif|avis)$/.test(brand)) return { ext: "avif", type: "image/avif" };
  }
  return null;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const TYPES = ["booking", "estimate", "contact", "review"] as const;

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`attempt:${ip}`, 40, 10 * 60 * 1000)) {
    return json(
      { ok: false, message: `Too many submissions from your connection. Please call or text us at ${SITE.phones.primary.display}.` },
      429,
    );
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return json({ ok: false, message: "We couldn't read your submission. Please try again." }, 400);
  }

  const type = str(fd, "type") as (typeof TYPES)[number];
  if (!TYPES.includes(type)) return json({ ok: false, message: "Unknown form." }, 400);

  // Spam check 1: the hidden honeypot field must be empty (bots fill every field).
  if (str(fd, "company_website")) return json({ ok: true, id: newId("x"), message: "Received" });
  // Spam check 2 (applied after validation): a real person needs more than 2 seconds to fill a form.
  const rendered = Number(str(fd, "_t"));
  const tooFast = !!rendered && Date.now() - rendered < 2000;
  const limited = () =>
    !rateLimit(`submit:${ip}`, 8, 10 * 60 * 1000) &&
    json({ ok: false, message: `Too many submissions from your connection. Please call or text us at ${SITE.phones.primary.display}.` }, 429);

  const errors: Errors = {};
  const name = str(fd, "name", 120);
  const phoneRaw = str(fd, "phone", 40);
  const email = str(fd, "email", 160).toLowerCase();
  if (name.length < 2) errors.name = "Please enter your name.";

  /* ---------------------------- Reviews ---------------------------- */
  if (type === "review") {
    const rating = Number(str(fd, "rating"));
    const text = str(fd, "text", 2000);
    if (!(rating >= 1 && rating <= 5)) errors.rating = "Please choose a star rating.";
    if (text.length < 10) errors.text = "Please write a few words about your experience.";
    if (str(fd, "agree") !== "yes") errors.agree = "Please confirm this is your genuine experience.";
    if (Object.keys(errors).length) return json({ ok: false, message: "Please fix the highlighted fields.", errors }, 422);
    if (tooFast) return json({ ok: true, id: newId("x"), message: "Received" });
    const blocked = limited();
    if (blocked) return blocked;

    const review: Review = {
      id: newId("r"),
      name,
      location: AREA_NAMES.includes(str(fd, "city")) ? `${str(fd, "city")}, TX` : "",
      rating: Math.round(rating),
      text,
      date: new Date().toISOString().slice(0, 10),
      source: "Website",
      service: str(fd, "service", 120) || undefined,
      published: false,
      submittedOnline: true,
      email: email || undefined,
      createdAt: new Date().toISOString(),
    };
    try {
      const s = store();
      const list = (await s.readDoc<Review[]>("reviews")) ?? [];
      await s.writeDoc("reviews", [review, ...list].slice(0, 2000));
      revalidateTag(TAGS.reviews, "max");
    } catch (err) {
      console.error("[submit] review save failed", err);
    }
    await sendMail({
      to: notifyAddress(),
      subject: `New ${review.rating}★ review from ${name} (awaiting approval)`,
      html: emailLayout(
        "New customer review submitted",
        `A customer submitted a review on the website. It will appear publicly after you approve it in the <a href="${SITE.url}/admin/reviews">admin dashboard</a>.`,
        [
          ["Name", name],
          ["Rating", `${review.rating} / 5`],
          ["City", review.location],
          ["Service", review.service ?? ""],
          ["Review", text],
          ["Contact", email],
        ],
      ),
      text: `New review from ${name} (${review.rating}/5): ${text}`,
    });
    return json({ ok: true, id: review.id, message: "Thank you!" });
  }

  /* ------------------------ Contact / booking / estimate ------------------------ */
  if (type === "contact") {
    if (phoneRaw && !validPhone(phoneRaw)) errors.phone = "Please enter a valid phone number.";
    if (email && !EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
    if (!phoneRaw && !email) errors.phone = "Please add a phone number or email so we can reply.";
  } else {
    if (!validPhone(phoneRaw)) errors.phone = "Please enter a valid phone number.";
    if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  }

  const fields: [string, string][] = [];
  const services = await getAllServices();
  const serviceId = str(fd, "service", 120);
  const service = services.find((s) => s.id === serviceId);
  const city = str(fd, "city", 80);
  const cityOk = AREA_NAMES.includes(city) || city === "Other nearby area";

  if (type === "booking") {
    if (!service || !service.enabled) errors.service = "Please choose a cleaning service.";
    const crew = Number(str(fd, "crew")) as CrewSize;
    const hours = Number(str(fd, "hours"));
    const date = str(fd, "date", 10);
    const time = str(fd, "time", 60);
    const address = str(fd, "address", 200);
    if (![2, 3, 4].includes(crew)) errors.crew = "Please choose 2, 3 or 4 cleaners.";
    if (!(hours >= 2 && hours <= 10)) errors.hours = "Please choose at least 2 hours.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = "Please choose a preferred date.";
    if (!ARRIVAL_WINDOWS_SERVER.includes(time)) errors.time = "Please choose a preferred arrival time.";
    if (address.length < 5) errors.address = "Please enter the property address.";
    if (!cityOk) errors.city = "Please choose a city.";
    if (str(fd, "agree") !== "yes") errors.agree = "Please confirm you understand this is a booking request.";

    if (!Object.keys(errors).length && service) {
      const est = estimatePrice(crew, hours, service.pricing);
      fields.push(
        ["Cleaning Service", service.name],
        ["Crew Size", `${crew} cleaners`],
        ["Estimated Hours", `${est.hours}`],
        ["Estimated Price", describeEstimate(est)],
        ["Frequency", str(fd, "frequency", 20) || "One-time"],
        ["Preferred Date", date],
        ["Preferred Arrival", time],
        ["Property Address", address],
        ["City", city],
        ["ZIP", str(fd, "zip", 10)],
        ["Property Type", PROPERTY_TYPES_SERVER.includes(str(fd, "propertyType")) ? str(fd, "propertyType") : ""],
        ["Bedrooms", str(fd, "bedrooms", 4)],
        ["Bathrooms", str(fd, "bathrooms", 4)],
        ["Square Footage", str(fd, "sqft", 8)],
        ["Special Instructions", str(fd, "instructions", 3000)],
        ["Preferred Contact", str(fd, "contactPref", 10)],
      );
    }
  } else if (type === "estimate") {
    const address = str(fd, "address", 200);
    const propertyType = str(fd, "propertyType", 40);
    if (!(service?.enabled || serviceId === "not-sure")) errors.service = "Please choose the service you need.";
    if (address.length < 5) errors.address = "Please enter the property address.";
    if (!cityOk) errors.city = "Please choose a city.";
    if (!PROPERTY_TYPES_SERVER.includes(propertyType)) errors.propertyType = "Please choose a property type.";
    fields.push(
      ["Cleaning Service", service?.name ?? "Not sure — please recommend"],
      ["Property Address", address],
      ["City", city],
      ["Property Type", propertyType],
      ["Bedrooms", str(fd, "bedrooms", 4)],
      ["Bathrooms", str(fd, "bathrooms", 4)],
      ["Square Footage", str(fd, "sqft", 8)],
      ["Preferred Date", /^\d{4}-\d{2}-\d{2}$/.test(str(fd, "date")) ? str(fd, "date") : ""],
      ["Special Instructions", str(fd, "instructions", 3000)],
    );
  } else {
    const message = str(fd, "message", 4000);
    if (message.length < 5) errors.message = "Please enter a message.";
    fields.push(["Topic", str(fd, "topic", 60)], ["Message", message]);
  }

  // Photos
  const files = fd.getAll("photos").filter((f): f is File => typeof f === "object" && f !== null && "arrayBuffer" in f && f.size > 0);
  if (type === "estimate" && files.length === 0) errors.photos = "Please add at least one picture (or text them to us).";
  if (files.length > MAX_FILES) errors.photos = `Please upload ${MAX_FILES} photos or fewer.`;
  const total = files.reduce((n, f) => n + f.size, 0);
  if (files.some((f) => f.size > MAX_FILE_BYTES) || total > MAX_TOTAL_BYTES)
    errors.photos = "One or more photos are too large. Please try again or text them to us.";

  if (Object.keys(errors).length) {
    return json({ ok: false, message: "Please check the highlighted fields and try again.", errors }, 422);
  }
  if (tooFast) return json({ ok: true, id: newId("x"), message: "Received" });
  const blocked = limited();
  if (blocked) return blocked;

  const id = newId(type === "booking" ? "b" : type === "estimate" ? "e" : "c");
  const s = store();
  const photoKeys: string[] = [];
  const attachments: MailAttachment[] = [];
  let attachBytes = 0;

  for (const [i, f] of files.entries()) {
    const buf = Buffer.from(await f.arrayBuffer());
    const kind = sniffImage(buf);
    if (!kind) continue;
    const key = `${id}-${i + 1}.${kind.ext}`;
    try {
      await s.putFile("private", key, { data: buf, contentType: kind.type });
      photoKeys.push(key);
    } catch (err) {
      console.error("[submit] photo save failed", err);
    }
    if (attachBytes + buf.length < 18 * 1024 * 1024) {
      attachments.push({ filename: `photo-${i + 1}.${kind.ext}`, content: buf, contentType: kind.type });
      attachBytes += buf.length;
    }
  }

  const submission: Submission = {
    id,
    type: type as SubmissionType,
    status: "new",
    createdAt: new Date().toISOString(),
    name,
    phone: phoneRaw ? formatPhone(phoneRaw) : "",
    email,
    fields: fields.filter(([, v]) => v),
    photos: photoKeys,
  };

  let saved = false;
  try {
    await s.createSubmission(submission);
    saved = true;
  } catch (err) {
    console.error("[submit] could not save submission", err);
  }

  const label = type === "booking" ? "Booking Request" : type === "estimate" ? "Photo Estimate Request" : "Contact Message";
  const rows: [string, string][] = [
    ["Name", name],
    ["Phone", submission.phone],
    ["Email", email],
    ...submission.fields,
    ["Photos", photoKeys.length ? `${photoKeys.length} attached` : files.length ? `${files.length} attached` : ""],
  ];
  const adminLink = `${SITE.url}/admin/requests/${id}`;
  const telDigits = submission.phone.replace(/\D/g, "");

  const emailed = await sendMail({
    to: notifyAddress(),
    replyTo: email || undefined,
    subject: `New ${label}: ${name}${city ? ` — ${city}` : ""}`,
    html: emailLayout(
      `New ${label}`,
      `${escapeHtml(name)} submitted a ${label.toLowerCase()} on your website.${
        telDigits ? ` <a href="tel:+1${telDigits.slice(-10)}">Call</a> · <a href="sms:+1${telDigits.slice(-10)}">Text</a>` : ""
      }`,
      rows,
      saved ? `<a href="${adminLink}" style="color:#6a2fa6;font-weight:700">Open in admin dashboard →</a>` : "",
    ),
    text: rows
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
    attachments,
  });

  if (saved && emailed) await s.updateSubmission(id, { emailed: true }).catch(() => {});

  if (!saved && !emailed) {
    return json(
      {
        ok: false,
        message: `Sorry — we couldn't send your request right now. Please call or text us at ${SITE.phones.primary.display}.`,
      },
      503,
    );
  }

  // Friendly confirmation to the customer (only when email is configured).
  if (email && type !== "contact") {
    await sendMail({
      to: email,
      replyTo: SITE.email,
      subject: `We received your ${type === "booking" ? "booking request" : "photo estimate request"} — ${SITE.name}`,
      html: emailLayout(
        `Thank you, ${name.split(" ")[0]}!`,
        type === "booking"
          ? "We received your booking request. <strong>This is not yet a confirmed appointment</strong> — we'll call or text you shortly to confirm your date, arrival time, crew and estimated price."
          : "We received your pictures. Our team will review them, recommend the right cleaning crew, estimate how long the job will take and send you an estimated price before scheduling.",
        submission.fields,
        `Questions? Call or text <a href="${SITE.phones.primary.tel}">${SITE.phones.primary.display}</a> or <a href="${SITE.phones.secondary.tel}">${SITE.phones.secondary.display}</a>.<br/><em>Times and prices are estimates until reviewed and approved.</em>`,
      ),
      text: `Thank you! We received your request and will contact you shortly. Call or text ${SITE.phones.primary.display}.`,
    });
  }

  return json({ ok: true, id, message: "Received" });
}
