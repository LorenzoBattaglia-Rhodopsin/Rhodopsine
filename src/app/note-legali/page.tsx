import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { legalNotes } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

/** NOTE LEGALI — contenuti in `@/data/legal`. */
export const metadata: Metadata = buildMetadata({
  title: legalNotes.title,
  description: legalNotes.description,
  path: legalNotes.path,
});

export default function LegalNotesPage() {
  return <LegalPage document={legalNotes} />;
}
