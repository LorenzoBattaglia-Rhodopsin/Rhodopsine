"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const WORK_DURATION_S = 20 * 60; // 1200 secondi
export const BREAK_DURATION_S = 20;     // 20 secondi

const LS_KEY = "wbe_timer_v1";

export type TimerPhase =
  | "idle"
  | "running"
  | "paused"
  | "break-prompt"
  | "break-active"
  | "break-complete";

interface TimerState {
  phase: TimerPhase;
  /** Secondi rimanenti nel blocco di lavoro. */
  workLeft: number;
  /** Secondi rimanenti nella pausa visiva. */
  breakLeft: number;
  /** Cicli 20-20-20 completati. */
  cycles: number;
  soundOn: boolean;
  /** Epoch ms in cui scade il countdown corrente (usato per la sincronizzazione cross-tab). */
  targetMs: number | null;
}

const DEFAULTS: TimerState = {
  phase: "idle",
  workLeft: WORK_DURATION_S,
  breakLeft: BREAK_DURATION_S,
  cycles: 0,
  soundOn: true,
  targetMs: null,
};

function readStorage(): TimerState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const s = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<TimerState>) };

    // Riconcilia: se il timer era in esecuzione, ricalcola il tempo rimanente
    if (
      (s.phase === "running" || s.phase === "break-active") &&
      s.targetMs !== null
    ) {
      const left = Math.max(0, Math.floor((s.targetMs - Date.now()) / 1000));
      if (s.phase === "running") {
        s.workLeft = left;
        if (left === 0) { s.phase = "break-prompt"; s.targetMs = null; }
      } else {
        s.breakLeft = left;
        if (left === 0) {
          s.phase = "break-complete";
          s.cycles += 1;
          s.targetMs = null;
        }
      }
    }
    return s;
  } catch {
    return DEFAULTS;
  }
}

function writeStorage(s: TimerState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

export function useTimerMachine() {
  const [state, setState] = useState<TimerState>(DEFAULTS);
  const [isHydrated, setIsHydrated] = useState(false);
  const hydratedRef = useRef(false);

  // Idratazione da localStorage — una sola volta al mount
  useEffect(() => {
    setState(readStorage());
    hydratedRef.current = true;
    setIsHydrated(true);
  }, []);

  // Persistenza — aggiorna ad ogni cambio di stato (dopo l'idratazione)
  useEffect(() => {
    if (!hydratedRef.current) return;
    writeStorage(state);
  }, [state]);

  // Motore di tick — gira solo durante "running" e "break-active"
  useEffect(() => {
    if (state.phase !== "running" && state.phase !== "break-active") return;
    const id = setInterval(() => {
      const now = Date.now();
      setState((s) => {
        if (s.phase === "running" && s.targetMs !== null) {
          const left = Math.max(0, Math.floor((s.targetMs - now) / 1000));
          return left === 0
            ? { ...s, phase: "break-prompt", workLeft: 0, targetMs: null }
            : { ...s, workLeft: left };
        }
        if (s.phase === "break-active" && s.targetMs !== null) {
          const left = Math.max(0, Math.floor((s.targetMs - now) / 1000));
          return left === 0
            ? { ...s, phase: "break-complete", breakLeft: 0, cycles: s.cycles + 1, targetMs: null }
            : { ...s, breakLeft: left };
        }
        return s;
      });
    }, 500);
    return () => clearInterval(id);
  }, [state.phase]);

  // Page Visibility API — ricalcola quando si torna al tab
  useEffect(() => {
    const handler = () => {
      if (document.hidden) return;
      setState((s) => {
        if (
          (s.phase !== "running" && s.phase !== "break-active") ||
          s.targetMs === null
        ) return s;
        const left = Math.max(0, Math.floor((s.targetMs - Date.now()) / 1000));
        if (s.phase === "running") {
          return left === 0
            ? { ...s, phase: "break-prompt", workLeft: 0, targetMs: null }
            : { ...s, workLeft: left };
        }
        return left === 0
          ? { ...s, phase: "break-complete", breakLeft: 0, cycles: s.cycles + 1, targetMs: null }
          : { ...s, breakLeft: left };
      });
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const start = useCallback(() =>
    setState((s) => ({
      ...s,
      phase: "running",
      workLeft: WORK_DURATION_S,
      breakLeft: BREAK_DURATION_S,
      targetMs: Date.now() + WORK_DURATION_S * 1000,
    })), []);

  const pause = useCallback(() =>
    setState((s) => ({ ...s, phase: "paused", targetMs: null })), []);

  const resume = useCallback(() =>
    setState((s) => ({
      ...s,
      phase: "running",
      targetMs: Date.now() + s.workLeft * 1000,
    })), []);

  const reset = useCallback(() =>
    setState((s) => ({ ...DEFAULTS, soundOn: s.soundOn })), []);

  const startBreak = useCallback(() =>
    setState((s) => ({
      ...s,
      phase: "break-active",
      breakLeft: BREAK_DURATION_S,
      targetMs: Date.now() + BREAK_DURATION_S * 1000,
    })), []);

  const endBreak = useCallback(() =>
    setState((s) => ({
      ...s,
      phase: "running",
      workLeft: WORK_DURATION_S,
      breakLeft: BREAK_DURATION_S,
      targetMs: Date.now() + WORK_DURATION_S * 1000,
    })), []);

  const skipBreak = useCallback(() =>
    setState((s) => ({
      ...s,
      phase: "running",
      workLeft: WORK_DURATION_S,
      breakLeft: BREAK_DURATION_S,
      targetMs: Date.now() + WORK_DURATION_S * 1000,
    })), []);

  const toggleSound = useCallback(() =>
    setState((s) => ({ ...s, soundOn: !s.soundOn })), []);

  return {
    phase: state.phase,
    workLeft: state.workLeft,
    breakLeft: state.breakLeft,
    cycles: state.cycles,
    soundOn: state.soundOn,
    isHydrated,
    start,
    pause,
    resume,
    reset,
    startBreak,
    endBreak,
    skipBreak,
    toggleSound,
  };
}
