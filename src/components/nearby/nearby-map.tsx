"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import L from "leaflet";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Coordinates, Professional } from "@/types/nearby";
import { markerIcon } from "@/components/nearby/map-markers";
import { TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from "@/components/nearby/map-tiles";
import { formatDistance } from "@/features/nearby/geo";
import { directionsUrl } from "@/features/nearby/directions";
import { professionalHref } from "@/features/nearby/ids";
import { nearbyCopy, professionalKinds } from "@/data/nearby";

/**
 * MAPPA (Leaflet) — modulo caricato SOLO su richiesta
 * --------------------------------------------------------------------------
 * Importata con `next/dynamic` + `ssr: false` da nearby-professionals.tsx e
 * montata solo quando c'è un risultato: Leaflet, react-leaflet e il loro CSS
 * stanno in un chunk separato che la pagina non scarica all'apertura. Le
 * tile partono quindi solo dopo il click dell'utente.
 *
 * Il centro è già arrotondato (~1 km) e viene disegnato come AREA
 * approssimativa (cerchio tratteggiato), mai come punto preciso.
 *
 * La mappa è un complemento visivo: l'alternativa accessibile è la lista.
 */
interface NearbyMapProps {
  center: Coordinates;
  professionals: Professional[];
}

/** Raggio del cerchio "Area di ricerca": pari all'incertezza dell'arrotondamento. */
const AREA_RADIUS_M = 1000;
/** Per l'inquadratura iniziale bastano i più vicini (evita zoom troppo larghi). */
const FIT_NEAREST = 12;


function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function NearbyMap({ center, professionals }: NearbyMapProps) {
  // Calcolati una volta al montaggio: MapContainer ignora i cambi di prop
  // successivi, e ogni nuova ricerca rimonta la mappa.
  const reduced = useMemo(prefersReducedMotion, []);
  const bounds = useMemo(() => {
    const b = L.latLng(center.lat, center.lon).toBounds(AREA_RADIUS_M * 2);
    for (const p of professionals.slice(0, FIT_NEAREST)) {
      b.extend([p.position.lat, p.position.lon]);
    }
    return b;
  }, [center, professionals]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [24, 24], maxZoom: 15 }}
      scrollWheelZoom={false}
      // Movimento ridotto: niente animazioni di zoom/dissolvenza (§14 apple-design).
      zoomAnimation={!reduced}
      fadeAnimation={!reduced}
      markerZoomAnimation={!reduced}
      className="nearby-map size-full"
      aria-label={nearbyCopy.mapLabel}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />

      <Circle
        center={[center.lat, center.lon]}
        radius={AREA_RADIUS_M}
        // `className` come prop (non in pathOptions): react-leaflet applica
        // pathOptions con setStyle(), che ignora className.
        className="nearby-area"
        interactive={false}
      />

      {professionals.map((p) => {
        const kind = professionalKinds[p.kind];
        return (
          <Marker
            key={p.id}
            position={[p.position.lat, p.position.lon]}
            icon={markerIcon(p.kind)}
            title={`${p.name} — ${kind.label}`}
            alt={`${p.name} — ${kind.label}`}
            keyboard
            // Oculisti sempre sopra gli ottici (vedi markerSizePx).
            zIndexOffset={p.kind === "ophthalmologist" ? 1000 : 0}
          >
            <Popup>
              <p className="font-semibold text-foreground">{p.name}</p>
              <p className="mt-0.5 text-muted-foreground">
                {kind.label} · {formatDistance(p.distanceKm)}
              </p>
              {p.address && (
                <p className="mt-1 text-muted-foreground">{p.address}</p>
              )}
              <div className="mt-1 flex flex-wrap gap-x-4">
                {professionalHref(p.id) && (
                  // <a> normale (come nella lista): tornando indietro il
                  // browser può ripristinare la ricerca dalla sua cache.
                  <a
                    href={professionalHref(p.id) ?? undefined}
                    className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {nearbyCopy.openDetails}
                  </a>
                )}
                <a
                  href={directionsUrl(p.position)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
                >
                  {nearbyCopy.directions}
                  <span className="sr-only">{nearbyCopy.directionsSr(p.name)}</span>
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
