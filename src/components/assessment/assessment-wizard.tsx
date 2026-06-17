"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionStep } from "@/components/assessment/question-step";
import { questions, totalQuestions } from "@/data/questions";
import { computeAssessment } from "@/features/assessment/scoring";
import { routes } from "@/data/site";
import type { AssessmentAnswers, LikertValue } from "@/types/assessment";

/**
 * WIZARD DI AUTOVALUTAZIONE (client)
 * --------------------------------------------------------------------------
 * Mostra una domanda alla volta (ottimale su mobile), tiene lo stato delle
 * risposte e, al termine, calcola il punteggio e naviga alla pagina risultati
 * passando il punteggio normalizzato (`s`) e il dominio più critico (`d`)
 * come parametri di query.
 *
 * Nessun dato personale viene salvato o inviato a server esterni: tutto resta
 * nel browser durante la sessione.
 */
export function AssessmentWizard() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const headingRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const current = questions[currentIndex];
  const currentValue = answers[current.id];
  const isLast = currentIndex === totalQuestions - 1;
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Sposta il focus sulla nuova domanda al cambio step (utile per screen reader).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [currentIndex]);

  function handleAnswer(value: LikertValue) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function handleBack() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    if (currentValue === undefined) return;

    if (!isLast) {
      setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
      return;
    }

    // Ultima domanda: calcola il risultato e naviga.
    setSubmitting(true);
    const result = computeAssessment(answers);
    const topDomain = result.domainScores[0]?.domain;
    const params = new URLSearchParams({ s: String(result.normalized) });
    if (topDomain) params.set("d", topDomain);
    router.push(`${routes.results}?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Barra di avanzamento + contatore */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Domanda {currentIndex + 1} di {totalQuestions}
          </span>
          <span aria-hidden="true">{progress}%</span>
        </div>
        <Progress value={progress} aria-label={`Avanzamento: ${progress}%`} />
        {/* Annuncio per gli screen reader al cambio di domanda */}
        <p className="sr-only" aria-live="polite">
          Domanda {currentIndex + 1} di {totalQuestions}
        </p>
      </div>

      {/* Domanda corrente */}
      <div
        ref={headingRef}
        tabIndex={-1}
        className="rounded-xl border border-border bg-card p-6 outline-none sm:p-8"
      >
        <QuestionStep
          question={current}
          value={currentValue}
          onChange={handleAnswer}
        />
      </div>

      {/* Navigazione */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          <ArrowLeft aria-hidden="true" />
          Indietro
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={currentValue === undefined || submitting}
        >
          {isLast ? "Vedi i risultati" : "Avanti"}
          {!isLast && <ArrowRight aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
}
