import Link from "next/link";
import { Icon, Sparkle } from "@/components/Icon";
import { SITE } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="bg-lavender grid min-h-dvh place-items-center px-5 py-20 text-center">
      <div className="max-w-xl">
        <Sparkle className="animate-twinkle mx-auto size-8 text-plum-400" />
        <p className="mt-4 font-script text-5xl text-plum-700">Oops!</p>
        <h1 className="display mt-2">This page has been swept away</h1>
        <p className="lead mt-5">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Icon name="home" className="size-5" /> Back to Home
          </Link>
          <a href={SITE.phones.primary.tel} className="btn btn-outline">
            <Icon name="phone" className="size-5" /> Call {SITE.phones.primary.display}
          </a>
        </div>
      </div>
    </main>
  );
}
