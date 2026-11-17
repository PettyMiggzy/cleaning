"use client";

import { usePathname } from "next/navigation";
import { Suspense, useSyncExternalStore } from "react";
import { useLang } from "@/i18n/client";
import { switchPath } from "@/i18n/config";
import { Icon } from "../Icon";

const KEY = "ecc_lang_dismissed";
const EVENT = "ecc-lang-suggest";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

function shouldSuggest() {
  try {
    const prefersSpanish = (navigator.languages?.length ? navigator.languages : [navigator.language]).some((l) => /^es(-|$)/i.test(l));
    return prefersSpanish && localStorage.getItem(KEY) !== "1";
  } catch {
    return false;
  }
}

function Banner() {
  const pathname = usePathname();
  const show = useSyncExternalStore(subscribe, shouldSuggest, () => false);
  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <div role="region" aria-label="Idioma" className="bg-plum-100 text-plum-950">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-sm">
        <p className="flex items-center gap-2 font-semibold">
          <Icon name="message" className="size-4 shrink-0 text-plum-700" />
          <span lang="es">¿Prefiere ver este sitio en español?</span>
        </p>
        <span className="flex items-center gap-2">
          <a
            href={switchPath(pathname, "es")}
            hrefLang="es"
            lang="es"
            onClick={dismiss}
            className="inline-flex min-h-9 items-center rounded-full bg-plum-700 px-4 font-bold text-white hover:bg-plum-800"
          >
            Ver en español
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex min-h-9 items-center rounded-full px-3 font-semibold text-plum-800 hover:bg-plum-200"
          >
            No, thanks
          </button>
        </span>
      </div>
    </div>
  );
}

/** Slim banner offered only to English-page visitors whose browser prefers Spanish. */
export function LangSuggest() {
  const lang = useLang();
  if (lang !== "en") return null;
  return (
    <Suspense fallback={null}>
      <Banner />
    </Suspense>
  );
}
