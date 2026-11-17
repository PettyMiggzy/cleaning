import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

// The admin area is its own root layout (English only, no public site chrome).
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh antialiased">
        <div className="min-h-dvh bg-[#f7f5fa]">{children}</div>
      </body>
    </html>
  );
}
