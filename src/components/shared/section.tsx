import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Wrapper di sezione riutilizzabile: imposta il ritmo verticale e fornisce
 * un'intestazione coerente (titolo + sottotitolo opzionale).
 * Ogni sezione ha responsabilità unica: layout e intestazione.
 */
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Ancora per la navigazione interna (es. "benefici"). */
  id?: string;
  title?: string;
  description?: string;
  /** Allinea l'intestazione al centro (default: a sinistra). */
  centered?: boolean;
}

export function Section({
  id,
  title,
  description,
  centered = false,
  className,
  children,
  ...props
}: SectionProps) {
  const hasHeader = title || description;

  return (
    <section
      id={id}
      // scroll-mt compensa l'header sticky quando si naviga alle ancore.
      className={cn("scroll-mt-24 py-16 sm:py-24", className)}
      {...props}
    >
      <div className="container">
        {hasHeader && (
          <header
            className={cn(
              "mb-10 max-w-prose sm:mb-14",
              centered && "mx-auto text-center",
            )}
          >
            {title && (
              <h2 className="text-title text-balance font-semibold text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
