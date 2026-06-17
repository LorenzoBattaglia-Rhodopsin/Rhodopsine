/**
 * TIPI DEL DOMINIO — Autovalutazione affaticamento visivo
 * --------------------------------------------------------------------------
 * Centralizzare i tipi qui mantiene coerenti dati, algoritmo e UI.
 */

/** Valori della scala Likert 1–5 (Mai → Sempre). */
export type LikertValue = 1 | 2 | 3 | 4 | 5;

/**
 * Aree indagate dal questionario. Servono per raggruppare le domande e per
 * generare, in futuro, suggerimenti specifici per dominio.
 */
export type AssessmentDomain =
  | "exposure" // tempo di esposizione agli schermi
  | "breaks" // pause visive e regola 20-20-20
  | "ergonomics" // distanza, postura, postazione
  | "environment" // illuminazione, riflessi
  | "symptoms" // sintomi soggettivi (secchezza, bruciore, mal di testa…)
  | "sleep"; // uso serale e qualità del sonno

/**
 * Direzione del punteggio:
 * - "symptom": più alto = peggio (più affaticamento). Es. "Avverto bruciore".
 * - "protective": più alto = meglio (buona abitudine). Es. "Faccio pause".
 *   Queste domande vengono invertite in fase di scoring.
 */
export type QuestionDirection = "symptom" | "protective";

/** Singola domanda del questionario. */
export interface AssessmentQuestion {
  /** Identificatore stabile (utile per persistenza e analytics futuri). */
  id: string;
  /** Testo mostrato all'utente. */
  text: string;
  /** Breve testo di aiuto opzionale sotto la domanda. */
  helper?: string;
  domain: AssessmentDomain;
  direction: QuestionDirection;
}

/** Etichetta e descrizione di un singolo livello della scala Likert. */
export interface LikertOption {
  value: LikertValue;
  label: string;
}

/** Mappa risposta utente: id domanda -> valore Likert scelto. */
export type AssessmentAnswers = Record<string, LikertValue>;

/** Livello di esito (mai diagnostico). */
export type ResultLevel = "low" | "medium" | "high";

/** Punteggio per singolo dominio (0–100, normalizzato verso "più affaticamento"). */
export interface DomainScore {
  domain: AssessmentDomain;
  /** Punteggio normalizzato 0–100. */
  normalized: number;
}

/** Risultato completo del calcolo. */
export interface AssessmentResult {
  /** Somma grezza dei punteggi (dopo inversione delle domande protettive). */
  rawScore: number;
  /** Punteggio massimo teorico. */
  maxScore: number;
  /** Punteggio normalizzato 0–100 (0 = ottimo, 100 = molto affaticato). */
  normalized: number;
  level: ResultLevel;
  /** Punteggi per dominio, ordinati dal più critico al meno critico. */
  domainScores: DomainScore[];
}

/** Contenuto educativo associato a un livello di esito. */
export interface ResultContent {
  level: ResultLevel;
  /** Etichetta breve, es. "Basso". */
  badge: string;
  /** Titolo della pagina risultati. */
  title: string;
  /** Paragrafo educativo (mai una diagnosi). */
  summary: string;
}

/** Suggerimento pratico basato su evidenze. */
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  /** Dominio principale a cui il consiglio si riferisce. */
  domain: AssessmentDomain;
  /** Livelli per cui il consiglio è pertinente. */
  levels: ResultLevel[];
}
