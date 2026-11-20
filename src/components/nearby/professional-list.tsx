"use client";

import { useState } from "react";
import { ChevronRight, ExternalLink, MapPin } from "lucide-react";
import type { Professional } from "@/types/nearby";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistance } from "@/features/nearby/geo";
import {
  geoUri,
  osmDirectionsUrl,
  supportsGeoUri,
} from "@/features/nearby/directions";
import { professionalHref } from "@/features/nearby/ids";
import { nearbyCopy, professionalKinds } from "@/data/nearby";
import { legendSwatchClass, markerBaseClass } from "@/components/nearby/marker-style";

/**
 * LISTA DEI PROFESSIONISTI — alternativa accessibile alla mappa.
 * Ordinata per distanza (già ordinata a monte). Mostra i primi `PAGE` e
 * rivela gli altri a richiesta, per non trasformare la pagina in un elenco
 * infinito nelle grandi città.
 *
 * Il nome porta alla scheda di dettaglio con un <a> normale (non <Link>):
 * una navigazione "piena" permette al browser di ripristinare questa pagina
 * dalla cache avanti/indietro, ricerca compresa, quando l'utente torna
 * indietro. La ricerca non viene mai salvata altrove (vincolo privacy).
 */
const PAGE = 20;

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ProfessionalList({ items }: { items: Professional[] }) {
  const [visible, setVisible] = useState(PAGE);
  // La lista esiste solo dopo un'azione dell'utente (mai in SSR): leggere lo
  // user agent qui non crea mismatch di idratazione.
  const showGeo = supportsGeoUri();
  const shown = items.slice(0, visible);
  const remaining = items.length - shown.length;

  return (
    <div>
      <ol className="divide-y divide-border rounded-lg border border-border bg-card">
        {shown.map((p) => {
          const kind = professionalKinds[p.kind];
          const href = professionalHref(p.id);
          return (
            <li key={p.id} className="flex gap-4 p-5">
              {/* Stesso simbolo della mappa: collega lista e marker. */}
              <span aria-hidden="true" className="mt-1 size-3.5 shrink-0">
                <span className={cn(markerBaseClass, legendSwatchClass[p.kind], "border")} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h4 className="font-semibold text-foreground [overflow-wrap:anywhere]">
                    {href ? (
                      <a
                        href={href}
                        className="group inline-flex min-h-11 items-center gap-1 rounded-md underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {p.name}
                        <span className="sr-only">: {nearbyCopy.detailsSr}</span>
                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      p.name
                    )}
                  </h4>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {formatDistance(p.distanceKm)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{kind.label}</p>
                {p.address && (
                  <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    <span className="[overflow-wrap:anywhere]">{p.address}</span>
                  </p>
                )}
                <div className="mt-1 flex flex-wrap gap-x-5">
                  <a
                    href={osmDirectionsUrl(p.position)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {nearbyCopy.directions}
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">
                      {" "}per {p.name} (si apre in una nuova scheda)
                    </span>
                  </a>
                  {showGeo && (
                    <a href={geoUri(p.position, p.name)} className={linkClass}>
                      {nearbyCopy.openInApp}
                      <span className="sr-only"> per {p.name}</span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {remaining > 0 && (
        <Button
          type="button"
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => setVisible((v) => v + PAGE)}
        >
          Mostra altri {Math.min(PAGE, remaining)} di {remaining}
        </Button>
      )}
    </div>
  );
}
