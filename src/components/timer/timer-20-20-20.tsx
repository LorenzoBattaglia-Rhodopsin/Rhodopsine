"use client";

import { useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/timer/circular-progress";
import { DynamicReminderBar } from "@/components/timer/dynamic-reminder-bar";
import { MiniTimer } from "@/components/timer/mini-timer";
import { WORK_DURATION_S, BREAK_DURATION_S } from "@/hooks/use-timer-machine";
import { useTimerContext } from "@/components/timer/timer-provider";
import { formatTime } from "@/components/timer/format-time";

function cycleLabel(n: number): string {
  if (n === 0) return "Nessuna ancora";
  return n === 1 ? "1 completata" : `${n} completate`;
}

type BadgeVariant = "neutral" | "primary" | "warning" | "success";
const PHASE_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  idle:           { variant: "neutral",  label: "Inattivo" },
  running:        { variant: "primary",  label: "Attivo" },
  paused:         { variant: "warning",  label: "In pausa" },
  "break-prompt": { variant: "warning",  label: "Pausa necessaria" },
  "break-active": { variant: "success",  label: "Pausa in corso" },
  "break-complete":{ variant: "success", label: "Pausa completata" },
};

export function Timer202020() {
  // Stato e azioni vengono dal TimerProvider (sorgente unica): così questo
  // display circolare, il FocusHub e il TimerTrigger nell'header comandano
  // lo STESSO timer. Gli effetti collaterali (suono/notifiche/Media Session/
  // annunci SR) vivono nel provider.
  const timer = useTimerContext();

  const anchorRef = useRef<HTMLDivElement>(null);

  const workProgress = (timer.workLeft / WORK_DURATION_S) * 100;
  const breakProgress =
    ((BREAK_DURATION_S - timer.breakLeft) / BREAK_DURATION_S) * 100;

  const isIdle      = timer.phase === "idle";
  const isRunning   = timer.phase === "running";
  const isPaused    = timer.phase === "paused";
  const isBreakActive = timer.phase === "break-active";
  const showWork    = isIdle || isRunning || isPaused;

  const badge = PHASE_BADGE[timer.phase] ?? PHASE_BADGE.idle;

  // Skeleton durante l'idratazione da localStorage
  if (!timer.isHydrated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-8 py-8">
        <div
          className="animate-pulse rounded-full bg-muted"
          style={{ width: 220, height: 220 }}
          aria-hidden="true"
        />
        <div className="h-12 w-48 animate-pulse rounded-xl bg-muted" aria-hidden="true" />
        <div className="h-16 w-full animate-pulse rounded-xl bg-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      <DynamicReminderBar
        phase={timer.phase}
        breakLeft={timer.breakLeft}
        onStartBreak={timer.startBreak}
        onSkipBreak={timer.skipBreak}
      />

      {/* MiniTimer montato solo dopo idratazione: così anchorRef è già popolato
          quando l'IntersectionObserver viene registrato */}
      <MiniTimer
        phase={timer.phase}
        workLeft={timer.workLeft}
        breakLeft={timer.breakLeft}
        anchorRef={anchorRef}
      />

      <div
        ref={anchorRef}
        className="mx-auto flex w-full max-w-md flex-col items-center gap-8"
      >
        <Badge variant={badge.variant} className="tracking-wide">
          {badge.label}
        </Badge>

        {showWork && (
          <CircularProgress
            value={isIdle ? 100 : workProgress}
            size={220}
            strokeWidth={8}
            progressColor={isPaused ? "hsl(var(--warning))" : "hsl(var(--primary))"}
          >
            <div className="flex select-none flex-col items-center gap-1">
              {/* Nessun aria-live: evita flood di annunci ogni secondo.
                  I cambi di fase sono annunciati dal polite region del provider. */}
              <span
                className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-foreground"
                aria-label={`${formatTime(isIdle ? WORK_DURATION_S : timer.workLeft)} rimanenti`}
              >
                {formatTime(isIdle ? WORK_DURATION_S : timer.workLeft)}
              </span>
              <span className="text-xs text-muted-foreground">
                {isPaused ? "in pausa" : "rimanenti"}
              </span>
            </div>
          </CircularProgress>
        )}

        {isBreakActive && (
          <CircularProgress
            value={breakProgress}
            size={220}
            strokeWidth={8}
            progressColor="hsl(var(--success))"
          >
            <div className="flex select-none flex-col items-center gap-1">
              <span
                className="font-mono text-5xl font-semibold tabular-nums tracking-tight text-foreground"
                aria-label={`${timer.breakLeft} secondi di pausa rimanenti`}
              >
                {timer.breakLeft}
              </span>
              <span className="text-xs text-muted-foreground">secondi</span>
            </div>
          </CircularProgress>
        )}

        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          {isIdle      && "Avvia il timer per iniziare a monitorare le tue pause visive."}
          {isRunning   && "Ogni 20 minuti ti ricorderò di fare una pausa visiva di 20 secondi."}
          {isPaused    && "Il timer è in pausa. Riprendi quando sei pronto."}
          {isBreakActive && "Guarda un oggetto distante almeno 6 metri. Lascia rilassare i muscoli degli occhi."}
        </p>

        <div
          className="flex items-center gap-3"
          role="group"
          aria-label="Controlli timer 20-20-20"
        >
          {isIdle && (
            <Button size="lg" onClick={timer.start} className="min-w-[160px]">
              <Play className="size-4" aria-hidden="true" />
              Avvia timer
            </Button>
          )}

          {isRunning && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={timer.reset}
                aria-label="Reimposta il timer a zero"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </Button>
              <Button size="lg" onClick={timer.pause} className="min-w-[160px]">
                <Pause className="size-4" aria-hidden="true" />
                Pausa
              </Button>
            </>
          )}

          {isPaused && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={timer.reset}
                aria-label="Reimposta il timer a zero"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </Button>
              <Button size="lg" onClick={timer.resume} className="min-w-[160px]">
                <Play className="size-4" aria-hidden="true" />
                Riprendi
              </Button>
            </>
          )}

          {isBreakActive && (
            <p className="text-sm italic text-muted-foreground">
              La pausa terminerà automaticamente
            </p>
          )}
        </div>

        {/* Pannello statistiche e preferenze */}
        <div className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Pause completate</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {cycleLabel(timer.cycles)}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={
                timer.notifPermission === "default"
                  ? () => void timer.requestNotif()
                  : undefined
              }
              disabled={
                timer.notifPermission === "denied" ||
                timer.notifPermission === "granted"
              }
              className={cn(
                "rounded-md p-2 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                timer.notifPermission === "granted" && "cursor-default text-primary",
                timer.notifPermission === "default" &&
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                timer.notifPermission === "denied" &&
                  "cursor-not-allowed text-muted-foreground/40",
                timer.notifPermission === "unsupported" && "hidden",
              )}
              aria-label={
                timer.notifPermission === "granted"
                  ? "Notifiche attivate"
                  : timer.notifPermission === "denied"
                    ? "Notifiche bloccate dal browser"
                    : "Attiva notifiche di sistema"
              }
              title={
                timer.notifPermission === "denied"
                  ? "Notifiche bloccate. Abilitale dalle impostazioni del browser."
                  : undefined
              }
            >
              {timer.notifPermission === "granted" ? (
                <Bell className="size-4" aria-hidden="true" />
              ) : (
                <BellOff className="size-4" aria-hidden="true" />
              )}
            </button>

            <button
              onClick={timer.toggleSound}
              className={cn(
                "rounded-md p-2 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                timer.soundOn
                  ? "text-primary hover:bg-accent"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              aria-label={timer.soundOn ? "Disattiva suoni" : "Attiva suoni"}
              aria-pressed={timer.soundOn}
            >
              {timer.soundOn ? (
                <Volume2 className="size-4" aria-hidden="true" />
              ) : (
                <VolumeX className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
