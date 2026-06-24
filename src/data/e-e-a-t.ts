import { siteConfig } from "@/data/site";

/**
 * CONTENUTI — E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * --------------------------------------------------------------------------
 * Unica fonte di verità per i dati di AUTORE e REVISORE dei contenuti.
 * Usata sia dalla UI (footer, pagine) sia dai dati strutturati Schema.org
 * (vedi `lib/seo.ts` → getAssessmentJsonLd → author / reviewedBy).
 *
 * Vincoli del progetto (CLAUDE.md §6.1 e §6.2):
 * - Sobrietà "normativa": qualifiche INFORMATIVE, mai promozionali. Niente
 *   superlativi ("il migliore"), niente claim di risultato, niente marketing.
 * - Non diagnostico: la revisione scientifica è informativa e NON costituisce
 *   una visita né una diagnosi personalizzata.
 *
 * ⚠️ PLACEHOLDER: il revisore è un profilo fittizio "per ora". Prima del
 * go-live sostituire nome e qualifica con quelli di un professionista reale e
 * verificabile (mantenendo lo stesso tono sobrio).
 */

/** Tipo Schema.org del contributore, per il JSON-LD. */
export type ContributorSchemaType = "Person" | "Organization";

export type ContentContributor = {
  /** Tipo Schema.org (Person/Organization) usato nel JSON-LD. */
  schemaType: ContributorSchemaType;
  /** Nome visualizzato (persona o redazione). */
  name: string;
  /** Ruolo nel progetto, informativo (es. "Revisione scientifica"). */
  role: string;
  /** Mansione professionale → Schema.org `jobTitle` (solo per Person). */
  jobTitle?: string;
  /** Qualifica/affiliazione, sobria e non promozionale (mostrata in UI). */
  credentials?: string;
  /** Breve nota informativa sul contributo (no marketing). */
  note?: string;
  /** URL profilo o pagina di riferimento → Schema.org `url`. */
  url?: string;
};

/**
 * AUTORE — la redazione che cura e scrive i contenuti.
 * Modellato come Organization: è il team editoriale, non una singola persona.
 */
export const contentAuthor: ContentContributor = {
  schemaType: "Organization",
  name: `Redazione ${siteConfig.name}`,
  role: "Autore e curatela dei contenuti",
  note: "Contenuti redatti sulla base della letteratura su affaticamento visivo digitale (DES/CVS) e di fonti ufficiali, con finalità educativa e preventiva.",
  url: siteConfig.url,
};

/**
 * REVISORE — supervisione scientifica dei contenuti.
 * Profilo PLACEHOLDER (oculista) con qualifica chiara e sobria. La revisione è
 * informativa: non è una visita e non sostituisce un parere personalizzato.
 */
export const contentReviewer: ContentContributor = {
  schemaType: "Person",
  name: "",
  role: "",
  jobTitle: "Medico chirurgo, specialista in Oftalmologia",
  credentials: "Medico oculista, iscritta all'Ordine dei Medici Chirurghi e degli Odontoiatri",
  note: "Revisione dei contenuti a scopo informativo. Non costituisce una visita oculistica né una diagnosi personalizzata.",
};

/**
 * Data dell'ultima revisione dei contenuti (ISO YYYY-MM-DD).
 * Alimenta Schema.org `lastReviewed` e può essere mostrata in UI come segnale
 * di aggiornamento/affidabilità.
 */
export const contentReviewedAt = "2026-06-01";

// Formatter costruito una volta sola (vedi pattern in data/articles.ts).
const reviewDateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Data di revisione in formato leggibile italiano (es. "1 giugno 2026"). */
export function formatReviewDate(iso: string = contentReviewedAt): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return reviewDateFormatter.format(date);
}
