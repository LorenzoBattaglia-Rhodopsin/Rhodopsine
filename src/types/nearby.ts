/**
 * TIPI — Ricerca professionisti nelle vicinanze
 * --------------------------------------------------------------------------
 * Fonte di verità condivisa tra logica (`features/nearby`), testi
 * (`data/nearby`) e UI (`components/nearby`).
 *
 * PRIVACY BY DESIGN: nessuno di questi tipi contiene il punteggio o le
 * risposte del test. Le coordinate che circolano nell'app sono SEMPRE già
 * arrotondate (vedi `roundCoords` in features/nearby/geo.ts).
 */

/** Coppia latitudine/longitudine in gradi decimali. */
export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Tipo di professionista.
 * - `ophthalmologist`: oculista (medico, unico che fa diagnosi).
 * - `optician`: ottico / optometrista (controllo vista e occhiali, nessuna diagnosi).
 */
export type ProfessionalKind = "ophthalmologist" | "optician";

/** Attività trovata su OpenStreetMap, con distanza dal centro di ricerca. */
export interface Professional {
  /** Id stabile OSM (es. "node/123"): usato come React key. */
  id: string;
  name: string;
  kind: ProfessionalKind;
  /** Indirizzo leggibile, se presente nei tag OSM. */
  address?: string;
  position: Coordinates;
  /** Distanza (km) dal centro di ricerca arrotondato: valore approssimato. */
  distanceKm: number;
}

/** Origine del centro di ricerca (solo per i testi, mai inviata altrove). */
export type SearchOrigin = "geolocation" | "query";

/** Esito di una ricerca completata. */
export interface NearbyResult {
  /** Centro di ricerca, arrotondato a 2 decimali (~1 km). */
  center: Coordinates;
  /** Raggio effettivamente usato (10 km, o 25 km se pochi risultati). */
  radiusKm: number;
  origin: SearchOrigin;
  /** Professionisti ordinati per distanza crescente. */
  professionals: Professional[];
}

/** Codici di errore gestiti dall'interfaccia (testi in data/nearby.ts). */
export type NearbyErrorCode =
  | "geo-denied"
  | "geo-unavailable"
  | "geo-unsupported"
  | "not-found"
  | "network";

/** Macchina a stati della ricerca. */
export type NearbySearchState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "geocoding" }
  | { status: "searching" }
  | { status: "done"; result: NearbyResult }
  | { status: "error"; code: NearbyErrorCode };
