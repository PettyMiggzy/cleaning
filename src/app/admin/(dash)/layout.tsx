import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/layout/Logo";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { logout } from "../actions";
import { AdminNav } from "./AdminNav";

export default function DashLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center text-muted">
          <span className="size-8 animate-spin rounded-full border-2 border-plum-200 border-t-plum-600" />
        </div>
      }
    >
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const subs = await store().listSubmissions().catch(() => []);
  const newCount = subs.filter((s) => s.status === "new").length;

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-silver-200 bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:py-6">
          <Logo size={44} />
          <form action={logout} className="lg:hidden">
            <button className="btn btn-outline btn-sm" type="submit">
              <Icon name="logout" className="size-4" /> Sign out
            </button>
          </form>
        </div>
        <AdminNav newCount={newCount} />
        <div className="hidden space-y-2 px-4 pt-6 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-plum-50 hover:text-plum-700">
            <Icon name="external" className="size-4" /> View website
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-plum-50 hover:text-plum-700" type="submit">
              <Icon name="logout" className="size-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
