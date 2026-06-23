/**
 * CONTENUTI — Articoli educativi
 * --------------------------------------------------------------------------
 * Unica fonte di verità per gli articoli sul benessere visivo digitale.
 * I componenti (lista e dettaglio) leggono SOLO da qui: nessun testo di
 * dominio è hard-coded nella UI.
 *
 * Vincolo del progetto: contenuti educativi e preventivi, MAI diagnostici.
 * Niente promesse mediche, niente allarmismo (vedi CLAUDE.md §6).
 *
 * Per ora gli articoli sono segnaposto pronti all'espansione: aggiungere un
 * oggetto all'array `articles` crea automaticamente la card in /articoli e la
 * pagina statica /articoli/<slug> (vedi `generateStaticParams`).
 */

export type Article = {
  /** Identificatore stabile e univoco, usato nell'URL e come React key. */
  slug: string;
  title: string;
  /** Sommario breve per card, metadati SEO e Open Graph. */
  description: string;
  /** Etichetta tematica (es. "Metodo", "Prevenzione", "Approfondimenti"). */
  category: string;
  /** Data di pubblicazione in formato ISO (YYYY-MM-DD). */
  publishedAt: string;
  /** Tempo di lettura stimato, già formattato (es. "4 min"). */
  readingTime: string;
  /** Corpo dell'articolo come elenco di paragrafi (segnaposto, espandibile). */
  content: string[];
};

export const articles: Article[] = [
  {
    slug: "regola-20-20-20-funziona-davvero",
    title: "Regola 20-20-20: funziona davvero?",
    description:
      "Cosa dice la pratica clinica sulla regola del 20-20-20 e perché fare pause regolari aiuta a ridurre l'affaticamento visivo da schermo.",
    category: "Metodo",
    publishedAt: "2026-05-28",
    readingTime: "4 min",
    content: [
      "La regola 20-20-20 è un promemoria semplice: ogni 20 minuti, sposta lo sguardo su un punto distante almeno 6 metri (circa 20 piedi) per 20 secondi. L'idea è dare ai muscoli che mettono a fuoco da vicino una breve, regolare occasione di rilassarsi.",
      "Fissare uno schermo a distanza ravvicinata per lungo tempo tende anche a ridurre la frequenza con cui ammicchiamo. Le micro-pause aiutano a ripristinare un ammiccamento più naturale e a percepire meno secchezza e tensione a fine giornata.",
      "Non è una cura né una diagnosi: è un'abitudine preventiva, facile da adottare e senza controindicazioni. Vale la pena provarla per qualche giorno e osservare come si sentono i tuoi occhi.",
      "Se i disturbi visivi sono frequenti, intensi o persistenti, la regola 20-20-20 non basta: rivolgiti a un oculista per una valutazione professionale.",
    ],
  },
  {
    slug: "affaticamento-visivo-sintomi-prevenzione",
    title: "Affaticamento visivo da schermo: sintomi e prevenzione",
    description:
      "Quali sono i segnali più comuni dell'affaticamento visivo digitale e quali abitudini, ergonomia e ambiente possono aiutarti a prevenirlo.",
    category: "Prevenzione",
    publishedAt: "2026-05-14",
    readingTime: "5 min",
    content: [
      "L'affaticamento visivo digitale (o computer vision syndrome) raccoglie un insieme di disturbi temporanei legati all'uso prolungato di schermi: occhi stanchi o secchi, visione momentaneamente offuscata, fastidio alla luce, talvolta mal di testa o tensione al collo.",
      "Sono segnali di sovraccarico, non di malattia: di solito migliorano con pause, idratazione e una postazione più confortevole. Conoscerli aiuta ad ascoltare i propri occhi prima che la giornata diventi pesante.",
      "Sul fronte della prevenzione contano soprattutto le pause regolari (come la regola 20-20-20), una distanza adeguata dallo schermo, un'illuminazione senza riflessi e un'umidità dell'aria non troppo bassa.",
      "Questo contenuto è informativo e non sostituisce il parere di un professionista. Se i sintomi sono persistenti o ti preoccupano, parlane con un oculista o un optometrista.",
    ],
  },
  {
    slug: "luce-blu-miti-e-realta",
    title: "Luce blu: miti e realtà",
    description:
      "Cosa sappiamo davvero sulla luce blu degli schermi, tra timori diffusi ed evidenze: dall'affaticamento visivo al ritmo sonno-veglia.",
    category: "Approfondimenti",
    publishedAt: "2026-04-30",
    readingTime: "6 min",
    content: [
      "La luce blu è una componente naturale della luce visibile: la riceviamo in grande quantità dal sole, e in misura molto minore da schermi e illuminazione a LED. Attorno ad essa sono cresciuti diversi miti, non tutti supportati dalle evidenze.",
      "Il timore più diffuso è che la luce blu degli schermi danneggi la retina nell'uso quotidiano: le quantità in gioco sono molto inferiori a quelle dell'esposizione solare. L'affaticamento davanti allo schermo dipende più dalle ore di utilizzo, dalla distanza e dalle poche pause che dalla sola luce blu.",
      "Un effetto più documentato riguarda invece il ritmo sonno-veglia: luce intensa nelle ore serali può ostacolare l'addormentamento. Ridurre la luminosità e limitare gli schermi prima di dormire è un'abitudine ragionevole.",
      "In sintesi: niente allarmismi, ma buon senso. Per dubbi su filtri, occhiali o lenti dedicate, chiedi a un professionista della visione; per un controllo della vista o degli occhiali, l'ottico-optometrista è la figura di riferimento.",
    ],
  },
];

/** Tutti gli articoli, dal più recente al più vecchio. */
export function getAllArticles(): Article[] {
  return [...articles].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

/** Recupera un articolo dallo slug (undefined se non esiste). */
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

// Formatter costruito una sola volta (non ad ogni card): l'inizializzazione di
// Intl.DateTimeFormat non è gratuita.
const articleDateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Data in formato leggibile italiano (es. "28 maggio 2026"). */
export function formatArticleDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return articleDateFormatter.format(date);
}
