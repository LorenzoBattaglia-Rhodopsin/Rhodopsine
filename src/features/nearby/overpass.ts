import type {
  Coordinates,
  Professional,
  ProfessionalKind,
} from "@/types/nearby";
import { haversineKm } from "@/features/nearby/geo";

/**
 * RICERCA PROFESSIONISTI — Overpass API (OpenStreetMap)
 * --------------------------------------------------------------------------
 * La query parte DIRETTAMENTE dal browser verso overpass-api.de con il solo
 * centro di ricerca arrotondato (2 decimali). Nessun dato del test.
 */
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/** Raggi di ricerca (km): si allarga solo se i risultati sono pochi. */
export const SEARCH_RADII_KM = [10, 25] as const;
/** Sotto questa soglia si riprova con il raggio più ampio. */
export const FEW_RESULTS = 5;
/** Timeout lato server (s) e margine lato client. */
const SERVER_TIMEOUT_S = 25;
const CLIENT_TIMEOUT_MS = (SERVER_TIMEOUT_S + 5) * 1000;

/** Specialità oculistica, anche in liste "a;b" (es. "ophthalmology;optometry"). */
const OPHTHALMOLOGY = /(^|;)\s*ophthalmology\s*(;|$)/;

/** Query Overpass QL: ottici, optometristi, oculisti (nodi, way, relation). */
export function buildOverpassQuery(center: Coordinates, radiusKm: number): string {
  const around = `(around:${radiusKm * 1000},${center.lat},${center.lon})`;
  return `[out:json][timeout:${SERVER_TIMEOUT_S}];
(
  nwr["shop"="optician"]${around};
  nwr["healthcare"="optometrist"]${around};
  nwr["healthcare:speciality"~"(^|;) *ophthalmology *(;|$)"]${around};
);
out center tags;`;
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** Oculista se ha la specialità oftalmologica, altrimenti ottico/optometrista. */
export function classify(tags: Record<string, string>): ProfessionalKind {
  const speciality = tags["healthcare:speciality"];
  return speciality && OPHTHALMOLOGY.test(speciality)
    ? "ophthalmologist"
    : "optician";
}

const FALLBACK_NAME: Record<ProfessionalKind, string> = {
  ophthalmologist: "Studio oculistico",
  optician: "Ottica",
};

/** Indirizzo leggibile dai tag addr:* (se presenti). */
function formatAddress(tags: Record<string, string>): string | undefined {
  const street = [tags["addr:street"], tags["addr:housenumber"]]
    .filter(Boolean)
    .join(" ");
  const city = [tags["addr:postcode"], tags["addr:city"]]
    .filter(Boolean)
    .join(" ");
  const full = [street, city].filter(Boolean).join(", ");
  return full || undefined;
}

/** Converte la risposta Overpass in professionisti ordinati per distanza. */
export function parseOverpass(
  elements: OverpassElement[],
  center: Coordinates,
): Professional[] {
  const out: Professional[] = [];
  for (const el of elements) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat === undefined || lon === undefined) continue;
    const tags = el.tags ?? {};
    const kind = classify(tags);
    const position = { lat, lon };
    out.push({
      id: `${el.type}/${el.id}`,
      name: tags.name?.trim() || FALLBACK_NAME[kind],
      kind,
      address: formatAddress(tags),
      position,
      distanceKm: haversineKm(center, position),
    });
  }
  return out.sort((a, b) => a.distanceKm - b.distanceKm);
}

/** Esegue una singola query per un raggio dato. Lancia su errore/timeout. */
export async function fetchProfessionals(
  center: Coordinates,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<Professional[]> {
  // Timeout + annullamento esterno su un unico controller (AbortSignal.any
  // non è disponibile su Safari < 17.4).
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      // Form urlencoded = richiesta "semplice": nessun preflight CORS.
      body: new URLSearchParams({ data: buildOverpassQuery(center, radiusKm) }),
      signal: controller.signal,
      credentials: "omit",
    });
    if (!res.ok) throw new Error(`Overpass ${res.status}`);

    const json = (await res.json()) as { elements?: OverpassElement[] };
    return parseOverpass(json.elements ?? [], center);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

/**
 * Cerca nel raggio base; se i risultati sono meno di `FEW_RESULTS`, allarga
 * una sola volta al raggio successivo.
 */
export async function searchProfessionals(
  center: Coordinates,
  signal?: AbortSignal,
): Promise<{ radiusKm: number; professionals: Professional[] }> {
  const [base, wide] = SEARCH_RADII_KM;
  const near = await fetchProfessionals(center, base, signal);
  if (near.length >= FEW_RESULTS) return { radiusKm: base, professionals: near };
  const far = await fetchProfessionals(center, wide, signal);
  return { radiusKm: wide, professionals: far };
}
