import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FindProfessionals } from "@/components/landing/find-professionals";
import { TwentyRule } from "@/components/landing/twenty-rule";
import { Benefits } from "@/components/landing/benefits";
import { DisclaimerSection } from "@/components/landing/disclaimer-section";
import { buildMetadata } from "@/lib/seo";

/**
 * HOME / LANDING PAGE (Server Component)
 * --------------------------------------------------------------------------
 * Composizione di sezioni a responsabilità unica. La narrazione segue il
 * percorso: il problema (hero, CTA al test) → come funziona → trova ottici
 * e oculisti (CTA primaria) → regola 20-20-20 → benefici → avvertenza.
 * Prima i tre strumenti (test, professionisti, timer), poi il "perché".
 * Una sola CTA primaria per schermata; il test è proposto una volta sola.
 */
export const metadata: Metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FindProfessionals />
      <TwentyRule />
      <Benefits />
      <DisclaimerSection />
    </>
  );
}
