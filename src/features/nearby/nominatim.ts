import type { Coordinates } from "@/types/nearby";
import { roundCoords } from "@/features/nearby/geo";
import { timeoutSignal } from "@/features/nearby/timeout";

/**
 * GEOCODIFICA — Nominatim (OpenStreetMap Foundation)
 * --------------------------------------------------------------------------
 * La richiesta parte DIRETTAMENTE dal browser verso nominatim.openstreetmap.org:
 * il nostro server non la vede mai.
 *
 * Usage policy di Nominatim (https://operations.osmfoundation.org/policies/nominatim/):
 * - massimo 1 richiesta al secondo → `MIN_INTERVAL_MS` qui sotto;
 * - niente autocompletamento → si chiama SOLO al submit del form;
 * - Referer valido → lo invia il browser (Referrer-Policy: solo l'origine).
 */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MIN_INTERVAL_MS = 1000;
/** Oltre questo tempo la richiesta si annulla e l'utente vede l'errore di rete. */
const TIMEOUT_MS = 10_000;

/** Momento dell'ultima richiesta (memoria di modulo, mai persistita). */
let lastRequestAt = 0;

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(signal.reason);
    });
  });

interface NominatimHit {
  lat: string;
  lon: string;
}

/**
 * Converte "CAP o città" in coordinate (già arrotondate).
 * Ritorna `null` se la località non viene trovata in Italia.
 * Lancia in caso di errore di rete/servizio.
 */
export async function geocodeQuery(
  query: string,
  signal?: AbortSignal,
): Promise<Coordinates | null> {
  // Rispetta 1 richiesta/secondo anche con submit ravvicinati.
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_INTERVAL_MS) await wait(MIN_INTERVAL_MS - elapsed, signal);
  lastRequestAt = Date.now();

  const params = new URLSearchParams({
    q: query,
    countrycodes: "it",
    format: "json",
    limit: "1",
  });

  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    signal: timeoutSignal(TIMEOUT_MS, signal),
    headers: { Accept: "application/json" },
    // Nessun cookie/credenziale verso servizi terzi.
    credentials: "omit",
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);

  // Risposta di un servizio esterno: non fidata, si valida la forma.
  const hits: unknown = await res.json();
  const first = Array.isArray(hits) ? (hits[0] as NominatimHit | undefined) : undefined;
  if (!first) return null;

  const lat = Number(first.lat);
  const lon = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return roundCoords({ lat, lon });
}
