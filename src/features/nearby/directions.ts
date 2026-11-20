import type { Coordinates } from "@/types/nearby";

/**
 * LINK "INDICAZIONI"
 * PRIVACY: contengono SOLO la destinazione (l'attività), mai la posizione
 * dell'utente. Il punto di partenza lo sceglie l'utente sul servizio esterno.
 */

/** Pagina indicazioni di openstreetmap.org con la sola destinazione. */
export function osmDirectionsUrl({ lat, lon }: Coordinates): string {
  return `https://www.openstreetmap.org/directions?route=${encodeURIComponent(`;${lat},${lon}`)}`;
}

/** URI `geo:` (Android): apre l'app mappe predefinita del dispositivo. */
export function geoUri({ lat, lon }: Coordinates, label: string): string {
  return `geo:${lat},${lon}?q=${lat},${lon}(${encodeURIComponent(label)})`;
}

/** Il link `geo:` è affidabile solo su Android (iOS e desktop lo ignorano). */
export function supportsGeoUri(): boolean {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}
