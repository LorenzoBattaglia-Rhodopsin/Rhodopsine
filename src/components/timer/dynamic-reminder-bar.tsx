"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type TimerPhase, BREAK_DURATION_S } from "@/hooks/use-timer-machine";

type BarState = "hidden" | "compact" | "expanded" | "countdown" | "complete";

interface DynamicReminderBarProps {
  phase: TimerPhase;
  breakLeft: number;
  onStartBreak: () => void;
  onSkipBreak: () => void;
}

export function DynamicReminderBar({
  phase,
  breakLeft,
  onStartBreak,
  onSkipBreak,
}: DynamicReminderBarProps) {
  const [barState, setBarState] = useState<BarState>("hidden");
  const [mounted, setMounted] = useState(false);
  const startBreakBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (phase === "break-prompt") {
      setMounted(true);
      setBarState("compact");
      const t = setTimeout(() => setBarState("expanded"), 1000);
      return () => clearTimeout(t);
    }

    if (phase === "break-active") {
      setMounted(true);
      setBarState("countdown");
      return;
    }

    if (phase === "break-complete") {
      setMounted(true);
      setBarState("complete");
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([80, 40, 80]);
      }
      // Solo auto-nascondi VISIVO della pill. La transizione break-complete →
      // running è ora del TimerProvider (vedi commento lì): owner unico, così
      // funziona anche quando questa barra non è montata (fuori da /timer).
      const t1 = setTimeout(() => setBarState("hidden"), 3000);
      return () => clearTimeout(t1);
    }

    // idle / running / paused: chiudi la barra
    setBarState("hidden");
    const t = setTimeout(() => setMounted(false), 350);
    return () => clearTimeout(t);
  }, [phase]);

  // Sposta il focus sul CTA quando la pill si espande (accessibilità tastiera)
  useEffect(() => {
    if (barState === "expanded") {
      startBreakBtnRef.current?.focus();
    }
  }, [barState]);

  const breakProgress = Math.max(
    0,
    ((BREAK_DURATION_S - breakLeft) / BREAK_DURATION_S) * 100,
  );
  const isVisible = barState !== "hidden";

  if (!mounted) return null;

  return (
    <div
      // role="region" è corretto per una notifica non-modale (nessun focus trap)
      // aria-live="polite" annuncia i cambiamenti agli screen reader senza interrompere
      role="region"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Promemoria pausa visiva 20-20-20"
      className="fixed left-1/2 top-4 z-50 w-full max-w-xs -translate-x-1/2 px-3 sm:max-w-sm"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10",
          "bg-card/95 shadow-2xl backdrop-blur-xl",
          "transition-all duration-500",
          isVisible ? "animate-island-in" : "translate-y-[-8px] scale-95 opacity-0",
        )}
      >
        {/* Riga di luce superiore */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />

        {/* STATO: compact */}
        {barState === "compact" && (
          <div className="flex items-center gap-2.5 px-4 py-3">
            <Eye className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <p className="flex-1 text-sm font-medium text-foreground">
              È il momento di riposare gli occhi
            </p>
          </div>
        )}

        {/* STATO: expanded */}
        {barState === "expanded" && (
          <div className="px-4 py-4">
            <div className="mb-3.5 flex items-start gap-3">
              <div
                aria-hidden="true"
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15"
              >
                <Eye className="size-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Pausa visiva</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Guarda un oggetto distante almeno 6 metri per 20 secondi.
                </p>
              </div>
              {/* FIX: touch target ≥44px (WCAG 2.2 SC 2.5.8 + CLAUDE.md §6) */}
              <button
                onClick={onSkipBreak}
                className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Salta questa pausa"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
            <Button
              ref={startBreakBtnRef}
              size="sm"
              className="w-full"
              onClick={onStartBreak}
            >
              Inizia pausa
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* STATO: countdown */}
        {barState === "countdown" && (
          <div className="px-4 py-4">
            <div className="mb-3 flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/15"
              >
                <Eye className="size-4 animate-pulse text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Riposo visivo in corso
                </p>
                <p
                  className="mt-0.5 text-xs text-muted-foreground"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  {breakLeft}s rimanenti
                </p>
              </div>
            </div>
            <Progress
              value={breakProgress}
              aria-label={`Pausa visiva: ${breakLeft} secondi rimanenti su ${BREAK_DURATION_S}`}
              className="h-1.5"
            />
          </div>
        )}

        {/* STATO: complete */}
        {barState === "complete" && (
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/20"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M4 9l3.5 3.5L14 5"
                  stroke="hsl(var(--success))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="32"
                  className="animate-check-draw"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Ottimo lavoro!</p>
              <p className="text-xs text-muted-foreground">I tuoi occhi ti ringraziano.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
