"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LANG, localizePath, pick, type Lang } from "./config";

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Client-side equivalent of getI18n(). */
export function useI18n() {
  const lang = useLang();
  return { lang, t: pick(lang), href: (path: string) => localizePath(lang, path) };
}
