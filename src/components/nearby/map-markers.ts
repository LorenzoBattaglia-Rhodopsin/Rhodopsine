import L from "leaflet";
import type { ProfessionalKind } from "@/types/nearby";
import {
  markerBaseClass,
  markerSizePx,
  markerSwatchClass,
} from "@/components/nearby/marker-style";

/**
 * MARKER DELLA MAPPA (divIcon)
 * --------------------------------------------------------------------------
 * Usiamo `L.divIcon` (HTML + classi Tailwind) invece delle PNG di default di
 * Leaflet: risolve alla radice il noto bug delle icone che il bundler non
 * trova (marker-icon.png 404) e permette di usare i token di tema.
 *
 * Forme e colori arrivano da marker-style.ts (condiviso con la legenda).
 */
const cache = new Map<ProfessionalKind, L.DivIcon>();

export function markerIcon(kind: ProfessionalKind): L.DivIcon {
  const cached = cache.get(kind);
  if (cached) return cached;
  const size = markerSizePx[kind];
  const icon = L.divIcon({
    // className sostituisce quello di default (che disegna un riquadro bianco).
    className: "nearby-marker",
    html: `<span class="${markerBaseClass} ${markerSwatchClass[kind]}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
  cache.set(kind, icon);
  return icon;
}
