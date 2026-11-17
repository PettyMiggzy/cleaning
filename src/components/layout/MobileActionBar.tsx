import Link from "next/link";
import { SITE } from "@/lib/site";
import { Icon } from "../Icon";

/** Sticky conversion bar on phones: Call · Text · Photos · Book */
export function MobileActionBar() {
  const items = [
    { href: SITE.phones.primary.tel, label: "Call", icon: "phone" as const, external: true },
    { href: SITE.phones.primary.sms, label: "Text", icon: "message" as const, external: true },
    { href: "/photo-estimate", label: "Photos", icon: "camera" as const },
    { href: "/book", label: "Book", icon: "calendar" as const, primary: true },
  ];
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-silver-200 bg-white/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-12px_rgba(74,33,120,.25)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-4 gap-1.5">
        {items.map((it) => {
          const cls = `flex flex-col items-center justify-center gap-0.5 rounded-2xl py-2 text-[0.72rem] font-bold tracking-wide ${
            it.primary ? "bg-gradient-to-br from-plum-600 to-plum-800 text-white shadow-glow" : "text-plum-800 active:bg-plum-50"
          }`;
          return it.external ? (
            <a key={it.label} href={it.href} className={cls}>
              <Icon name={it.icon} className="size-5" />
              {it.label}
            </a>
          ) : (
            <Link key={it.label} href={it.href} className={cls}>
              <Icon name={it.icon} className="size-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
