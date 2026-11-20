import { routes } from "@/data/site";
import type { NearbyErrorCode, ProfessionalKind } from "@/types/nearby";

/**
 * TESTI — Ricerca professionisti nelle vicinanze (/risultati e /trova-ottici-oculisti)
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
  /** Testo per screen reader: il link porta a Google Maps in una nuova scheda. */
  directionsSr: (name: string) =>
    ` per ${name} su Google Maps (si apre in una nuova scheda)`,
  openDetails: "Apri la scheda",
  approxArea: "Area di ricerca (approssimativa)",
  mapLabel: "Mappa dei professionisti trovati",

  disclaimer:
    "Le informazioni provengono da fonti pubbliche (OpenStreetMap): possono essere incomplete o non aggiornate, verificale sempre con il centro. L'elenco è ordinato solo per distanza. Rhodopsine non fornisce diagnosi e non raccomanda né sponsorizza nessuna struttura.",
  /** Link per segnalare dati errati: le correzioni vanno alla fonte (OSM). */
  correctionsLabel: "Segnala una correzione su OpenStreetMap",
  correctionsHref: "https://www.openstreetmap.org/fixthemap",
  /** Etichetta del link alla scheda (solo per screen reader). */
  detailsSr: "apri la scheda",
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

/** Riga neutra sulla differenza tra le due figure (pagina dedicata). */
export const kindsSummary =
  "L'oculista è un medico e può fare diagnosi; l'ottico-optometrista non è un medico e si occupa di vista, occhiali e lenti a contatto.";

/**
 * TESTI — Pagina dedicata /trova-ottici-oculisti
 * Raggiungibile senza fare il test. Tono informativo, nessuna promozione.
 */
export const findPageCopy = {
  metaTitle: "Trova ottici e oculisti vicino a te",
  metaDescription:
    "Cerca ottici e oculisti vicino a te con i dati pubblici di OpenStreetMap. Elenco ordinato solo per distanza, senza classifiche. La tua posizione resta nel browser.",
  eyebrow: "Professionisti della visione",
  title: "Trova ottici e oculisti vicino a te",
  description:
    "Cerca per città o CAP, oppure usa la tua posizione. L'elenco è ordinato solo per distanza: nessuna classifica, nessun centro consigliato.",
  kindsTitle: "Oculista o ottico: qual è la differenza?",
  searchTitle: "Cerca vicino a te",
} as const;

/** TESTI — Invito nella home. */
export const findCtaCopy = {
  title: "Cerchi un ottico o un oculista?",
  description:
    "Trova i professionisti della visione più vicini a te, anche senza fare il test. La tua posizione resta nel tuo browser.",
  cta: "Trova ottici e oculisti",
} as const;

/** TESTI — Scheda di dettaglio /trova-ottici-oculisti/[id]. */
export const detailCopy = {
  back: "Torna alla ricerca",
  notAvailable: "Informazione non disponibile",
  address: "Indirizzo",
  hours: "Orari di apertura",
  hoursNote: "Orari come riportati nella fonte: verificali con il centro prima di andare.",
  phone: "Telefono",
  website: "Sito web",
  specialities: "Specializzazioni indicate nella fonte",
  position: "Posizione",
  showMap: "Mostra sulla mappa",
  mapNote: "La mappa si carica dai server di OpenStreetMap solo se la apri.",
  viewOnOsm: "Vedi questa scheda su OpenStreetMap",
  correction: "Segnala una correzione",
  correctionNote:
    "I dati vengono da OpenStreetMap, una mappa aperta e collaborativa: le correzioni si fanno lì e arrivano qui con l'aggiornamento mensile.",
  source: (isoDate: string) =>
    `Fonte: OpenStreetMap — © OpenStreetMap contributors, licenza ODbL. Dati aggiornati al ${new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(isoDate))}.`,
  disclaimer:
    "Le informazioni provengono da fonti pubbliche e possono non essere aggiornate: verificale sempre con il centro. Rhodopsine non fornisce diagnosi e non raccomanda né sponsorizza nessuna struttura.",
} as const;
