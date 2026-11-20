import type { ProfessionalKind } from "@/types/nearby";

/**
 * Forme dei marker, condivise tra mappa (map-markers.ts) e legenda.
 * File SENZA dipendenze da Leaflet: la legenda vive nel bundle della pagina,
 * Leaflet no (si carica solo con la mappa).
 *
 * I due tipi si distinguono per FORMA oltre che per colore: oculista =
 * cerchio teal, ottico = quadrato arrotondato crema.
 */
export const markerSwatchClass: Record<ProfessionalKind, string> = {
  ophthalmologist: "rounded-full bg-primary",
  optician: "rounded-[4px] bg-foreground",
};

/** Simboli piccoli (legenda, lista): raggio ridotto, o il quadrato sembra un cerchio. */
export const legendSwatchClass: Record<ProfessionalKind, string> = {
  ophthalmologist: "rounded-full bg-primary",
  optician: "rounded-[2px] bg-foreground",
};

/**
 * Gerarchia visiva: gli oculisti (gli unici che fanno diagnosi) sono meno
 * numerosi e vanno trovati a colpo d'occhio → marker più grande e sempre
 * sopra; gli ottici restano leggibili ma più discreti.
 */
export const markerSizePx: Record<ProfessionalKind, number> = {
  ophthalmologist: 24,
  optician: 18,
};

export const markerBaseClass =
  "block size-full border-2 border-background shadow-[0_2px_6px_hsl(var(--background)/0.6)]";
