/**
 * Spanish (US) translations of the service pages in ./service-pages.ts.
 * Keys are the English slugs; array lengths mirror the English content exactly.
 */
export type ServicePageEs = {
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  kicker: string;
  imageAlt: string;
  intro: string[];
  included: { title: string; items: string[] }[];
  idealFor: string[];
  pricingNote: string;
  faqs: { q: string; a: string }[];
};

/* Blocks shared by the routine-cleaning pages (house, apartment, maid service). */
const KITCHEN_STANDARD = {
  title: "Cocina",
  items: [
    "Encimeras y backsplash limpiados y desinfectados",
    "Fregadero y llave tallados hasta dejarlos brillantes",
    "Exteriores de electrodomésticos y microondas limpios",
    "Manchas limpiadas en los frentes de los gabinetes",
    "Pisos aspirados y trapeados",
  ],
};

const BATHROOMS_STANDARD = {
  title: "Baños",
  items: [
    "Inodoros limpios y desinfectados por dentro y por fuera",
    "Duchas y bañeras talladas",
    "Lavabos, encimeras y accesorios pulidos",
    "Espejos y vidrios sin rayas",
    "Pisos limpios y trapeados",
  ],
};

const BEDROOMS_STANDARD = {
  title: "Recámaras y áreas de estar",
  items: [
    "Polvo quitado de muebles y superficies al alcance",
    "Ventiladores de techo y lámparas desempolvados",
    "Camas tendidas (cambio de sábanas si lo solicita)",
    "Espejos y vidrios interiores limpios",
    "Basura sacada",
  ],
};

const THROUGHOUT_STANDARD = {
  title: "En todo el hogar",
  items: [
    "Alfombras y tapetes aspirados",
    "Pisos duros trapeados",
    "Zoclos desempolvados",
    "Interruptores de luz y manijas de puertas limpiados",
    "Escaleras y pasillos limpios",
  ],
};

export const SERVICE_PAGES_ES: Record<string, ServicePageEs> = {
  "house-cleaning": {
    navLabel: "Limpieza de casas",
    metaTitle: "Limpieza de casas en Spring, TX",
    metaDescription:
      "Limpieza de casas en Spring, TX. Equipos de 2 a 4 personas desde $100/hora para todo el equipo y estimado gratis con fotos. Llame o envíe un texto al (281) 662-9871.",
    h1: "Limpieza de casas en Spring, TX",
    kicker: "Limpieza residencial",
    imageAlt:
      "Profesional de limpieza de Emili's Cleaning Co. llegando a una casa en Texas con sus productos de limpieza",
    intro: [
      "Llegue a casa y encuentre un hogar fresco, tranquilo y cuidado hasta el último detalle. Emili's Cleaning Co. ofrece limpieza de casas profesional en Spring, Klein, The Woodlands y las comunidades cercanas.",
      "Elija una limpieza única o programe un servicio semanal, quincenal o mensual. Usted escoge el tamaño del equipo, nosotros nos encargamos de los detalles, y siempre conocerá la tarifa por hora desde el principio.",
    ],
    included: [KITCHEN_STANDARD, BATHROOMS_STANDARD, BEDROOMS_STANDARD, THROUGHOUT_STANDARD],
    idealFor: [
      "Familias y profesionales muy ocupados",
      "Preparar la casa para recibir visitas o para las fiestas",
      "Mantenimiento recurrente semanal o quincenal",
      "Casas de todos los tamaños, desde casas adosadas (townhouses) hasta grandes residencias",
    ],
    pricingNote:
      "La limpieza de casas se cobra por hora para todo el equipo, con un mínimo de 2 horas. Los clientes semanales y quincenales pueden calificar para descuentos con aprobación.",
    faqs: [
      {
        q: "¿Cuántas horas tomará la limpieza de mi casa?",
        a: "Depende del tamaño y del estado de su casa, y del tamaño del equipo que elija. La forma más fácil de saberlo es enviarnos fotos: le recomendaremos un equipo y estimaremos el tiempo antes de programar la cita.",
      },
      {
        q: "¿Puedo elegir en qué áreas de la casa se enfocan?",
        a: "Por supuesto. Anote sus prioridades en las instrucciones especiales al reservar y nuestro equipo se enfocará en lo que más le importa.",
      },
    ],
  },

  "apartment-cleaning": {
    navLabel: "Limpieza de apartamentos",
    metaTitle: "Limpieza de apartamentos en Spring, TX",
    metaDescription:
      "Limpieza de apartamentos y condominios en Spring, TX: regular, profunda y de mudanza (salida). Precios por hora claros. Llame o envíe un texto al (281) 662-9871.",
    h1: "Limpieza de apartamentos en Spring, TX",
    kicker: "Apartamentos · condominios · casas adosadas",
    imageAlt: "Profesional de limpieza aspirando la sala de un apartamento moderno y luminoso",
    intro: [
      "Vivir en un apartamento debería ser fácil. Nuestro servicio de limpieza de apartamentos le entrega una cocina impecable, baños relucientes y espacios frescos, sin quitarle su fin de semana.",
      "Limpiamos apartamentos, condominios y casas adosadas (townhouses) de cualquier distribución en Spring y comunidades cercanas, desde limpiezas rápidas de rutina hasta una limpieza de mudanza (salida) detallada antes de su inspección.",
    ],
    included: [KITCHEN_STANDARD, BATHROOMS_STANDARD, BEDROOMS_STANDARD, THROUGHOUT_STANDARD],
    idealFor: [
      "Apartamentos tipo estudio y de 1, 2 y 3 recámaras",
      "Condominios y casas adosadas",
      "Personas que comparten apartamento y quieren una limpieza constante",
      "Mudanza de entrada y de salida de apartamentos",
    ],
    pricingNote:
      "La mayoría de los apartamentos son perfectos para nuestro equipo de 2 profesionales de limpieza por $100/hora para todo el equipo (mínimo de 2 horas). La limpieza de mudanza (salida) de apartamentos se cotiza con un estimado personalizado.",
    faqs: [
      {
        q: "¿Limpian apartamentos para la inspección de salida?",
        a: "Sí. La limpieza de mudanza (salida) de apartamentos es una de nuestras especialidades. Envíenos fotos de la unidad y le daremos un estimado personalizado.",
      },
      {
        q: "¿Cómo entran a mi apartamento?",
        a: "Incluya los datos de acceso (llave, caja de llaves o lockbox, código de la puerta o indicaciones para la recepción) en su solicitud y confirmaremos los detalles con usted antes de su cita.",
      },
    ],
  },

  "maid-services": {
    navLabel: "Servicio de limpieza doméstica",
    metaTitle: "Servicio de limpieza doméstica en Spring, TX",
    metaDescription:
      "Servicio de limpieza doméstica en Spring, TX: semanal, quincenal o mensual, con descuentos con aprobación. Llame o envíe un texto al (281) 662-9871.",
    h1: "Servicio de limpieza doméstica en Spring, TX",
    kicker: "Servicio de limpieza del hogar recurrente",
    imageAlt:
      "Profesional de limpieza tendiendo una cama con sábanas blancas impecables y una manta color lavanda",
    intro: [
      "Nuestro servicio de limpieza doméstica mantiene su hogar limpio de manera constante para que usted dedique su tiempo a las personas y las cosas que ama. Los mismos altos estándares, en cada visita.",
      "Elija servicio de limpieza del hogar semanal, quincenal o mensual. Los clientes recurrentes pueden calificar para descuentos con aprobación; solo pregúntenos al reservar.",
    ],
    included: [
      KITCHEN_STANDARD,
      BATHROOMS_STANDARD,
      BEDROOMS_STANDARD,
      {
        title: "Extras de limpieza del hogar",
        items: [
          "Tendido de camas y cambio de sábanas",
          "Ropa doblada",
          "Lavado de trastes (servicio adicional)",
          "Pelo de mascotas removido",
          "Botes de basura interiores vaciados",
        ],
      },
    ],
    idealFor: [
      "Mantenimiento semanal o quincenal del hogar",
      "Padres ocupados y profesionales que trabajan",
      "Dueños de mascotas",
      "Quienes quieren una casa siempre limpia",
    ],
    pricingNote:
      "El servicio de limpieza doméstica se cobra por hora para todo el equipo, con un mínimo de 2 horas. Hay descuentos semanales y quincenales con aprobación.",
    faqs: [
      {
        q: "¿Ofrecen descuentos por servicio de limpieza doméstica recurrente?",
        a: "Sí, hay descuentos para limpieza semanal y quincenal con aprobación. Mencione la frecuencia que desea al reservar.",
      },
      {
        q: "¿Pueden encargarse de la ropa y cambiar las sábanas de las camas?",
        a: "Sí. El tendido de camas, el cambio de sábanas y el doblado de ropa se pueden agregar a cualquier visita. Solo déjenos sábanas limpias a la mano.",
      },
    ],
  },

  "deep-cleaning": {
    navLabel: "Limpieza profunda",
    metaTitle: "Limpieza profunda en Spring, TX",
    metaDescription:
      "Limpieza profunda de casas en Spring, TX: zoclos, gabinetes, ventiladores, persianas y lechada. 25–30% adicional a la tarifa por hora. Estimado gratis con fotos.",
    h1: "Limpieza profunda en Spring, TX",
    kicker: "Detalle de arriba a abajo",
    imageAlt:
      "Profesional de limpieza limpiando a mano los zoclos blancos durante una limpieza profunda",
    intro: [
      "Una limpieza profunda llega a los lugares que la limpieza de rutina no alcanza: los zoclos, los frentes de los gabinetes, los ventiladores de techo, las persianas, las líneas de lechada y la mugre acumulada que hace que una casa se sienta cansada.",
      "Es el reinicio perfecto antes de las fiestas, después de una temporada ajetreada, antes de comenzar un servicio recurrente o cuando su hogar necesite un cuidado extra.",
    ],
    included: [
      {
        title: "Limpieza profunda de la cocina",
        items: [
          "Desengrasado de la estufa, el backsplash y las superficies",
          "Frentes y jaladeras de gabinetes limpiados con detalle",
          "Exteriores de electrodomésticos y microondas por dentro y por fuera",
          "Interior del horno y del refrigerador (si lo solicita)",
          "Fregadero, llave y orillas del piso tallados",
        ],
      },
      {
        title: "Limpieza profunda de los baños",
        items: [
          "Residuos de jabón y manchas de agua dura eliminados",
          "Azulejos y lechada tallados",
          "Vidrio de la ducha limpiado con detalle",
          "Accesorios y herrajes pulidos",
          "Inodoros limpiados con detalle, incluida la base",
        ],
      },
      {
        title: "Trabajo de detalle",
        items: [
          "Zoclos limpiados a mano",
          "Ventiladores de techo y lámparas",
          "Persianas y repisas de las ventanas",
          "Marcos de puertas, puertas e interruptores de luz",
          "Ventanas interiores (si lo solicita)",
        ],
      },
      {
        title: "En todo el hogar",
        items: [
          "Desempolvado detallado en zonas altas y bajas",
          "Muebles desempolvados y limpiados",
          "Pisos aspirados y trapeados de orilla a orilla",
          "Escaleras y barandales limpiados con detalle",
          "Gabinetes por dentro (por favor, vacíelos antes)",
        ],
      },
    ],
    idealFor: [
      "Clientes nuevos",
      "Limpieza de temporada, de primavera y de fiestas",
      "Casas que llevan tiempo sin una limpieza profesional",
      "Preparar la casa para visitas, eventos o fotos de venta",
    ],
    pricingNote:
      "La limpieza profunda se cobra a nuestra tarifa por hora del equipo más 25–30% adicional. Envíenos fotos para un estimado de tiempo preciso.",
    faqs: [
      {
        q: "¿Cuál es la diferencia entre limpieza estándar y limpieza profunda?",
        a: "La limpieza estándar mantiene una casa que se limpia con regularidad. La limpieza profunda agrega trabajo de detalle (zoclos, ventiladores, persianas, frentes de gabinetes, lechada y suciedad acumulada) y por lo general toma más tiempo.",
      },
      {
        q: "¿Cuánto más cuesta la limpieza profunda?",
        a: "La limpieza profunda es 25–30% adicional a nuestra tarifa por hora del equipo. Envíenos fotos y estimaremos el tiempo y el precio antes de programar la cita.",
      },
    ],
  },

  "move-in-cleaning": {
    navLabel: "Limpieza de mudanza (entrada)",
    metaTitle: "Limpieza de mudanza (entrada) en Spring, TX",
    metaDescription:
      "Limpieza de mudanza (entrada) en Spring, TX: gabinetes, electrodomésticos, baños y pisos limpios antes de desempacar. Llame o envíe un texto al (281) 662-9871.",
    h1: "Limpieza de mudanza (entrada) en Spring, TX",
    kicker: "Empiece desde cero",
    imageAlt: "Profesional de limpieza trapeando los pisos de una casa vacía antes de la mudanza",
    intro: [
      "Su nuevo hogar debe sentirse suyo desde el primer día. Nuestra limpieza de mudanza (entrada) desinfecta la cocina, los baños, los gabinetes y los pisos para que usted desempaque con tranquilidad.",
      "Las casas vacías son las más fáciles de limpiar a fondo: podemos llegar al interior de cada gabinete, cajón y clóset antes de que lleguen sus cajas.",
    ],
    included: [
      {
        title: "Cocina",
        items: [
          "Gabinetes y cajones limpiados por dentro",
          "Interior del horno, el refrigerador y el microondas",
          "Encimeras, backsplash y fregadero desinfectados",
          "Exteriores de electrodomésticos limpios",
          "Pisos trapeados de orilla a orilla",
        ],
      },
      {
        title: "Baños",
        items: [
          "Inodoros, duchas y bañeras desinfectados",
          "Gabinetes del lavabo y cajones por dentro",
          "Espejos, vidrios y accesorios pulidos",
          "Azulejos y pisos tallados",
        ],
      },
      {
        title: "Toda la casa",
        items: [
          "Clósets y repisas limpiados",
          "Zoclos, puertas y marcos",
          "Repisas y rieles de las ventanas",
          "Interruptores de luz y placas de enchufes",
          "Ventiladores de techo y lámparas desempolvados",
          "Pisos aspirados y trapeados",
        ],
      },
    ],
    idealFor: [
      "Nuevos dueños de casa",
      "Inquilinos que se mudan a apartamentos o casas",
      "Construcción nueva (limpieza final disponible)",
      "Agentes de bienes raíces que preparan una casa para los compradores",
    ],
    pricingNote:
      "La limpieza de mudanza (entrada) se cotiza con un estimado personalizado. Envíenos fotos de la propiedad y le recomendaremos el tamaño del equipo, estimaremos el tiempo y le daremos un precio antes de programar la cita.",
    faqs: [
      {
        q: "¿Cuándo debo programar la limpieza de mudanza (entrada)?",
        a: "Lo ideal es después de que los ocupantes anteriores se hayan mudado y antes de que lleguen sus pertenencias, para que podamos llegar a cada gabinete, clóset y rincón.",
      },
      {
        q: "¿Cómo cotizan la limpieza de mudanza (entrada)?",
        a: "Cada casa vacía es diferente, así que la limpieza de mudanza (entrada) se cotiza con un estimado personalizado. Envíenos fotos y le responderemos con un equipo, un tiempo y un precio recomendados.",
      },
    ],
  },

  "move-out-cleaning": {
    navLabel: "Limpieza de mudanza (salida)",
    metaTitle: "Limpieza de mudanza (salida) en Spring, TX",
    metaDescription:
      "Limpieza de mudanza (salida) y fin de contrato de renta en Spring, TX para inquilinos y propietarios. Estimado con fotos. Llame o envíe un texto al (281) 662-9871.",
    h1: "Limpieza de mudanza (salida) en Spring, TX",
    kicker: "Fin de contrato de renta · propiedades de renta · entre inquilinos",
    imageAlt:
      "Profesional de limpieza trapeando una sala vacía con cajas de mudanza junto a la puerta",
    intro: [
      "Mudarse ya es bastante estresante. Deje que nuestro equipo se encargue de la limpieza para que usted se concentre en su próximo capítulo, y deje su casa anterior lista para la inspección final, los nuevos dueños o los próximos inquilinos.",
      "Ayudamos a inquilinos, dueños de casa, propietarios, agentes de bienes raíces y administradores de propiedades con la limpieza de mudanza (salida), de fin de contrato de renta y entre inquilinos en Spring y zonas cercanas.",
    ],
    included: [
      {
        title: "Cocina",
        items: [
          "Gabinetes y cajones por dentro",
          "Interior del horno, el refrigerador y el microondas",
          "Estufa y backsplash desengrasados",
          "Encimeras y fregadero desinfectados",
          "Pisos trapeados de orilla a orilla",
        ],
      },
      {
        title: "Baños",
        items: [
          "Duchas, bañeras e inodoros tallados",
          "Gabinetes del lavabo y botiquines por dentro",
          "Espejos, vidrios y accesorios",
          "Azulejos y pisos tallados",
        ],
      },
      {
        title: "Toda la casa",
        items: [
          "Clósets y repisas",
          "Zoclos, puertas y marcos",
          "Repisas y rieles de las ventanas",
          "Interruptores de luz y placas de enchufes",
          "Ventiladores de techo y lámparas",
          "Pisos aspirados y trapeados",
        ],
      },
    ],
    idealFor: [
      "Inquilinos que se preparan para la inspección del apartamento",
      "Vendedores de casas antes del cierre",
      "Propietarios y administradores de propiedades entre inquilinos",
      "Limpieza entre huéspedes de Airbnb y de otras rentas vacacionales",
    ],
    pricingNote:
      "La limpieza de mudanza (salida) se cotiza con un estimado personalizado. Envíenos fotos para recibir un estimado gratis de tiempo y precio antes de programar la cita.",
    faqs: [
      {
        q: "¿Necesito estar presente durante la limpieza de mudanza (salida)?",
        a: "No necesariamente. Comparta los datos de acceso en su solicitud y confirmaremos los detalles con usted antes de la cita.",
      },
      {
        q: "¿La casa debe estar vacía?",
        a: "Para obtener los mejores resultados, sí: una casa vacía nos permite limpiar por dentro cada gabinete, clóset y rincón.",
      },
    ],
  },

  "commercial-cleaning": {
    navLabel: "Limpieza comercial",
    metaTitle: "Limpieza comercial y de oficinas en Spring, TX",
    metaDescription:
      "Limpieza comercial y de oficinas en Spring, TX: tiendas, salones de belleza y áreas comunes, incluso fuera de horario. Llame o envíe un texto al (281) 662-9871.",
    h1: "Limpieza comercial y de oficinas en Spring, TX",
    kicker: "Oficinas · tiendas · salones de belleza · áreas comunes",
    imageAlt:
      "Profesional de limpieza comercial limpiando una mesa de conferencias en una oficina moderna y luminosa",
    intro: [
      "Un lugar de trabajo limpio causa una gran impresión en los clientes y mantiene a su equipo cómodo y productivo. Emili's Cleaning Co. ofrece limpieza comercial confiable para negocios en Spring y el norte del área de Houston.",
      "Limpiamos oficinas, negocios pequeños, tiendas, salones de belleza, barberías, oficinas de arrendamiento, casas club y áreas comunes de apartamentos, con un horario recurrente o fuera del horario de atención.",
    ],
    included: [
      {
        title: "Áreas de trabajo",
        items: [
          "Escritorios y superficies despejadas desempolvados y limpiados",
          "Salas de juntas acomodadas",
          "Puertas y divisiones de vidrio",
          "Puntos de mucho contacto desinfectados",
          "Basura y reciclaje vaciados",
        ],
      },
      {
        title: "Baños y salas de descanso",
        items: [
          "Inodoros, lavabos y accesorios desinfectados",
          "Espejos y dispensadores limpiados",
          "Encimeras, fregaderos y mesas de la sala de descanso",
          "Exteriores de microondas y electrodomésticos",
        ],
      },
      {
        title: "Vestíbulo y pisos",
        items: [
          "Recepción, vestíbulo y salas de espera",
          "Vidrios y puertas de entrada",
          "Alfombras aspiradas",
          "Pisos duros trapeados",
        ],
      },
    ],
    idealFor: [
      "Oficinas y oficinas de bienes raíces",
      "Tiendas, salones de belleza y barberías",
      "Oficinas de arrendamiento, casas club y áreas comunes",
      "Servicio fuera de horario y recurrente",
    ],
    pricingNote:
      "La limpieza comercial se cotiza con un estimado personalizado según su espacio, horario y alcance del trabajo. Envíenos fotos o llámenos para programar un recorrido.",
    faqs: [
      {
        q: "¿Pueden limpiar fuera del horario de atención?",
        a: "Sí, ofrecemos limpieza de oficinas fuera de horario para no interrumpir a su equipo ni a sus clientes.",
      },
      {
        q: "¿Ofrecen limpieza comercial recurrente?",
        a: "Sí. Podemos establecer un horario recurrente que se ajuste a su negocio. La limpieza comercial se cotiza con un estimado personalizado.",
      },
    ],
  },
};
