"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";
import type { Coordinates, ProfessionalKind } from "@/types/nearby";
import { Button } from "@/components/ui/button";
import { detailCopy } from "@/data/nearby";

/**
 * MAPPA SU RICHIESTA (scheda di dettaglio)
 * --------------------------------------------------------------------------
 * Come nella ricerca: nessuna richiesta ai server delle mappe finché
 * l'utente non preme il pulsante. Leaflet resta un chunk separato.
 */
const PlaceMap = dynamic(() => import("@/components/nearby/place-map"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
      Carico la mappa…
    </div>
  ),
});

interface PlaceMapToggleProps {
  position: Coordinates;
  kind: ProfessionalKind;
  label: string;
}

export function PlaceMapToggle({ position, kind, label }: PlaceMapToggleProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="flex flex-col items-start gap-2">
        <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
          <MapIcon aria-hidden="true" />
          {detailCopy.showMap}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">{detailCopy.mapNote}</p>
      </div>
    );
  }

  return (
    // Altezza fissa: nessun salto di layout quando la mappa arriva.
    <div className="h-72 overflow-hidden rounded-lg border border-border bg-muted sm:h-80">
      <PlaceMap position={position} kind={kind} label={label} />
    </div>
  );
}
