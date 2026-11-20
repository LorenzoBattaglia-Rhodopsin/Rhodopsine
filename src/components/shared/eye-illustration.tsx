/**
 * Illustrazione dell'hero: un'iride stilizzata con un alone "soft focus".
 * È puramente decorativa (aria-hidden) ed è realizzata in SVG inline:
 * nessuna immagine da scaricare, nitida a ogni risoluzione, leggerissima.
 *
 * L'alone è statico di proposito: un'oscillazione lenta e infinita attira lo
 * sguardo in periferia, l'opposto di ciò che un sito sul riposo visivo vuole.
 */
export function EyeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Illustrazione astratta di un'iride, simbolo del benessere visivo"
    >
      <defs>
        <radialGradient id="wbe-iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          <stop offset="55%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wbe-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Alone soft-focus (statico) */}
      <circle cx="200" cy="200" r="190" fill="url(#wbe-glow)" opacity="0.65" />

      {/* Anelli concentrici dell'iride */}
      {[150, 118, 86].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeOpacity={0.12 + i * 0.05}
          strokeWidth="1.5"
        />
      ))}

      {/* Iride luminosa */}
      <circle cx="200" cy="200" r="86" fill="url(#wbe-iris)" />

      {/* Pupilla */}
      <circle cx="200" cy="200" r="30" fill="hsl(var(--background))" />
      <circle
        cx="200"
        cy="200"
        r="30"
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      {/* Riflesso */}
      <circle cx="186" cy="186" r="7" fill="hsl(var(--foreground))" opacity="0.55" />
    </svg>
  );
}
