"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { SITE } from "@/lib/site";

export function Logo({ light = false, size = 54 }: { light?: boolean; size?: number }) {
  const { t, href } = useI18n();
  return (
    <Link href={href("/")} className="group flex items-center gap-3" aria-label={`${SITE.name} — ${t("home", "inicio")}`}>
      <span
        className="relative block h-[var(--logo)] w-[var(--logo)] shrink-0 rounded-full p-[2px] shadow-soft transition-transform duration-500 group-hover:rotate-6 max-[400px]:h-11 max-[400px]:w-11"
        style={{
          ["--logo" as string]: `${size}px`,
          background: "linear-gradient(140deg,#fbfbfc,#bfc3cb 30%,#ffffff 50%,#9ea3ad 75%,#eceef2)",
        }}
      >
        <Image
          src="/brand/emilis-cleaning-co-logo.webp"
          alt=""
          width={size * 2}
          height={size * 2}
          className="size-full rounded-full"
          priority
        />
      </span>
      <span className="flex shrink-0 flex-col leading-none whitespace-nowrap">
        <span className={`script text-[1.8rem] sm:text-[2.05rem] ${light ? "text-white" : "text-ink"}`}>Emili&apos;s</span>
        <span
          className={`-mt-1 pl-1 text-[0.56rem] font-bold tracking-[0.26em] uppercase sm:text-[0.62rem] sm:tracking-[0.3em] ${
            light ? "text-plum-200" : "text-plum-700"
          }`}
        >
          Cleaning Co.
        </span>
      </span>
    </Link>
  );
}
