import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/data/site";

/**
 * PAGINA 404 (Server Component)
 * --------------------------------------------------------------------------
 * Senza questo file la 404 ereditava i metadata del layout, compreso il
 * canonical della home: un segnale SEO sbagliato. Qui la pagina è `noindex` e
 * senza canonical.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Pagina non trovata",
    description: "La pagina che cerchi non esiste o è stata spostata.",
    noIndex: true,
  }),
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-prose text-center">
          <p className="mb-3 text-eyebrow font-medium uppercase text-primary">
            Errore 404
          </p>
          <h1 className="text-title text-balance font-semibold text-foreground">
            Pagina non trovata
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            La pagina che cerchi non esiste o è stata spostata. Puoi tornare alla
            home oppure fare il test di autovalutazione.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={routes.home}>Torna alla home</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={routes.test}>
                Fai il test
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
