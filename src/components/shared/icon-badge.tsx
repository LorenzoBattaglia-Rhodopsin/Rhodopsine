import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Icona in un cerchio tinto di teal (colore d'accento del sistema).
 * Come le icone "tinted" delle feature card Apple: il colore dà identità e
 * gerarchia all'iconografia, senza suggerire che l'elemento sia cliccabile.
 * Fonte unica per tutte le card con icona (landing, risultati).
 */
export function IconBadge({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary ring-1 ring-inset ring-primary/30",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}
