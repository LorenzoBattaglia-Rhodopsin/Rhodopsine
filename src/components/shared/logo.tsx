import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";

/**
 * Logo Rhodopsin: marchio "iris" (SVG inline, scalabile, zero richieste di rete)
 * + wordmark. Decorativo: l'etichetta accessibile è fornita dal contenitore.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Sagoma dell'occhio */}
        <path
          d="M2 16C5.5 9 10.5 6 16 6s10.5 3 14 10c-3.5 7-8.5 10-14 10S5.5 23 2 16Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Iride */}
        <circle cx="16" cy="16" r="5.5" fill="hsl(var(--primary))" opacity="0.18" />
        <circle
          cx="16"
          cy="16"
          r="5.5"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        {/* Pupilla */}
        <circle cx="16" cy="16" r="1.8" fill="hsl(var(--foreground))" />
      </svg>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {siteConfig.shortName}
        </span>
      )}
    </span>
  );
}
