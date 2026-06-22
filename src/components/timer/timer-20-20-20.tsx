"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  useTimerMachine,
  WORK_DURATION_S,
  BREAK_DURATION_S,
  type TimerPhase,
} from "@/hooks/use-timer-machine";
import { useTimerSound } from "@/hooks/use-timer-sound";
import { useBreakNotifications } from "@/hooks/use-break-notifications";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function cycleLabel(n: number): string {
  if (n === 0) return "Nessuna ancora";
  return n === 1 ? "1 completata" : `${n} completate`;
}

// Fuori dal componente: ricreato a ogni render altrimenti (GC ogni 500ms)
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
  const timer = useTimerMachine();

  // Destrutturiamo i callback stabili (useCallback) per usarli nelle deps
  // degli effetti invece degli oggetti interi (ricreati a ogni render)
  const { playWorkEnd, playBreakEnd } = useTimerSound();
  const {
    permission: notifPermission,
    request: requestNotif,
    notify,
  } = useBreakNotifications();

  const anchorRef = useRef<HTMLDivElement>(null);
  // null = non ancora idratato; usato per distinguere "primo mount" da "fase cambiata"
  const prevPhaseRef = useRef<TimerPhase | null>(null);
  const autoNotifRequestedRef = useRef(false);
  const [announcement, setAnnouncement] = useState("");

  // Richiesta automatica permesso notifiche al primo caricamento
  useEffect(() => {
    if (notifPermission === "default" && !autoNotifRequestedRef.current) {
      autoNotifRequestedRef.current = true;
      const t = setTimeout(() => void requestNotif(), 1800);
      return () => clearTimeout(t);
    }
  }, [notifPermission, requestNotif]);

  // Post-idratazione: inizializza prevPhaseRef con la fase reale ripristinata
  // e gestisce il caso "pagina ricaricata mentre era in break-prompt"
  useEffect(() => {
    if (!timer.isHydrated) return;
    if (prevPhaseRef.current !== null) return; // già inizializzato
    prevPhaseRef.current = timer.phase;

    if (timer.phase === "break-prompt") {
      if (timer.soundOn) playWorkEnd();
      notify("Pausa visiva", "Guarda qualcosa a 6 metri di distanza per 20 secondi.");
      setAnnouncement("Pausa visiva: guarda un oggetto lontano per 20 secondi.");
    }
  }, [timer.isHydrated, timer.phase, timer.soundOn, playWorkEnd, notify]);

  // Side-effect alle transizioni di fase normali (non quella iniziale di idratazione)
  useEffect(() => {
    if (prevPhaseRef.current === null) return; // aspetta idratazione
    if (prevPhaseRef.current === timer.phase) return; // stessa fase
    const prev = prevPhaseRef.current;
    const next = timer.phase;
    prevPhaseRef.current = next;

    if (next === "break-prompt" && prev === "running") {
      if (timer.soundOn) playWorkEnd();
      notify("Pausa visiva", "Guarda qualcosa a 6 metri di distanza per 20 secondi.");
      setAnnouncement("Pausa visiva: guarda un oggetto lontano per 20 secondi.");
    }
    if (next === "break-complete" && prev === "break-active") {
      if (timer.soundOn) playBreakEnd();
      setAnnouncement("Ottimo! Pausa visiva completata. Timer ripartito tra poco.");
    }
    if (next === "running" && prev === "idle") {
      setAnnouncement("Timer avviato. Prossima pausa tra 20 minuti.");
    }
    if (next === "paused") {
      setAnnouncement("Timer in pausa.");
    }
    if (next === "running" && prev === "paused") {
      setAnnouncement("Timer ripreso.");
    }
  }, [timer.phase, timer.soundOn, playWorkEnd, playBreakEnd, notify]);

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
      {/* Regione live per gli screen reader: annunci ai cambi di fase.
          Il countdown visuale NON ha aria-live (evita flood di annunci ogni secondo). */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <DynamicReminderBar
        phase={timer.phase}
        breakLeft={timer.breakLeft}
        onStartBreak={timer.startBreak}
        onSkipBreak={timer.skipBreak}
        onBreakEnd={timer.endBreak}
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
                  I cambi di fase sono annunciati dal polite region separato. */}
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
                notifPermission === "default"
                  ? () => void requestNotif()
                  : undefined
              }
              disabled={
                notifPermission === "denied" || notifPermission === "granted"
              }
              className={cn(
                "rounded-md p-2 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                notifPermission === "granted" && "cursor-default text-primary",
                notifPermission === "default" &&
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                notifPermission === "denied" &&
                  "cursor-not-allowed text-muted-foreground/40",
                notifPermission === "unsupported" && "hidden",
              )}
              aria-label={
                notifPermission === "granted"
                  ? "Notifiche attivate"
                  : notifPermission === "denied"
                    ? "Notifiche bloccate dal browser"
                    : "Attiva notifiche di sistema"
              }
              title={
                notifPermission === "denied"
                  ? "Notifiche bloccate. Abilitale dalle impostazioni del browser."
                  : undefined
              }
            >
              {notifPermission === "granted" ? (
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
