/**
 * Formatta un numero di secondi in stringa "mm:ss" (es. 1199 → "19:59").
 * Helper puro condiviso da provider, FocusHub, TimerTrigger e Timer202020,
 * così la formattazione del countdown è definita in un solo posto.
 */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
