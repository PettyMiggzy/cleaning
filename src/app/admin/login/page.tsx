import type { Metadata } from "next";
import { Sparkle } from "@/components/Icon";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="bg-lavender grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo size={60} />
        </div>
        <div className="silver-ring card mt-8 bg-white p-8 shadow-lift" style={{ borderRadius: "2rem" }}>
          <p className="eyebrow">
            <Sparkle className="size-3 text-plum-400" /> Admin Dashboard
          </p>
          <h1 className="mt-3 font-serif text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage requests, services, reviews and the gallery.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
