import Link from "next/link";
import { MapPin } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/data/site";
import { findCtaCopy, kindsSummary } from "@/data/nearby";

/**
 * SEZIONE "TROVA OTTICI E OCULISTI" (landing)
 * Invito sobrio alla pagina di ricerca, accessibile anche senza il test.
 * Tono informativo: nessuna promozione di strutture (CLAUDE.md §6.2).
 */
export function FindProfessionals() {
  return (
    <Section
      id="trova-professionisti"
      title={findCtaCopy.title}
      description={findCtaCopy.description}
    >
      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
        {kindsSummary}
      </p>
      <div className="mt-8">
        <Button asChild size="lg" variant="secondary">
          <Link href={routes.professionals}>
            <MapPin aria-hidden="true" />
            {findCtaCopy.cta}
          </Link>
        </Button>
      </div>
    </Section>
  );
}
