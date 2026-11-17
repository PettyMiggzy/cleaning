"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/requests", label: "Requests", icon: "inbox" },
  { href: "/admin/services", label: "Services", icon: "sparkles" },
  { href: "/admin/reviews", label: "Reviews", icon: "star" },
  { href: "/admin/gallery", label: "Gallery", icon: "image" },
  { href: "/admin/settings", label: "Settings", icon: "sliders" },
];

export function AdminNav({ newCount }: { newCount: number }) {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4 lg:pb-0">
      {ITEMS.map((it) => {
        const active = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.95rem] font-semibold transition ${
              active ? "bg-gradient-to-br from-plum-600 to-plum-800 text-white shadow-glow" : "text-ink hover:bg-plum-50 hover:text-plum-700"
            }`}
          >
            <Icon name={it.icon} className="size-5" />
            {it.label}
            {it.href === "/admin/requests" && newCount > 0 && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${active ? "bg-white text-plum-700" : "bg-plum-600 text-white"}`}>
                {newCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
