/**
 * ORARI DI APERTURA — sola traduzione del formato OSM, mai interpretazione
 * --------------------------------------------------------------------------
 * Il tag `opening_hours` ha una sintassi propria ("Mo-Fr 09:00-12:30,15:30-19:30;
 * Sa 09:00-12:30"). Qui ci limitiamo a:
 * - separare le regole (";") su righe diverse;
 * - tradurre in italiano abbreviazioni dei giorni e poche parole chiave.
 * Non calcoliamo "aperto ora" né completiamo orari mancanti: il testo resta
 * fedele alla fonte.
 */
const TOKENS: Record<string, string> = {
  Mo: "Lun",
  Tu: "Mar",
  We: "Mer",
  Th: "Gio",
  Fr: "Ven",
  Sa: "Sab",
  Su: "Dom",
  PH: "Festivi",
  SH: "Vacanze scolastiche",
  off: "chiuso",
  closed: "chiuso",
};

const TOKEN_RE = new RegExp(`\\b(${Object.keys(TOKENS).join("|")})\\b`, "g");

export function formatOpeningHours(raw: string): string[] {
  if (raw.trim() === "24/7") return ["Sempre aperto (24 ore su 24, 7 giorni su 7)"];
  return raw
    .split(";")
    .map((rule) =>
      rule
        .trim()
        .replace(TOKEN_RE, (t) => TOKENS[t] ?? t)
        .replace(/,(?=\S)/g, ", "),
    )
    .filter(Boolean)
    .slice(0, 12);
}
