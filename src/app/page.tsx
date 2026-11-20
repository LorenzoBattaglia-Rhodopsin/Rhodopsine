import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { TwentyRule } from "@/components/landing/twenty-rule";
import { FindProfessionals } from "@/components/landing/find-professionals";
import { DisclaimerSection } from "@/components/landing/disclaimer-section";
import { buildMetadata } from "@/lib/seo";

/**
 * HOME / LANDING PAGE (Server Component)
 * --------------------------------------------------------------------------
 * Composizione di sezioni a responsabilità unica. La narrazione segue il
 * percorso: il problema (hero, unica CTA primaria) → come funziona →
 * benefici → regola 20-20-20 → trova ottici e oculisti → avvertenza.
 * Una sola CTA primaria per schermata: le altre sezioni usano CTA secondarie
 * (eccetto "Come funziona", che chiude il percorso verso il test).
 */
export const metadata: Metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <TwentyRule />
      <FindProfessionals />
      <DisclaimerSection />
    </>
  );
}
