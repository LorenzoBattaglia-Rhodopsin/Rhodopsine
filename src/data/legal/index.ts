/**
 * DOCUMENTI LEGALI — punto di accesso unico
 * --------------------------------------------------------------------------
 * Riesporta i tre documenti e offre helper condivisi (es. data dell'ultimo
 * aggiornamento complessivo, mostrata nel footer).
 */

import { cookiePolicy } from "./cookie-policy";
import { privacyPolicy } from "./privacy-policy";
import { termini } from "./termini";
import type { LegalDocument } from "./types";

export { privacyPolicy } from "./privacy-policy";
export { cookiePolicy } from "./cookie-policy";
export { termini } from "./termini";
export { formatLegalDate } from "./types";
export type { LegalDocument, LegalSection } from "./types";

/** Tutti i documenti legali pubblicati. */
export const legalDocuments: readonly LegalDocument[] = [
  privacyPolicy,
  cookiePolicy,
  termini,
];

/** Data ISO dell'aggiornamento più recente tra i documenti legali. */
export function latestLegalUpdate(): string {
  return legalDocuments
    .map((doc) => doc.updatedAt)
    .sort()
    .at(-1) as string;
}
