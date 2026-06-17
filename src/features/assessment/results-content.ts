import type { ResultContent, ResultLevel } from "@/types/assessment";

/**
 * CONTENUTI DEI RISULTATI (per livello)
 * --------------------------------------------------------------------------
 * Testi puramente educativi e preventivi. Nessuna formulazione diagnostica:
 * descrivono abitudini e propensione all'affaticamento, mai una patologia.
 */
const RESULT_CONTENT: Record<ResultLevel, ResultContent> = {
  low: {
    level: "low",
    badge: "Basso",
    title: "Le tue abitudini visive sembrano equilibrate",
    summary:
      "Le tue risposte indicano un basso livello di affaticamento visivo digitale e abitudini complessivamente sane. È un buon punto di partenza: continua a prenderti cura dei tuoi occhi con pause regolari e una postazione confortevole. Ricorda che questo strumento è informativo e non sostituisce un controllo periodico della vista.",
  },
  medium: {
    level: "medium",
    badge: "Moderato",
    title: "Alcune abitudini possono essere migliorate",
    summary:
      "Le tue risposte suggeriscono un livello moderato di affaticamento visivo digitale. Sono presenti alcuni fattori che, nel tempo, possono accentuare la stanchezza degli occhi. Piccoli accorgimenti quotidiani, come pause più frequenti e una migliore ergonomia, possono fare una differenza concreta. Questo risultato è educativo e non rappresenta una diagnosi.",
  },
  high: {
    level: "high",
    badge: "Elevato",
    title: "Vale la pena dedicare attenzione al tuo benessere visivo",
    summary:
      "Le tue risposte indicano un livello elevato di affaticamento visivo digitale e diverse abitudini che potrebbero contribuirvi. I suggerimenti qui sotto possono aiutarti a ridurre il disagio. Se i sintomi sono frequenti, intensi o persistenti, ti consigliamo di rivolgerti a un professionista della visione (oculista od ottico-optometrista) per una valutazione personalizzata. Questo strumento non sostituisce una visita.",
  },
};

/** Restituisce i contenuti educativi per il livello indicato. */
export function getResultContent(level: ResultLevel): ResultContent {
  return RESULT_CONTENT[level];
}
