"use client";

import { useCallback, useEffect, useRef } from "react";

type WindowWithWebkit = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export function useTimerSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    try {
      if (!ctxRef.current) {
        const AudioCtx =
          window.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext;
        if (!AudioCtx) return null;
        ctxRef.current = new AudioCtx();
      }
      // Riprende il context se è stato sospeso (politica autoplay browser)
      if (ctxRef.current.state === "suspended") {
        void ctxRef.current.resume();
      }
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  const tone = useCallback(
    (
      ctx: AudioContext,
      freq: number,
      startAt: number,
      duration: number,
      volume = 0.25,
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(volume, startAt + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.01);
    },
    [],
  );

  /** Doppio chime morbido (A4 → E5) — segnala la fine dei 20 minuti. */
  const playWorkEnd = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(ctx, 440, t, 1.1, 0.28);
    tone(ctx, 659.25, t + 0.38, 0.9, 0.22);
  }, [getCtx, tone]);

  /** Triade ascendente (C5 → E5 → G5) — celebra la fine della pausa. */
  const playBreakEnd = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(ctx, 523.25, t, 0.65, 0.2);
    tone(ctx, 659.25, t + 0.22, 0.65, 0.2);
    tone(ctx, 783.99, t + 0.44, 0.8, 0.22);
  }, [getCtx, tone]);

  // Chiude il context all'unmount (evita leak su navigazione SPA)
  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return { playWorkEnd, playBreakEnd };
}
