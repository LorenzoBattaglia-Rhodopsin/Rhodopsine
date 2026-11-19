import type { ResultLevel } from "@/types/assessment";

/**
 * SCORE GAUGE — Elemento distintivo dei risultati
 * --------------------------------------------------------------------------
 * Indicatore radiale a forma di "iride": un arco di progresso (0–100) attorno
 * a un motivo a iride coerente con il marchio. Il colore segue il livello
 * (basso = salvia, moderato = ambra, elevato = terracotta). Nessun rosso
 * d'allarme: l'obiettivo è informare con calma, non spaventare.
 *
 * È un componente di sola presentazione (Server Component), accessibile via
 * role="img" e un'etichetta testuale che riassume il punteggio.
 */

const LEVEL_COLOR: Record<ResultLevel, string> = {
  low: "var(--success)",
  medium: "var(--warning)",
  high: "var(--elevated)",
};

interface ScoreGaugeProps {
  /** Punteggio normalizzato 0–100. */
  score: number;
  level: ResultLevel;
  /** Etichetta del livello (es. "Moderato"), mostrata sotto il numero. */
  levelLabel: string;
}

export function ScoreGauge({ score, level, levelLabel }: ScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  const colorVar = LEVEL_COLOR[level];

  // Geometria dell'arco.
  const size = 240;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // Lasciamo un piccolo gap in basso per un arco "a ferro di cavallo".
  const arcFraction = 0.82;
  const arcLength = circumference * arcFraction;
  const progress = arcLength * (clamped / 100);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[240px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full"
        role="img"
        aria-label={`Punteggio di affaticamento visivo: ${clamped} su 100, livello ${levelLabel}.`}
      >
        <defs>
          <radialGradient id="gauge-iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`hsl(${colorVar})`} stopOpacity="0.22" />
            <stop offset="70%" stopColor={`hsl(${colorVar})`} stopOpacity="0.06" />
            <stop offset="100%" stopColor={`hsl(${colorVar})`} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Gruppo ruotato così che l'arco parta in basso a sinistra. */}
        <g transform={`rotate(${90 + (1 - arcFraction) * 180} ${size / 2} ${size / 2})`}>
          {/* Traccia di fondo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          {/* Arco di progresso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`hsl(${colorVar})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />
        </g>

        {/* Iride centrale (motivo del marchio). L'anello racchiude la lettura
            numerica: con un raggio piccolo finiva sotto la scritta "su 100". */}
        <circle cx={size / 2} cy={size / 2} r={radius - 26} fill="url(#gauge-iris)" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 30}
          fill="none"
          stroke={`hsl(${colorVar})`}
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
      </svg>

      {/* Lettura numerica al centro */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold tabular-nums text-foreground">
          {clamped}
        </span>
        <span className="text-sm text-muted-foreground">su 100</span>
        <span
          className="mt-1 text-eyebrow font-medium uppercase"
          style={{ color: `hsl(${colorVar})` }}
        >
          {levelLabel}
        </span>
      </div>
    </div>
  );
}
