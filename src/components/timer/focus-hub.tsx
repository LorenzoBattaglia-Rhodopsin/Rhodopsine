"use client";

import { Play, Pause, RotateCcw, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTimerContext } from "@/components/timer/timer-provider";
import { formatTime } from "@/components/timer/format-time";
import { WORK_DURATION_S, BREAK_DURATION_S } from "@/hooks/use-timer-machine";

/**
 * FocusHub — sezione "focus" dedicata al Timer 20-20-20.
 *
 * Card (shadcn, stile new-york) con: badge di fase, grande display del tempo in
 * Geist Mono, barra `Progress` con gradiente teal (% di tempo rimanente) e i
 * controlli principali (bottone `size="xl"`). Consumer puro del TimerProvider.
 *
 * Feedback visivo:
 * - attivo (running): bordo teal + filo luminoso in alto.
 * - scaduto (break-prompt): bordo ambra + micro "shake".
 * - pausa visiva (break-active/complete): bordo salvia.
 * Tutte le animazioni sono `motion-safe` e rispettano prefers-reduced-motion.
 */

type BadgeVariant = "neutral" | "primary" | "warning" | "success";

const PHASE_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  idle:             { variant: "neutral", label: "Inattivo" },
  running:          { variant: "primary", label: "Attivo" },
  paused:           { variant: "warning", label: "In pausa" },
  "break-prompt":   { variant: "warning", label: "Pausa necessaria" },
  "break-active":   { variant: "success", label: "Pausa in corso" },
  "break-complete": { variant: "success", label: "Pausa completata" },
};

const DESCRIPTION: Record<string, string> = {
  idle: "Avvia il timer per iniziare a monitorare le tue pause visive.",
  running: "Ogni 20 minuti ti ricorderò di fare una pausa visiva di 20 secondi.",
  paused: "Il timer è in pausa. Riprendi quando sei pronto.",
  "break-prompt": "È ora di una pausa: guarda un oggetto a oltre 6 metri per 20 secondi.",
  "break-active": "Guarda un oggetto distante almeno 6 metri. Lascia rilassare i muscoli degli occhi.",
  "break-complete": "Ottimo lavoro! Tra poco il timer riparte da capo.",
};

export function FocusHub({ className }: { className?: string }) {
  const t = useTimerContext();

  // Skeleton durante l'idratazione da localStorage (combacia col render SSR).
  if (!t.isHydrated) {
    return (
      <Card className={cn("mx-auto w-full max-w-md p-6 sm:p-8", className)}>
        <div className="flex flex-col items-center gap-6">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" aria-hidden="true" />
          <div className="h-16 w-44 animate-pulse rounded-xl bg-muted" aria-hidden="true" />
          <div className="h-2 w-full animate-pulse rounded-full bg-muted" aria-hidden="true" />
          <div className="h-14 w-44 animate-pulse rounded-xl bg-muted" aria-hidden="true" />
        </div>
      </Card>
    );
  }

  const { phase, workLeft, breakLeft } = t;
  const isIdle = phase === "idle";
  const isRunning = phase === "running";
  const isPaused = phase === "paused";
  const isBreakActive = phase === "break-active";
  const isBreakPrompt = phase === "break-prompt";
  const isBreakComplete = phase === "break-complete";
  const isBreakPhase = isBreakActive || isBreakComplete;

  // Display + percentuale di tempo RIMANENTE (la barra si svuota nel tempo).
  let display: string;
  let unit: string;
  let progressValue: number;
  let ariaLabel: string;

  if (isBreakActive) {
    display = String(breakLeft);
    unit = "secondi";
    progressValue = (breakLeft / BREAK_DURATION_S) * 100;
    ariaLabel = `${breakLeft} secondi di pausa rimanenti`;
  } else if (isBreakPrompt) {
    display = "00:00";
    unit = "pausa necessaria";
    progressValue = 0;
    ariaLabel = "Blocco di lavoro completato: è ora della pausa visiva";
  } else if (isBreakComplete) {
    display = formatTime(WORK_DURATION_S);
    unit = "si riparte";
    progressValue = 100;
    ariaLabel = "Pausa completata";
  } else {
    const left = isIdle ? WORK_DURATION_S : workLeft;
    display = formatTime(left);
    unit = isPaused ? "in pausa" : "rimanenti";
    progressValue = (left / WORK_DURATION_S) * 100;
    ariaLabel = `${formatTime(left)} rimanenti`;
  }

  const badge = PHASE_BADGE[phase] ?? PHASE_BADGE.idle;

  return (
    <Card
      role="group"
      aria-label="Timer 20-20-20 — sezione focus"
      className={cn(
        "relative mx-auto w-full max-w-md overflow-hidden p-6 sm:p-8",
        "motion-safe:animate-fade-in-up",
        isRunning && "border-primary/40",
        isBreakPhase && "border-success/50",
        isBreakPrompt && "border-warning/60 motion-safe:animate-shake",
        className,
      )}
    >
      {/* Filo luminoso superiore: gradiente teal, più acceso quando attivo. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-500",
          isRunning ? "via-primary opacity-90" : "via-primary/40 opacity-60",
        )}
      />

      <div className="flex flex-col items-center gap-6">
        <Badge variant={badge.variant} className="tracking-wide">
          {badge.label}
        </Badge>

        {/* key={phase} → crossfade del display ad ogni cambio di fase. */}
        <div
          key={phase}
          className="flex select-none flex-col items-center gap-1 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500"
        >
          <span
            className="font-mono text-6xl font-semibold tabular-nums tracking-tight text-foreground sm:text-7xl"
            aria-label={ariaLabel}
          >
            {display}
          </span>
          <span className="text-sm text-muted-foreground">
            {unit}
          </span>
        </div>

        <Progress
          value={progressValue}
          aria-label="Tempo rimanente"
          indicatorClassName={cn(
            "bg-gradient-to-r",
            isBreakPhase ? "from-success to-success/70" : "from-primary to-primary-hover",
          )}
        />

        <p className="text-pretty text-center text-sm leading-relaxed text-muted-foreground">
          {DESCRIPTION[phase]}
        </p>

        <div
          className="flex w-full flex-wrap items-center justify-center gap-3"
          role="group"
          aria-label="Controlli sezione focus"
        >
          {isIdle && (
            <Button size="xl" onClick={t.start} className="min-w-[200px]">
              <Play aria-hidden="true" />
              Avvia timer
            </Button>
          )}

          {isRunning && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={t.reset}
                aria-label="Reimposta il timer a zero"
              >
                <RotateCcw aria-hidden="true" />
              </Button>
              <Button size="xl" onClick={t.pause} className="min-w-[200px]">
                <Pause aria-hidden="true" />
                Pausa
              </Button>
            </>
          )}

          {isPaused && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={t.reset}
                aria-label="Reimposta il timer a zero"
              >
                <RotateCcw aria-hidden="true" />
              </Button>
              <Button size="xl" onClick={t.resume} className="min-w-[200px]">
                <Play aria-hidden="true" />
                Riprendi
              </Button>
            </>
          )}

          {isBreakPrompt && (
            <>
              <Button
                variant="ghost"
                size="md"
                onClick={t.skipBreak}
                aria-label="Salta la pausa visiva"
              >
                Salta
              </Button>
              <Button size="xl" onClick={t.startBreak} className="min-w-[200px]">
                <Eye aria-hidden="true" />
                Inizia la pausa
              </Button>
            </>
          )}

          {isBreakActive && (
            <p className="text-sm italic text-muted-foreground">
              La pausa terminerà automaticamente
            </p>
          )}

          {isBreakComplete && (
            <p className="text-sm font-medium text-success">Ottimo lavoro!</p>
          )}
        </div>
      </div>
    </Card>
  );
}
