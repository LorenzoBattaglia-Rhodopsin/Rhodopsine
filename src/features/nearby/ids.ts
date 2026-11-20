import { routes } from "@/data/site";

/**
 * ID DELLE SCHEDE — formato dell'estratto OSM: n123 / w456 / r789
 * (node / way / relation). Unica regola di validazione, usata sia dalla lista
 * (client) sia dalla pagina di dettaglio (server) PRIMA di qualsiasi lookup.
 */
export const PROFESSIONAL_ID_RE = /^[nwr][1-9]\d{0,14}$/;

export function isProfessionalId(value: unknown): value is string {
  return typeof value === "string" && PROFESSIONAL_ID_RE.test(value);
}

/** URL della scheda di dettaglio (null se l'id non è valido). */
export function professionalHref(id: string): string | null {
  return isProfessionalId(id) ? `${routes.professionals}/${id}` : null;
}

const OSM_TYPE = { n: "node", w: "way", r: "relation" } as const;

/** Pagina dell'elemento su openstreetmap.org (per verifiche e correzioni). */
export function osmElementUrl(id: string): string {
  const type = OSM_TYPE[id[0] as keyof typeof OSM_TYPE];
  return `https://www.openstreetmap.org/${type}/${id.slice(1)}`;
}
