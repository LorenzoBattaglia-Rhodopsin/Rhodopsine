import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAllSources, type SourceKind } from "@/data/sources";

/**
 * SOURCES LIST — Elenco delle fonti scientifiche (Server Component).
 * Puramente presentazionale: legge i dati da `@/data/sources` e li mostra come
 * lista ordinata di referenze, con tipografia sobria (dettagli in
 * `text-muted-foreground`). I link sono esterni e si aprono in nuova scheda.
 */

// Mappa la natura della fonte alla variante semantica del Badge.
const kindVariant: Record<SourceKind, "primary" | "success" | "neutral"> = {
  Studio: "primary",
  "Linea guida": "success",
  "Ente ufficiale": "neutral",
};

export function SourcesList() {
  const sources = getAllSources();

  return (
    <ol className="mx-auto max-w-3xl space-y-4">
      {sources.map((source) => (
        <li key={source.id}>
          <article className="rounded-lg border border-border bg-card/60 p-5 sm:p-6">
            <Badge variant={kindVariant[source.kind]} className="tracking-wide">
              {source.kind}
            </Badge>

            <h2 className="mt-3 text-base font-semibold leading-snug text-foreground">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-start gap-1.5 rounded transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="text-pretty">{source.title}</span>
                <ExternalLink
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
                <span className="sr-only">(si apre in una nuova scheda)</span>
              </a>
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {source.authors} · {source.publication} · {source.year}
            </p>
          </article>
        </li>
      ))}
    </ol>
  );
}
