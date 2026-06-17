"use client";

import { useCallback, useMemo, useState } from "react";
import { questions, totalQuestions } from "@/data/questions";
import { computeAssessment } from "@/features/assessment/scoring";
import type {
  AssessmentAnswers,
  AssessmentResult,
  LikertValue,
} from "@/types/assessment";

/**
 * Hook che incapsula lo stato e la logica del wizard di autovalutazione,
 * mantenendo i componenti UI snelli e facilmente testabili.
 *
 * La navigazione di rotta (router.push) resta nel componente che usa l'hook:
 * qui si espone solo `getResult()` per costruire la destinazione.
 */
export function useAssessment() {
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = questions[currentIndex];
  const currentValue = answers[current.id];

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const canProceed = currentValue !== undefined;
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );

  const setAnswer = useCallback(
    (value: LikertValue) => {
      setAnswers((prev) => ({ ...prev, [current.id]: value }));
    },
    [current.id],
  );

  const goBack = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
  }, []);

  const getResult = useCallback(
    (): AssessmentResult => computeAssessment(answers),
    [answers],
  );

  return {
    // stato
    answers,
    currentIndex,
    current,
    currentValue,
    answeredCount,
    totalQuestions,
    // flag derivati
    isFirst,
    isLast,
    canProceed,
    progress,
    // azioni
    setAnswer,
    goBack,
    goNext,
    getResult,
  };
}
