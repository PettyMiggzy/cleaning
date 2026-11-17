import Link from "next/link";
import { Icon, Sparkle } from "@/components/Icon";
import { SITE } from "@/lib/site";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { t, href } = await getI18n();
  return (
    <div className="bg-lavender grid min-h-[70dvh] place-items-center px-5 py-20 text-center">
      <div className="max-w-xl">
        <Sparkle className="animate-twinkle mx-auto size-8 text-plum-400" />
        <p className="mt-4 font-script text-5xl text-plum-700">{t("Oops!", "¡Ay!")}</p>
        <h1 className="display mt-2">{t("This page has been swept away", "Esta página fue barrida")}</h1>
        <p className="lead mt-5">
          {t("The page you're looking for doesn't exist or has moved.", "La página que busca no existe o fue movida.")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={href("/")} className="btn btn-primary">
            <Icon name="home" className="size-5" /> {t("Back to Home", "Volver al inicio")}
          </Link>
          <a href={SITE.phones.primary.tel} className="btn btn-outline">
            <Icon name="phone" className="size-5" /> {t("Call", "Llamar al")} {SITE.phones.primary.display}
          </a>
        </div>
      </div>
    </div>
  );
}
