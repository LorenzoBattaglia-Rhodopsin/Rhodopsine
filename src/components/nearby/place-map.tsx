"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import type { Coordinates, ProfessionalKind } from "@/types/nearby";
import { markerIcon } from "@/components/nearby/map-markers";
import { TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from "@/components/nearby/map-tiles";

/**
 * MAPPA DELLA SCHEDA (Leaflet) — un solo marker, caricata su richiesta da
 * <PlaceMapToggle /> con `next/dynamic` + `ssr: false`. Stesse tile e stessi
 * marker della mappa di ricerca.
 */
interface PlaceMapProps {
  position: Coordinates;
  kind: ProfessionalKind;
  label: string;
}

export default function PlaceMap({ position, kind, label }: PlaceMapProps) {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  return (
    <MapContainer
      center={[position.lat, position.lon]}
      zoom={16}
      scrollWheelZoom={false}
      zoomAnimation={!reduced}
      fadeAnimation={!reduced}
      markerZoomAnimation={!reduced}
      className="nearby-map size-full"
      aria-label={`Mappa: posizione di ${label}`}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
      <Marker
        position={[position.lat, position.lon]}
        icon={markerIcon(kind)}
        title={label}
        alt={label}
        keyboard={false}
      />
    </MapContainer>
  );
}
