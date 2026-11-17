import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { isLang, localizePath, pick, type Lang } from "./config";

/** The current page language, readable from any Server Component (no prop drilling). */
export async function getLang(): Promise<Lang> {
  const l = await rootLang();
  if (!isLang(l)) notFound();
  return l;
}

/** { lang, t, href } for the current page. `t("English", "Español")`, `href("/book")`. */
export async function getI18n() {
  const lang = await getLang();
  return { lang, t: pick(lang), href: (path: string) => localizePath(lang, path) };
}
