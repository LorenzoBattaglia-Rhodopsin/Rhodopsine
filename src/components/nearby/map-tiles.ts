/**
 * TILE DELLA MAPPA — unica configurazione, condivisa da tutte le mappe.
 * Server della OpenStreetMap Foundation: ricevono l'IP dell'utente, quindi
 * le mappe si caricano SOLO dopo un'azione esplicita (vedi privacy policy).
 */
export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export const TILE_MAX_ZOOM = 19;
