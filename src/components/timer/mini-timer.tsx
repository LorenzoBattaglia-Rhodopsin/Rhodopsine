"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { type TimerPhase } from "@/hooks/use-timer-machine";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface MiniTimerProps {
  phase: TimerPhase;
  workLeft: number;
  breakLeft: number;
  /** Ref all'elemento principale del timer: la pill appare quando è fuori viewport. */
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

export function MiniTimer({ phase, workLeft, breakLeft, anchorRef }: MiniTimerProps) {
  const [anchorHidden, setAnchorHidden] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => setAnchorHidden(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [anchorRef]);

  const isActive =
    phase === "running" ||
    phase === "paused" ||
    phase === "break-active" ||
    phase === "break-complete";

  const visible = anchorHidden && isActive;

  const isBreak = phase === "break-active";
  const isPaused = phase === "paused";

  const label = isBreak
    ? "Pausa"
    : isPaused
      ? "In pausa"
      : "Prossima pausa tra";

  const timeDisplay = isBreak
    ? `${breakLeft}s`
    : formatTime(workLeft);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-6 right-4 z-40 sm:right-6",
        "transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none",
      )}
    >
      <div
        role={visible ? "status" : undefined}
        aria-label={
          visible
            ? `Timer 20-20-20: ${label} ${timeDisplay}`
            : undefined
        }
        className={cn(
          "flex items-center gap-2 rounded-full px-3.5 py-2",
          "border border-border/50 bg-card/95 shadow-lg backdrop-blur-sm",
          "transition-colors duration-300",
        )}
      >
        <Eye
          className={cn(
            "size-3.5 shrink-0",
            isBreak ? "animate-pulse text-success" : "text-primary",
          )}
          aria-hidden="true"
        />
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-mono text-xs font-semibold tabular-nums",
            isBreak ? "text-success" : "text-foreground",
          )}
        >
          {timeDisplay}
        </span>
      </div>
    </div>
  );
}
