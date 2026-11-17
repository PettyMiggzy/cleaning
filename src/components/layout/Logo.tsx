import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export function Logo({ light = false, size = 54 }: { light?: boolean; size?: number }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${SITE.name} — home`}>
      <span
        className="relative block shrink-0 rounded-full p-[2px] shadow-soft transition-transform duration-500 group-hover:rotate-6"
        style={{
          width: size,
          height: size,
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
      <span className="flex flex-col leading-none">
        <span className={`script text-[2.05rem] ${light ? "text-white" : "text-ink"}`}>Emili&apos;s</span>
        <span
          className={`-mt-1 pl-1 text-[0.62rem] font-bold tracking-[0.3em] uppercase ${
            light ? "text-plum-200" : "text-plum-700"
          }`}
        >
          Cleaning Co.
        </span>
      </span>
    </Link>
  );
}
