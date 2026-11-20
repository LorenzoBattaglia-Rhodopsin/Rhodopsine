import type { Coordinates, Professional, ProfessionalKind } from "@/types/nearby";
import { haversineKm } from "@/features/nearby/geo";

/**
 * RICERCA PROFESSIONISTI — estratto statico di OpenStreetMap
 * --------------------------------------------------------------------------
 * Il browser scarica dal NOSTRO sito un unico file, identico per tutti gli
 * utenti, con gli ottici e gli oculisti d'Italia (generato ogni mese da
 * `npm run data:professionisti`, vedi scripts/fetch-professionals.mjs).
 * Il filtro per distanza avviene qui, nel browser.
 *
 * PRIVACY: la richiesta è sempre la stessa URL, senza parametri: il server
 * non può dedurne la posizione. Nessun servizio esterno riceve la zona di
 * ricerca (Overpass non viene più interrogato dal browser).
 */
export const DATASET_URL = "/data/professionisti-it.json";

/** Raggi di ricerca (km): si allarga solo se i risultati sono pochi. */
export const SEARCH_RADII_KM = [10, 25] as const;
/** Sotto questa soglia si riprova con il raggio più ampio. */
export const FEW_RESULTS = 5;

/** Record compatto: [id, lat, lon, kind (1=oculista), nome, indirizzo]. */
type DatasetRecord = [string, number, number, 0 | 1, string, string];

interface Dataset {
  generatedAt: string;
  items: DatasetRecord[];
}

const FALLBACK_NAME: Record<ProfessionalKind, string> = {
  ophthalmologist: "Studio oculistico",
  optician: "Ottica",
};

/**
 * Caricamento condiviso (una sola richiesta per sessione di pagina), in
 * memoria: niente storage. Se fallisce, la cache si azzera e si può riprovare.
 */
let cache: Promise<Dataset> | null = null;

export function loadDataset(): Promise<Dataset> {
  if (!cache) {
    cache = fetch(DATASET_URL, { credentials: "omit" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Estratto ${res.status}`);
        const data = (await res.json()) as Dataset;
        if (!Array.isArray(data.items)) throw new Error("Estratto non valido");
        return data;
      })
      .catch((err) => {
        cache = null;
        throw err;
      });
  }
  return cache;
}

/** Professionisti entro `radiusKm` dal centro, ordinati per distanza. */
export function findWithin(
  items: DatasetRecord[],
  center: Coordinates,
  radiusKm: number,
): Professional[] {
  // Pre-filtro rettangolare (economico) prima di Haversine.
  const dLat = radiusKm / 111;
  const dLon = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));
  const out: Professional[] = [];
  for (const [id, lat, lon, k, name, address] of items) {
    if (Math.abs(lat - center.lat) > dLat || Math.abs(lon - center.lon) > dLon) continue;
    const position = { lat, lon };
    const distanceKm = haversineKm(center, position);
    if (distanceKm > radiusKm) continue;
    const kind: ProfessionalKind = k === 1 ? "ophthalmologist" : "optician";
    out.push({
      id,
      name: name || FALLBACK_NAME[kind],
      kind,
      address: address || undefined,
      position,
      distanceKm,
    });
  }
  return out.sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Cerca nel raggio base; se i risultati sono meno di `FEW_RESULTS`, allarga
 * al raggio successivo. Restituisce anche la data dell'estratto.
 */
export async function searchProfessionals(center: Coordinates): Promise<{
  radiusKm: number;
  professionals: Professional[];
  dataDate: string;
}> {
  const { items, generatedAt } = await loadDataset();
  const [base, wide] = SEARCH_RADII_KM;
  const near = findWithin(items, center, base);
  if (near.length >= FEW_RESULTS) {
    return { radiusKm: base, professionals: near, dataDate: generatedAt };
  }
  return {
    radiusKm: wide,
    professionals: findWithin(items, center, wide),
    dataDate: generatedAt,
  };
}
