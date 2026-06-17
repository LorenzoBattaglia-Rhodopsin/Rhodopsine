import type {
  AssessmentDomain,
  Recommendation,
  ResultLevel,
} from "@/types/assessment";

/**
 * CONSIGLI PRATICI (basati sulla letteratura su DES/CVS)
 * --------------------------------------------------------------------------
 * Suggerimenti generali di igiene visiva. Sono raccomandazioni educative,
 * non prescrizioni mediche. Ogni consiglio dichiara il dominio principale e
 * i livelli per cui è pertinente.
 */
export const recommendations: Recommendation[] = [
  {
    id: "rule-20-20-20",
    title: "Applica la regola 20-20-20",
    description:
      "Ogni 20 minuti distogli lo sguardo dallo schermo e guarda per circa 20 secondi un oggetto distante circa 6 metri. Aiuta a rilassare la muscolatura oculare e a riposare la messa a fuoco.",
    domain: "breaks",
    levels: ["low", "medium", "high"],
  },
  {
    id: "blink-consciously",
    title: "Ricorda di ammiccare",
    description:
      "Davanti agli schermi tendiamo a sbattere le palpebre molto meno. Ammiccare con regolarità, e in modo completo, aiuta a distribuire il film lacrimale e a contrastare la sensazione di secchezza.",
    domain: "breaks",
    levels: ["medium", "high"],
  },
  {
    id: "screen-distance",
    title: "Sistema la distanza dello schermo",
    description:
      "Tieni il monitor a circa 50–70 cm dagli occhi, con la parte alta dello schermo all'altezza degli occhi o leggermente sotto. Per lo smartphone, evita di avvicinarlo troppo: mantieni una distanza confortevole.",
    domain: "ergonomics",
    levels: ["low", "medium", "high"],
  },
  {
    id: "posture-neck",
    title: "Cura la postura di collo e spalle",
    description:
      "Una postazione ergonomica, con schermo e sedia ben regolati, riduce la tensione muscolare che spesso accompagna l'affaticamento visivo. Alterna la posizione e fai brevi pause di movimento.",
    domain: "ergonomics",
    levels: ["medium", "high"],
  },
  {
    id: "reduce-glare",
    title: "Riduci riflessi e bagliori",
    description:
      "Posiziona lo schermo in modo da evitare riflessi da finestre e luci. Una luce ambientale diffusa e uniforme è preferibile a fonti dirette o a contrasti troppo netti con lo schermo.",
    domain: "environment",
    levels: ["low", "medium", "high"],
  },
  {
    id: "balance-brightness",
    title: "Bilancia la luminosità",
    description:
      "Regola la luminosità dello schermo in modo che sia simile a quella dell'ambiente circostante. Differenze eccessive costringono gli occhi a continui riadattamenti.",
    domain: "environment",
    levels: ["medium", "high"],
  },
  {
    id: "manage-exposure",
    title: "Gestisci il tempo davanti agli schermi",
    description:
      "Quando possibile, riduci le sessioni continuative e inserisci attività che non richiedano fissazione ravvicinata. Brevi interruzioni frequenti sono più efficaci di una sola pausa lunga.",
    domain: "exposure",
    levels: ["medium", "high"],
  },
  {
    id: "eye-hydration",
    title: "Sostieni l'idratazione oculare",
    description:
      "Bevi a sufficienza e mantieni l'ambiente non troppo secco. In caso di secchezza persistente, valuta con un professionista l'uso di lacrime artificiali; evita il fai-da-te se i sintomi sono marcati.",
    domain: "symptoms",
    levels: ["high"],
  },
  {
    id: "evening-screens",
    title: "Limita gli schermi prima di dormire",
    description:
      "Nell'ora che precede il sonno, riduci l'uso di schermi luminosi e attiva eventuali modalità a luce più calda. Un buon riposo contribuisce anche al benessere degli occhi.",
    domain: "sleep",
    levels: ["low", "medium", "high"],
  },
  {
    id: "professional-check",
    title: "Pianifica un controllo della vista",
    description:
      "Un controllo periodico da un professionista della visione permette di verificare la correzione ottica e di escludere altre cause. È particolarmente utile se i sintomi sono frequenti o intensi.",
    domain: "symptoms",
    levels: ["high"],
  },
];

/**
 * Seleziona i consigli pertinenti per un livello, mettendo in cima quelli
 * legati al dominio più critico dell'utente (personalizzazione leggera).
 *
 * @param level   Livello di esito.
 * @param topDomain Dominio più critico (opzionale), per dare priorità.
 */
export function getRecommendations(
  level: ResultLevel,
  topDomain?: AssessmentDomain,
): Recommendation[] {
  const relevant = recommendations.filter((r) => r.levels.includes(level));

  if (!topDomain) return relevant;

  // Ordina: prima i consigli del dominio critico, poi gli altri (stabile).
  return [...relevant].sort((a, b) => {
    const aMatch = a.domain === topDomain ? 0 : 1;
    const bMatch = b.domain === topDomain ? 0 : 1;
    return aMatch - bMatch;
  });
}
