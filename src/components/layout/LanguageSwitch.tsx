"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, type MouseEvent } from "react";
import { useLang } from "@/i18n/client";
import { LANGS, LANG_META, switchPath, type Lang } from "@/i18n/config";

type Variant = "bar" | "pill" | "footer" | "drawer";

const WRAP: Record<Variant, string> = {
  bar: "inline-flex items-center gap-0.5 rounded-full bg-white/10 p-0.5",
  pill: "inline-flex items-center gap-0.5 rounded-full border border-silver-200 bg-white p-0.5 shadow-soft",
  footer: "inline-flex items-center gap-0.5 rounded-full border border-white/20 bg-white/5 p-0.5",
  drawer: "grid w-full grid-cols-2 gap-2",
};

const ITEM: Record<Variant, { base: string; on: string; off: string }> = {
  bar: {
    base: "flex h-7 min-w-9 items-center justify-center rounded-full px-2.5 text-[0.7rem] font-bold tracking-wider transition",
    on: "bg-white text-plum-900",
    off: "text-plum-100 hover:text-white",
  },
  pill: {
    base: "flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-bold tracking-wider transition sm:h-10 sm:min-w-[2.6rem]",
    on: "bg-gradient-to-br from-plum-600 to-plum-800 text-white shadow-glow",
    off: "text-ink hover:text-plum-700",
  },
  footer: {
    base: "flex h-10 min-w-12 items-center justify-center rounded-full px-3 text-xs font-bold tracking-wider transition",
    on: "bg-white text-plum-900",
    off: "text-plum-100 hover:text-white",
  },
  drawer: {
    base: "flex h-12 items-center justify-center rounded-2xl border-2 text-base font-bold transition",
    on: "border-plum-600 bg-plum-50 text-plum-800",
    off: "border-silver-200 bg-white text-ink hover:border-plum-300",
  },
};

function SwitchView({ variant, lang, pathname }: { variant: Variant; lang: Lang; pathname: string }) {
  const router = useRouter();

  function onClick(e: MouseEvent<HTMLAnchorElement>, target: Lang) {
    // Let the browser handle new-tab / modified clicks.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (target === lang) return;
    router.push(switchPath(pathname, target) + window.location.search + window.location.hash);
  }

  const label = lang === "es" ? "Idioma" : "Language";
  return (
    <nav aria-label={label} className={WRAP[variant]}>
      {LANGS.map((l) => {
        const active = l === lang;
        const s = ITEM[variant];
        return (
          <a
            key={l}
            href={switchPath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            aria-label={LANG_META[l].label}
            onClick={(e) => onClick(e, l)}
            className={`${s.base} ${active ? s.on : s.off}`}
          >
            {variant === "drawer" ? LANG_META[l].label : LANG_META[l].short}
          </a>
        );
      })}
    </nav>
  );
}

function WithPath({ variant }: { variant: Variant }) {
  const lang = useLang();
  return <SwitchView variant={variant} lang={lang} pathname={usePathname()} />;
}

/** EN | ES toggle that keeps you on the same page (and query string) in the other language. */
export function LanguageSwitch({ variant = "pill" }: { variant?: Variant }) {
  const lang = useLang();
  return (
    <Suspense fallback={<SwitchView variant={variant} lang={lang} pathname={lang === "es" ? "/es" : "/"} />}>
      <WithPath variant={variant} />
    </Suspense>
  );
}
