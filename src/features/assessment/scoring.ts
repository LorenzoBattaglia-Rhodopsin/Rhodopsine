import { questions } from "@/data/questions";
import type {
  AssessmentAnswers,
  AssessmentResult,
  AssessmentDomain,
  DomainScore,
  LikertValue,
  ResultLevel,
} from "@/types/assessment";

/**
 * ALGORITMO DI SCORING — Affaticamento visivo
 * --------------------------------------------------------------------------
 * Obiettivo: trasformare le risposte in un punteggio normalizzato 0–100,
 * dove 0 = abitudini ottimali / sintomi assenti e 100 = affaticamento elevato.
 *
 * IMPORTANTE: il punteggio è SOLO educativo. Non è una diagnosi, non
 * sostituisce la valutazione di un professionista della visione.
 *
 * Come funziona:
 * 1. Ogni risposta vale 1–5.
 * 2. Le domande "symptom" contribuiscono direttamente (5 = peggio).
 * 3. Le domande "protective" vengono INVERTITE (6 - valore), così che una
 *    buona abitudine ("Sempre" = 5) contribuisca poco all'affaticamento.
 * 4. Si normalizza la somma sull'intervallo teorico [min, max] -> 0–100.
 */

/** Soglie dei livelli (in punteggio normalizzato 0–100). */
export const SCORE_THRESHOLDS = {
  /** Sotto questo valore: affaticamento basso. */
  low: 34,
  /** Sotto questo valore: affaticamento moderato; pari/oltre: elevato. */
  medium: 67,
} as const;

/** Converte una risposta nel suo contributo all'affaticamento (1–5). */
function toStrainContribution(
  value: LikertValue,
  direction: "symptom" | "protective",
): number {
  return direction === "protective" ? 6 - value : value;
}

/** Normalizza una somma sull'intervallo [min, max] in scala 0–100. */
function normalize(sum: number, count: number): number {
  const min = count * 1;
  const max = count * 5;
  if (max === min) return 0;
  const value = ((sum - min) / (max - min)) * 100;
  return Math.round(Math.min(100, Math.max(0, value)));
}

/** Determina il livello a partire dal punteggio normalizzato. */
export function getResultLevel(normalized: number): ResultLevel {
  if (normalized < SCORE_THRESHOLDS.low) return "low";
  if (normalized < SCORE_THRESHOLDS.medium) return "medium";
  return "high";
}

/**
 * Calcola il risultato completo a partire dalle risposte.
 * Considera solo le domande effettivamente risposte (robusto a questionari
 * parziali), così il punteggio resta confrontabile.
 */
export function computeAssessment(answers: AssessmentAnswers): AssessmentResult {
  let rawScore = 0;
  let answeredCount = 0;

  // Accumulatori per dominio.
  const perDomain = new Map<AssessmentDomain, { sum: number; count: number }>();

  for (const q of questions) {
    const value = answers[q.id];
    if (value === undefined) continue;

    const contribution = toStrainContribution(value, q.direction);
    rawScore += contribution;
    answeredCount += 1;

    const bucket = perDomain.get(q.domain) ?? { sum: 0, count: 0 };
    bucket.sum += contribution;
    bucket.count += 1;
    perDomain.set(q.domain, bucket);
  }

  const normalized = normalize(rawScore, answeredCount);

  // Punteggi per dominio, ordinati dal più critico (più alto) al meno critico.
  const domainScores: DomainScore[] = Array.from(perDomain.entries())
    .map(([domain, { sum, count }]) => ({
      domain,
      normalized: normalize(sum, count),
    }))
    .sort((a, b) => b.normalized - a.normalized);

  return {
    rawScore,
    maxScore: answeredCount * 5,
    normalized,
    level: getResultLevel(normalized),
    domainScores,
  };
}
