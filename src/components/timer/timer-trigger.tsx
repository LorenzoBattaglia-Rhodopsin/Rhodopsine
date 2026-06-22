"use client";

import { type ComponentType } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTimerContext } from "@/components/timer/timer-provider";
import { formatTime } from "@/components/timer/format-time";

/**
 * TimerTrigger — controllo compatto del Timer 20-20-20, pensato per l'header
 * globale (o una sidebar). È un consumer puro del TimerProvider: nessuno stato
 * proprio, comanda lo stesso timer mostrato dal FocusHub e da Timer202020.
 *
 * Stato "Active": quando il timer scorre, il bottone ha un anello luminoso che
 * pulsa (`hsl(var(--primary))`); in break-prompt l'anello passa ad ambra per
 * richiamare l'attenzione. Le icone Play/Pause si scambiano con un crossfade.
 */

interface TriggerAction {
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  iconKey: string;
  onClick?: () => void;
  label: string;
  disabled: boolean;
  /** Anello pulsante: indica che il timer è "vivo" o richiede attenzione. */
  pulse: "none" | "primary" | "warning";
}

function getAction(
  t: ReturnType<typeof useTimerContext>,
): TriggerAction {
  switch (t.phase) {
    case "running":
      return { Icon: Pause, iconKey: "pause", onClick: t.pause, label: "Metti in pausa il timer", disabled: false, pulse: "primary" };
    case "paused":
      return { Icon: Play, iconKey: "play", onClick: t.resume, label: "Riprendi il timer", disabled: false, pulse: "none" };
    case "break-prompt":
      return { Icon: Play, iconKey: "play", onClick: t.startBreak, label: "Inizia la pausa visiva", disabled: false, pulse: "warning" };
    case "break-active":
      return { Icon: Pause, iconKey: "pause", onClick: undefined, label: "Pausa visiva in corso", disabled: true, pulse: "none" };
    case "break-complete":
      return { Icon: Play, iconKey: "play", onClick: undefined, label: "Pausa completata", disabled: true, pulse: "none" };
    case "idle":
    default:
      return { Icon: Play, iconKey: "play", onClick: t.start, label: "Avvia il timer 20-20-20", disabled: false, pulse: "none" };
  }
}

export function TimerTrigger({ className }: { className?: string }) {
  const t = useTimerContext();

  // Pre-idratazione: placeholder deterministico (combacia col render SSR e
  // col primo render client → niente mismatch di idratazione).
  if (!t.isHydrated) {
    return (
      <div
        className={cn("h-11 w-11 shrink-0 rounded-md bg-muted/50", className)}
        aria-hidden="true"
      />
    );
  }

  const { Icon, iconKey, onClick, label, disabled, pulse } = getAction(t);

  const isRunning = t.phase === "running";
  const isPaused = t.phase === "paused";
  const isBreakActive = t.phase === "break-active";
  const isBreakPrompt = t.phase === "break-prompt";

  // Lettura compatta del countdown, nascosta su mobile per non affollare l'header.
  const readout = isRunning || isPaused
    ? formatTime(t.workLeft)
    : isBreakActive
      ? `${t.breakLeft}s`
      : null;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {readout && (
        <span
          aria-hidden="true"
          className={cn(
            "hidden font-mono text-sm tabular-nums sm:inline",
            isBreakActive ? "text-success" : "text-muted-foreground",
          )}
        >
          {readout}
        </span>
      )}

      <div className="relative">
        {pulse !== "none" && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-md motion-safe:animate-pulse-ring",
              pulse === "warning" ? "bg-warning/40" : "bg-primary/40",
            )}
          />
        )}
        <Button
          type="button"
          size="icon"
          variant={isRunning ? "primary" : "secondary"}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          className={cn(
            "relative",
            isRunning && "ring-2 ring-primary ring-offset-2 ring-offset-background",
            isBreakPrompt && "ring-2 ring-warning ring-offset-2 ring-offset-background",
          )}
        >
          {/* key → ri-triggera il crossfade quando l'icona cambia. */}
          <span
            key={iconKey}
            className="inline-flex motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-300"
          >
            <Icon className="size-4" aria-hidden={true} />
          </span>
        </Button>
      </div>

      {/* Reset: visibile da sm in su quando il timer non è inattivo. */}
      {t.phase !== "idle" && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={t.reset}
          aria-label="Reimposta il timer"
          className="hidden text-muted-foreground sm:inline-flex"
        >
          <RotateCcw className="size-4" aria-hidden={true} />
        </Button>
      )}
    </div>
  );
}
