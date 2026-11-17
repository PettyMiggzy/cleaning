import { SITE } from "./site";

/**
 * Spanish (US) translation of the FAQ groups in ./faqs.ts.
 * Same groups, same order, same items.
 */
export const FAQ_GROUPS_ES: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Precios",
    items: [
      {
        q: "¿Cómo funcionan sus precios?",
        a: "Cobramos por hora para todo el equipo: 2 profesionales de limpieza cuestan $100/hora, 3 cuestan $150/hora y 4 cuestan $200/hora. La tarifa por hora cubre a todo el equipo, no a cada persona.",
      },
      {
        q: "¿Hay un mínimo?",
        a: "Sí. Cada reservación tiene un mínimo de 2 horas: $200 para 2 profesionales, $300 para 3 y $400 para 4.",
      },
      {
        q: "¿Cuánto cuesta la limpieza profunda?",
        a: "La limpieza profunda es 25–30% adicional a la tarifa por hora del equipo, porque incluye trabajo detallado como zoclos, ventiladores, persianas, frentes de gabinetes y lechada.",
      },
      {
        q: "¿Cómo se cotizan las limpiezas de mudanza (entrada y salida), comerciales y especiales?",
        a: "Son estimados personalizados. Envíenos fotos de la propiedad y le recomendaremos el tamaño del equipo, estimaremos el tiempo y le daremos un precio antes de programar la cita.",
      },
      {
        q: "¿Ofrecen descuentos por limpieza recurrente?",
        a: "Sí, hay descuentos para limpieza semanal y quincenal con aprobación.",
      },
      {
        q: "¿Los precios del sitio web son finales?",
        a: "Los precios y los tiempos de realización que aparecen en el sitio web son estimados. Su tiempo y precio finales se confirman después de que revisamos su solicitud (y las fotos, si las envía) y usted los aprueba.",
      },
    ],
  },
  {
    title: "Reservaciones y estimados",
    items: [
      {
        q: "¿Cómo sé cuántas horas necesito?",
        a: "Envíenos fotos de los cuartos o las áreas que desea limpiar. Las revisaremos, le recomendaremos el tamaño de equipo adecuado, estimaremos cuánto durará el trabajo y le daremos un precio estimado, gratis.",
      },
      {
        q: "¿Cómo envío las fotos?",
        a: `Súbalas en nuestra página de estimado con fotos, o envíelas por texto directamente al ${SITE.phones.primary.display} (principal) o al ${SITE.phones.secondary.display} (secundario).`,
      },
      {
        q: "¿Mi cita queda confirmada al enviar una solicitud de reservación?",
        a: "Todavía no. Las reservaciones en línea son solicitudes. Nos comunicaremos con usted por llamada o texto para confirmar la fecha, la hora de llegada, el equipo y el precio estimado. Su cita queda confirmada una vez que ambos la aprobamos.",
      },
      {
        q: "¿Hablan español?",
        a: "¡Sí! Nuestro equipo habla inglés y español: ¡hablamos español! Llame o envíe un texto en el idioma que prefiera, y elija su idioma preferido en cualquiera de nuestros formularios.",
      },
      {
        q: "¿Puedo llamarles o enviarles un texto?",
        a: `¡Sí! Los dos números reciben llamadas y mensajes de texto: ${SITE.phones.primary.display} y ${SITE.phones.secondary.display}.`,
      },
      {
        q: "¿Tengo que estar en casa durante la limpieza?",
        a: "No necesariamente. Indíquenos los datos de acceso (llave, caja de llaves o lockbox, o código de la puerta) en su solicitud y confirmaremos los detalles con usted antes de su cita.",
      },
    ],
  },
  {
    title: "Servicios y zonas",
    items: [
      {
        q: "¿Qué zonas atienden?",
        a: "Tenemos nuestra base en Spring, TX y atendemos Spring, Klein, The Woodlands, Tomball, Cypress, Humble, Kingwood y Conroe.",
      },
      {
        q: "¿Limpian negocios?",
        a: "Sí. Limpiamos oficinas, negocios pequeños, tiendas, salones de belleza, barberías, oficinas de arrendamiento, casas club y áreas comunes de apartamentos. La limpieza comercial se cotiza con un estimado personalizado.",
      },
      {
        q: "¿Debo hacer algo antes de que lleguen los profesionales de limpieza?",
        a: "Recoger el desorden, los juguetes y los platos permite que nuestro equipo dedique más tiempo a limpiar. Si desea que limpiemos el interior de los gabinetes o del refrigerador, por favor vacíelos primero. Avísenos sobre mascotas, códigos de alarma o estacionamiento en sus instrucciones especiales.",
      },
      {
        q: "¿Qué pasa si la limpieza toma más o menos tiempo del estimado?",
        a: "Los estimados se basan en los detalles y las fotos que usted comparte. Si vemos que el trabajo necesita una cantidad de tiempo distinta, lo hablaremos con usted.",
      },
      {
        q: "¿Está bien si tengo mascotas?",
        a: "¡Nos encantan las mascotas! Solo cuéntenos sobre ellas en sus instrucciones especiales para que nuestro equipo sepa qué esperar.",
      },
    ],
  },
];
