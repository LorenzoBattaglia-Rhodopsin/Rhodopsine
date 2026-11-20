import { routes } from "@/data/site";
import type { NearbyErrorCode, ProfessionalKind } from "@/types/nearby";

/**
 * TESTI — Ricerca professionisti nelle vicinanze (/risultati)
 * --------------------------------------------------------------------------
 * Tono informativo e sobrio (CLAUDE.md §6.1–6.2): nessuna diagnosi, nessuna
 * raccomandazione né promozione delle attività mostrate.
 */
export const nearbyCopy = {
  eyebrow: "Professionisti",
  title: "Vuoi confrontarti con un professionista?",
  description:
    "Per una valutazione completa puoi rivolgerti a un professionista della visione.",

  /** Informativa mostrata PRIMA di qualsiasi ricerca. */
  privacyNote:
    "La ricerca avviene direttamente dal tuo browser tramite OpenStreetMap. Rhodopsine non riceve né conserva la tua posizione.",
  privacyLinkLabel: "Leggi l'informativa",
  privacyHref: `${routes.privacy}#ricerca-professionisti`,

  useLocation: "Usa la mia posizione",
  or: "oppure",
  queryLabel: "CAP o città",
  queryPlaceholder: "Es. 20121 o Bologna",
  querySubmit: "Cerca",

  status: {
    locating: "Cerco la tua posizione…",
    geocoding: "Cerco la località…",
    searching: "Cerco i professionisti nelle vicinanze…",
  },

  clear: "Cancella ricerca",
  directions: "Indicazioni",
  openInApp: "Apri nell'app Mappe",
  approxArea: "Area di ricerca (approssimativa)",
  mapLabel: "Mappa dei professionisti trovati",

  disclaimer:
    "Elenco basato sui dati pubblici di OpenStreetMap, potrebbe essere incompleto. Rhodopsine non raccomanda né sponsorizza nessuna delle attività mostrate.",
  approxDistances:
    "Le distanze sono in linea d'aria e approssimate: per proteggere la tua privacy la ricerca usa una posizione arrotondata (circa 1 km).",
  /** Attribuzione ODbL dell'estratto + data di aggiornamento. */
  dataCredit: (isoDate: string) =>
    `Dati © OpenStreetMap contributors (licenza ODbL), aggiornati al ${new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric" }).format(new Date(isoDate))}.`,
} as const;

/** Riepilogo dei risultati (annunciato anche agli screen reader). */
export function nearbySummary(count: number, radiusKm: number): string {
  if (count === 0) return `Nessun professionista trovato entro ${radiusKm} km.`;
  if (count === 1) return `1 professionista entro ${radiusKm} km`;
  return `${count} professionisti entro ${radiusKm} km`;
}

/** Messaggi d'errore: gentili, con un'alternativa concreta. */
export const nearbyErrors: Record<NearbyErrorCode, string> = {
  "geo-denied":
    "Nessun problema: non hai condiviso la posizione. Puoi cercare inserendo il CAP o la città.",
  "geo-unavailable":
    "Non è stato possibile rilevare la posizione in questo momento. Prova con il CAP o la città.",
  "geo-unsupported":
    "Il tuo browser non supporta la geolocalizzazione. Puoi cercare inserendo il CAP o la città.",
  "not-found":
    "Non abbiamo trovato questa località in Italia. Controlla il CAP o prova con il nome della città.",
  network:
    "Non è stato possibile completare la ricerca in questo momento. Controlla la connessione e riprova tra qualche istante.",
};

/** Le due figure professionali, con la differenza spiegata in modo neutro. */
export const professionalKinds: Record<
  ProfessionalKind,
  { label: string; title: string; body: string }
> = {
  ophthalmologist: {
    label: "Oculista",
    title: "Oculista",
    body: "È un medico specialista in oftalmologia: l'unica figura che può fare diagnosi e prescrivere terapie per disturbi e malattie degli occhi.",
  },
  optician: {
    label: "Ottico-optometrista",
    title: "Ottico-optometrista",
    body: "Si occupa della misurazione della vista e di occhiali e lenti a contatto. Non fa diagnosi: se nota qualcosa di anomalo, ti indirizza dall'oculista.",
  },
};
