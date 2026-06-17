import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Benefits } from "@/components/landing/benefits";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DisclaimerSection } from "@/components/landing/disclaimer-section";
import { buildMetadata } from "@/lib/seo";

/**
 * HOME / LANDING PAGE (Server Component)
 * --------------------------------------------------------------------------
 * Composizione di sezioni a responsabilità unica. La narrazione segue il
 * percorso: tesi (hero) → problema → benefici → come funziona → avvertenza.
 */
export const metadata: Metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Benefits />
      <HowItWorks />
      <DisclaimerSection />
    </>
  );
}
