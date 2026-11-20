import type { Coordinates } from "@/types/nearby";

/**
 * GEOMETRIA — utility pure per la ricerca professionisti.
 * Nessuna dipendenza dal DOM: testabili e riutilizzabili.
 */

/**
 * Arrotonda le coordinate a 2 decimali (≈ 1,1 km in latitudine).
 * PRIVACY: va applicata APPENA si ottiene una posizione, prima di salvarla
 * nello stato o di inviarla a qualunque servizio. Le coordinate esatte non
 * devono sopravvivere oltre la callback che le riceve.
 */
export function roundCoords({ lat, lon }: Coordinates): Coordinates {
  return {
    lat: Math.round(lat * 100) / 100,
    lon: Math.round(lon * 100) / 100,
  };
}

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Distanza in linea d'aria (km) tra due punti, formula di Haversine. */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

const kmFormat = new Intl.NumberFormat("it-IT", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

/**
 * Distanza leggibile e onesta: il centro è arrotondato, quindi la distanza è
 * sempre "circa". Sotto 1 km non ha senso dare decimali.
 */
export function formatDistance(km: number): string {
  if (km < 1) return "meno di 1 km";
  return `circa ${kmFormat.format(km)} km`;
}
