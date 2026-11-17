// Option lists shared by the forms and the server. The FIRST value is what is submitted and validated
// (always English); the second is the Spanish label shown on /es pages.
export const PROPERTY_TYPE_OPTIONS: [string, string][] = [
  ["House", "Casa"],
  ["Apartment", "Apartamento"],
  ["Condo", "Condominio"],
  ["Townhouse", "Casa adosada (townhouse)"],
  ["Duplex", "Dúplex"],
  ["Office / Commercial", "Oficina / Comercial"],
  ["Retail / Salon", "Tienda / Salón"],
  ["Rental / Airbnb", "Renta / Airbnb"],
  ["Other", "Otro"],
];

export const ARRIVAL_OPTIONS: [string, string][] = [
  ["Morning (8–10 AM)", "Mañana (8–10 AM)"],
  ["Late Morning (10 AM–12 PM)", "Media mañana (10 AM–12 PM)"],
  ["Afternoon (12–3 PM)", "Tarde (12–3 PM)"],
  ["Late Afternoon (3–5 PM)", "Final de la tarde (3–5 PM)"],
  ["Flexible — any time", "Flexible — a cualquier hora"],
];

export const FREQUENCY_OPTIONS: [string, string][] = [
  ["One-time", "Una sola vez"],
  ["Weekly", "Semanal"],
  ["Biweekly", "Quincenal"],
  ["Monthly", "Mensual"],
];

export const CONTACT_PREF_OPTIONS: [string, string][] = [
  ["Text", "Texto"],
  ["Call", "Llamada"],
  ["Email", "Correo"],
];

export const CONTACT_TOPIC_OPTIONS: [string, string][] = [
  ["General question", "Pregunta general"],
  ["Pricing question", "Pregunta sobre precios"],
  ["Recurring cleaning", "Limpieza recurrente"],
  ["Commercial cleaning", "Limpieza comercial"],
  ["Existing appointment", "Cita existente"],
  ["Other", "Otro"],
];

export const OTHER_CITY: [string, string] = ["Other nearby area", "Otra zona cercana"];

export const PROPERTY_TYPES_SERVER = PROPERTY_TYPE_OPTIONS.map(([v]) => v);
export const ARRIVAL_WINDOWS_SERVER = ARRIVAL_OPTIONS.map(([v]) => v);
