import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SITE } from "@/lib/site";

import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy-policy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/privacy-policy", {
    title: t("Privacy Policy", "Política de privacidad"),
    description: t(
      `How ${SITE.name} collects, uses and protects the information you share through our website.`,
      `Cómo ${SITE.name} recopila, usa y protege la información que usted comparte a través de nuestro sitio web.`,
    ),
  });
}

export default async function PrivacyPage() {
  const { lang, t } = await getI18n();
  return (
    <>
      <PageHero
        crumbs={[{ name: t("Privacy Policy", "Política de privacidad"), path: "/privacy-policy" }]}
        title={t("Privacy Policy", "Política de privacidad")}
        lead={t("Last updated: November 2026", "Última actualización: noviembre de 2026")}
      />
      <section className="section bg-white">
        <div className="container-x">
          <article className="prose-ecc mx-auto max-w-3xl">
            {lang === "es" ? (
              <>
            <p>
              {SITE.name} (&ldquo;nosotros&rdquo; o &ldquo;nuestro&rdquo;) respeta su privacidad. Esta política explica qué información
              recopilamos a través de este sitio web, cómo la usamos y las opciones que usted tiene.
            </p>

            <h2>Información que recopilamos</h2>
            <p>
              Cuando envía una solicitud de reservación, una solicitud de estimado con fotos, una reseña o el formulario de contacto,
              recopilamos la información que usted proporciona, que puede incluir:
            </p>
            <ul>
              <li>Su nombre, número de teléfono y correo electrónico</li>
              <li>Dirección de la propiedad, ciudad, código postal y datos de la propiedad (tipo, recámaras, baños, pies cuadrados)</li>
              <li>El servicio solicitado, las fechas y horas preferidas y las instrucciones especiales</li>
              <li>Las fotos que sube de las áreas que desea limpiar</li>
              <li>Las reseñas y calificaciones que decide enviar</li>
            </ul>
            <p>
              Como la mayoría de los sitios web, nuestro proveedor de alojamiento puede registrar automáticamente información técnica
              básica, como su dirección IP, el tipo de navegador y las páginas visitadas. Si Google Analytics está activado, usa cookies
              para ayudarnos a entender cómo los visitantes usan el sitio.
            </p>

            <h2>Cómo usamos su información</h2>
            <ul>
              <li>Para responder a sus solicitudes y preparar estimados de limpieza</li>
              <li>Para programar, confirmar y realizar los servicios de limpieza</li>
              <li>Para comunicarnos con usted por teléfono, mensaje de texto o correo electrónico sobre su solicitud</li>
              <li>Para publicar las reseñas que envíe (solo con su consentimiento y después de verificarlas)</li>
              <li>Para mantener el sitio seguro y evitar el spam o el abuso</li>
              <li>Para mejorar nuestro sitio web y nuestros servicios</li>
            </ul>

            <h2>Fotos</h2>
            <p>
              Las fotos que sube o nos envía por texto se usan únicamente para revisar su solicitud y preparar su estimado. No se
              publican en nuestro sitio web. Las fotos de antes y después que aparecen en nuestra galería las agrega nuestro equipo a
              partir de trabajos terminados.
            </p>

            <h2>Cómo compartimos la información</h2>
            <p>
              No vendemos ni alquilamos su información personal. Solo compartimos información con proveedores de servicios que nos
              ayudan a operar nuestro negocio y sitio web (como alojamiento web y envío de correo electrónico), o cuando la ley lo
              exige.
            </p>

            <h2>Mensajes de texto</h2>
            <p>
              Si nos envía un texto o nos pide que nos comuniquemos con usted por texto, usaremos su número para hablar sobre su
              solicitud y su servicio de limpieza. Pueden aplicar tarifas de mensajes y datos. Puede pedirnos que dejemos de enviarle
              mensajes de texto en cualquier momento.
            </p>

            <h2>Seguridad y conservación de datos</h2>
            <p>
              Nuestro sitio web usa cifrado HTTPS y los formularios se almacenan de forma segura, con acceso limitado a nuestro equipo.
              Conservamos la información solo el tiempo necesario para los fines descritos arriba o según lo exija la ley.
            </p>

            <h2>Sus opciones</h2>
            <p>
              Puede pedirnos que le demos acceso, corrijamos o eliminemos la información personal que nos ha compartido, contactándonos
              con los datos que aparecen abajo.
            </p>

            <h2>Privacidad de los menores</h2>
            <p>Este sitio web no está dirigido a menores de 13 años y no recopilamos a sabiendas su información.</p>

            <h2>Cambios a esta política</h2>
            <p>Podemos actualizar esta política de vez en cuando. La fecha de &ldquo;última actualización&rdquo; indica la versión más reciente.</p>

            <h2>Contáctenos</h2>
            <p>
              {SITE.name}
              <br />
              {SITE.city}, {SITE.stateName}
              <br />
              Teléfono/texto: <a href={SITE.phones.primary.tel}>{SITE.phones.primary.display}</a> ·{" "}
              <a href={SITE.phones.secondary.tel}>{SITE.phones.secondary.display}</a>
              <br />
              Correo electrónico: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </>
            ) : (
              <>
            <p>
              {SITE.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This policy explains what
              information we collect through this website, how we use it, and the choices you have.
            </p>

            <h2>Information we collect</h2>
            <p>When you submit a booking request, photo estimate request, review or contact form, we collect the information you provide, which may include:</p>
            <ul>
              <li>Your name, phone number and email address</li>
              <li>Property address, city, ZIP code and property details (type, bedrooms, bathrooms, square footage)</li>
              <li>Your requested service, preferred dates and times, and special instructions</li>
              <li>Photos you upload of the areas you would like cleaned</li>
              <li>Reviews and ratings you choose to submit</li>
            </ul>
            <p>
              Like most websites, our hosting provider may automatically record basic technical information such as your IP
              address, browser type and pages visited. If Google Analytics is enabled, it uses cookies to help us understand how
              visitors use the site.
            </p>

            <h2>How we use your information</h2>
            <ul>
              <li>To respond to your requests and provide cleaning estimates</li>
              <li>To schedule, confirm and perform cleaning services</li>
              <li>To contact you by phone, text message or email about your request</li>
              <li>To publish reviews you submit (only after you consent and we verify them)</li>
              <li>To keep the website secure and prevent spam or abuse</li>
              <li>To improve our website and services</li>
            </ul>

            <h2>Photos</h2>
            <p>
              Photos you upload or text to us are used only to review your request and prepare your estimate. They are not
              published on our website. Before-and-after photos shown in our gallery are added by our team from completed jobs.
            </p>

            <h2>How we share information</h2>
            <p>
              We do not sell or rent your personal information. We share information only with service providers that help us run
              our business and website (such as web hosting and email delivery), or when required by law.
            </p>

            <h2>Text messages</h2>
            <p>
              If you text us or ask us to contact you by text, we will use your number to communicate about your cleaning request
              and service. Message and data rates may apply. You can ask us to stop texting you at any time.
            </p>

            <h2>Data security & retention</h2>
            <p>
              Our website uses HTTPS encryption, and form submissions are stored securely with access limited to our team. We keep
              information only as long as needed for the purposes described above or as required by law.
            </p>

            <h2>Your choices</h2>
            <p>
              You may ask us to access, correct or delete the personal information you have shared with us by contacting us using
              the details below.
            </p>

            <h2>Children&apos;s privacy</h2>
            <p>This website is not intended for children under 13, and we do not knowingly collect their information.</p>

            <h2>Changes to this policy</h2>
            <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above reflects the latest version.</p>

            <h2>Contact us</h2>
            <p>
              {SITE.name}
              <br />
              {SITE.city}, {SITE.stateName}
              <br />
              Phone/Text: <a href={SITE.phones.primary.tel}>{SITE.phones.primary.display}</a> ·{" "}
              <a href={SITE.phones.secondary.tel}>{SITE.phones.secondary.display}</a>
              <br />
              Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
