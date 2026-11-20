import type { Coordinates } from "@/types/nearby";

/**
 * LINK "INDICAZIONI" — Google Maps (solo indicazioni stradali)
 * --------------------------------------------------------------------------
 * Formato ufficiale "Maps URLs" (https://developers.google.com/maps/documentation/urls):
 * è un semplice link, NON un'integrazione. Nessuna richiesta a Google parte
 * dal nostro sito finché l'utente non clicca; su mobile apre l'app Google
 * Maps, se installata.
 *
 * PRIVACY: il link contiene SOLO la destinazione (l'attività, dato pubblico),
 * mai la posizione dell'utente. Il punto di partenza lo sceglie l'utente su
 * Google Maps. Il link va sempre aperto con rel="noopener noreferrer".
 */
export function directionsUrl({ lat, lon }: Coordinates): string {
  const params = new URLSearchParams({
    api: "1",
    destination: `${lat},${lon}`,
  });
  return `https://www.google.com/maps/dir/?${params}`;
}
