import Link from "next/link";
import { MapPin } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { ProfessionalKinds } from "@/components/nearby/professional-kinds";
import { routes } from "@/data/site";
import { findCtaCopy } from "@/data/nearby";

/**
 * SEZIONE "TROVA OTTICI E OCULISTI" (landing)
 * Subito dopo "Come funziona": è il secondo strumento del sito, accessibile
 * anche senza il test. Le due card (oculista vs ottico-optometrista, le stesse
 * di /risultati) aiutano a scegliere la figura giusta (CLAUDE.md §6.1); la CTA
 * è primaria perché in questa schermata non ce ne sono altre.
 * Tono informativo: nessuna promozione di strutture (CLAUDE.md §6.2).
 */
export function FindProfessionals() {
  return (
    <Section
      id="trova-professionisti"
      title={findCtaCopy.title}
      description={findCtaCopy.description}
    >
      <ProfessionalKinds />
      <div className="mt-10">
        <Button asChild size="lg">
          <Link href={routes.professionals}>
            <MapPin aria-hidden="true" />
            {findCtaCopy.cta}
          </Link>
        </Button>
      </div>
    </Section>
  );
}
