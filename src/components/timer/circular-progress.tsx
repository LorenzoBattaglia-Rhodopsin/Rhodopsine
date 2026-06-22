import * as React from "react";

interface CircularProgressProps {
  /** Percentuale 0–100. 100 = anello completo. */
  value: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  animated?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function CircularProgress({
  value,
  size = 220,
  strokeWidth = 8,
  trackColor = "hsl(var(--border))",
  progressColor = "hsl(var(--primary))",
  animated = true,
  children,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const dashOffset = circumference - (clamped / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
    >
      {/* SVG ruotato di -90° per far partire l'arco dall'alto */}
      <svg
        width={size}
        height={size}
        aria-hidden="true"
        style={{ transform: "rotate(-90deg)", display: "block" }}
      >
        {/* Traccia di sfondo */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Arco di progresso.
            La transizione è su classe CSS (non style inline) così
            prefers-reduced-motion: reduce la sovrascrive correttamente. */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={animated ? "timer-ring-animated" : undefined}
        />
      </svg>
      {/* Contenuto centrato sovrapposto al ring */}
      {children && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
