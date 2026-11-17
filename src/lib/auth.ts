import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "ecc_admin";
const SESSION_DAYS = 14;

/** In development a default password is allowed so the dashboard can be explored. */
export function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : "admin";
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || `ecc-session:${adminPassword() ?? "disabled"}`;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string) {
  const pw = adminPassword();
  if (!pw) return false;
  return safeEqual(input, pw);
}

export function createSessionValue() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `v1.${exp}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_DAYS * 24 * 60 * 60 };
}

export function verifySessionValue(value: string | undefined | null) {
  if (!value || !adminPassword()) return false;
  const idx = value.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function isAdmin() {
  const jar = await cookies();
  await connection(); // session expiry depends on the current time — always evaluate per request
  return verifySessionValue(jar.get(ADMIN_COOKIE)?.value);
}

/** Use at the top of every admin page and admin server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
