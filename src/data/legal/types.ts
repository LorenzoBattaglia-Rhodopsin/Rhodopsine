/**
 * TIPI — Documenti legali (privacy, cookie, termini)
 * --------------------------------------------------------------------------
 * Struttura condivisa dei documenti legali, sul modello di `data/articles`:
 * i contenuti vivono qui in `data/legal/`, la UI (components/legal) si limita
 * a renderli. Nessun testo legale è hard-coded nei componenti.
 */

export type LegalSection = {
  /** Ancora univoca nella pagina (usata dall'indice e come React key). */
  id: string;
  title: string;
  /** Paragrafi introduttivi della sezione. */
  paragraphs: string[];
  /** Elenco puntato opzionale, reso dopo i paragrafi. */
  items?: string[];
  /** Paragrafi conclusivi opzionali, resi dopo l'elenco. */
  closing?: string[];
};

export type LegalDocument = {
  /** Segmento URL della pagina (es. "privacy-policy"). */
  slug: string;
  /** Etichetta sopra il titolo (es. "Documenti legali"). */
  eyebrow: string;
  title: string;
  /** Sommario breve per metadati SEO. */
  description: string;
  /** Data ultimo aggiornamento in formato ISO (YYYY-MM-DD). */
  updatedAt: string;
  /** Paragrafi introduttivi del documento, prima dell'indice. */
  intro: string[];
  sections: LegalSection[];
};

// Formatter costruito una sola volta (come per gli articoli).
const legalDateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Data in formato leggibile italiano (es. "4 luglio 2026"). */
export function formatLegalDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return legalDateFormatter.format(date);
}
