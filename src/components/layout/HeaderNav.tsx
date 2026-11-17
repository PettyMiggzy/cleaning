"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { Icon, Sparkle } from "../Icon";
import { Logo } from "./Logo";

export type NavLink = { href: string; label: string; note?: string; featured?: boolean };
export type NavGroup = { label: string; href: string; links?: NavLink[] };

/** The pathname is only known at request time for some routes, so it streams in behind Suspense. */
export function HeaderNav({ groups }: { groups: NavGroup[] }) {
  return (
    <Suspense fallback={<HeaderNavInner groups={groups} pathname="" />}>
      <HeaderNavWithPath groups={groups} />
    </Suspense>
  );
}

function HeaderNavWithPath({ groups }: { groups: NavGroup[] }) {
  return <HeaderNavInner groups={groups} pathname={usePathname()} />;
}

function HeaderNavInner({ groups, pathname }: { groups: NavGroup[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => !!pathname && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled ? "border-silver-200/80 bg-white/90 shadow-soft backdrop-blur-xl" : "border-transparent bg-white"
      }`}
    >
      <div className="container-x flex h-[4.75rem] items-center justify-between gap-4 lg:h-[5.5rem]">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {groups.map((g) =>
            g.links ? (
              <div key={g.label} className="group relative">
                <Link
                  href={g.href}
                  className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.9rem] font-semibold transition-colors hover:text-plum-700 ${
                    isActive(g.href) ? "text-plum-700" : "text-ink"
                  }`}
                  aria-haspopup="true"
                >
                  {g.label}
                  <Icon name="chevronDown" className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute top-full left-1/2 z-50 w-[22rem] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="silver-ring card overflow-hidden bg-white p-2 shadow-lift">
                    {g.links.map((l) => (
                      <Link
                        key={l.href + l.label}
                        href={l.href}
                        className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-plum-50 ${
                          l.featured ? "mt-1 border-t border-silver-100 bg-plum-50/60" : ""
                        }`}
                      >
                        <span>
                          <span className={`block text-[0.95rem] font-semibold ${l.featured ? "text-plum-700" : "text-ink"}`}>
                            {l.label}
                          </span>
                          {l.note && <span className="block text-xs text-muted">{l.note}</span>}
                        </span>
                        <Icon name="chevronRight" className="size-4 text-plum-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={g.label}
                href={g.href}
                className={`rounded-full px-3.5 py-2 text-[0.9rem] font-semibold transition-colors hover:text-plum-700 ${
                  isActive(g.href) ? "text-plum-700" : "text-ink"
                }`}
              >
                {g.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE.phones.primary.tel}
            className="silver-ring card hidden size-12 place-items-center rounded-full text-plum-700 transition hover:shadow-soft sm:grid xl:hidden 2xl:grid"
            aria-label={`Call ${SITE.phones.primary.display}`}
          >
            <Icon name="phone" />
          </a>
          <Link href="/book" className="btn btn-primary hidden md:inline-flex">
            <Icon name="calendar" className="size-5" />
            Book Your Cleaning
          </Link>
          <button
            type="button"
            className="silver-ring card grid size-12 place-items-center rounded-full text-ink xl:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" className="size-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] xl:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={`absolute inset-0 bg-plum-950/40 backdrop-blur-sm transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-500 ease-[var(--ease-lux)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-silver-100 px-5 py-4">
            <Logo size={46} />
            <button
              type="button"
              className="silver-ring card grid size-11 place-items-center rounded-full"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <Icon name="x" className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 px-3 py-4">
            <Link href="/" className="block rounded-2xl px-4 py-3 text-lg font-semibold text-ink hover:bg-plum-50">
              Home
            </Link>
            {groups.map((g) =>
              g.links ? (
                <div key={g.label}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-lg font-semibold text-ink hover:bg-plum-50"
                    aria-expanded={expanded === g.label}
                    onClick={() => setExpanded(expanded === g.label ? null : g.label)}
                  >
                    {g.label}
                    <Icon
                      name="chevronDown"
                      className={`size-5 text-plum-600 transition-transform ${expanded === g.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      expanded === g.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-4 border-l-2 border-plum-100 py-1 pl-3">
                        {g.links.map((l) => (
                          <Link
                            key={l.href + l.label}
                            href={l.href}
                            className={`block rounded-xl px-3 py-2.5 text-[1rem] hover:bg-plum-50 ${
                              l.featured ? "font-semibold text-plum-700" : "text-ink-soft"
                            }`}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={g.label}
                  href={g.href}
                  className="block rounded-2xl px-4 py-3 text-lg font-semibold text-ink hover:bg-plum-50"
                >
                  {g.label}
                </Link>
              ),
            )}
          </nav>

          <div className="space-y-3 border-t border-silver-100 bg-plum-50/60 p-5">
            <Link href="/book" className="btn btn-primary w-full">
              <Icon name="calendar" className="size-5" /> Book Your Cleaning
            </Link>
            <Link href="/photo-estimate" className="btn btn-outline w-full">
              <Icon name="camera" className="size-5" /> Send Pictures for a Free Estimate
            </Link>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[SITE.phones.primary, SITE.phones.secondary].map((p, i) => (
                <div key={p.e164} className="rounded-2xl bg-white p-3 text-center shadow-soft">
                  <p className="text-[0.65rem] font-bold tracking-[0.15em] text-plum-700 uppercase">
                    {i === 0 ? "Primary" : "Secondary"}
                  </p>
                  <p className="font-semibold text-ink">{p.display}</p>
                  <div className="mt-2 flex justify-center gap-2">
                    <a href={p.tel} className="grid size-10 place-items-center rounded-full bg-plum-700 text-white" aria-label={`Call ${p.display}`}>
                      <Icon name="phone" className="size-4" />
                    </a>
                    <a href={p.sms} className="grid size-10 place-items-center rounded-full bg-plum-100 text-plum-800" aria-label={`Text ${p.display}`}>
                      <Icon name="message" className="size-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p className="flex items-center justify-center gap-2 pt-1 text-center font-script text-2xl text-plum-700">
              <Sparkle className="size-3" /> {SITE.slogan} <Sparkle className="size-3" />
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
