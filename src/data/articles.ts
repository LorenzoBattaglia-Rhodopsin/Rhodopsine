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
 * Aggiungere un oggetto all'array `articles` crea automaticamente la card in
 * /articoli e la pagina statica /articoli/<slug> (vedi `generateStaticParams`).
 * Le fonti citate si indicano con gli id di `@/data/sources`.
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
  /** Corpo dell'articolo come elenco di paragrafi. */
  content: string[];
  /** Id delle fonti citate (vedi `@/data/sources`), mostrate in fondo all'articolo. */
  sources: string[];
};

export const articles: Article[] = [
  {
    slug: "regola-20-20-20-funziona-davvero",
    title: "Regola 20-20-20: funziona davvero?",
    description:
      "Da dove viene la regola del 20-20-20, cosa dicono gli studi più recenti e perché le pause contano più dei numeri esatti.",
    category: "Metodo",
    publishedAt: "2026-11-19",
    readingTime: "4 min",
    content: [
      "La regola 20-20-20 dice questo: ogni 20 minuti passati davanti a uno schermo, guarda per 20 secondi qualcosa che si trova ad almeno 20 piedi di distanza, cioè circa 6 metri. È uno dei consigli più citati contro l'affaticamento visivo digitale, ed è raccomandata anche dall'American Academy of Ophthalmology e dall'American Optometric Association.",
      "Il ragionamento dietro è semplice. Quando guardiamo da vicino, il sistema visivo lavora per mettere a fuoco e far convergere gli occhi sullo stesso punto. Guardare lontano allenta per qualche secondo questo sforzo. In più, davanti allo schermo tendiamo ad ammiccare meno spesso e in modo meno completo, e una pausa aiuta a tornare a un ammiccamento più naturale.",
      "Sugli effetti, però, gli studi non sono tutti d'accordo. Nel 2023 un gruppo di ricerca spagnolo e britannico ha fornito a 29 persone con sintomi un software che ricordava le pause secondo la regola. Dopo due settimane i sintomi di affaticamento e di secchezza oculare erano diminuiti, ma il miglioramento non si manteneva una settimana dopo aver smesso di usare i promemoria. I segni misurabili, come la stabilità del film lacrimale, erano cambiati poco.",
      "Nello stesso anno un altro studio, condotto da Johnson e Rosenfield, ha messo alla prova le pause di 20 secondi durante la lettura e non ha trovato differenze nei sintomi. Gli autori hanno fatto notare che i numeri della regola non derivano da una misura sperimentale: sono stati scelti perché facili da ricordare. Hanno anche precisato che il loro risultato non significa che fare pause sia inutile.",
      "In pratica: la regola 20-20-20 è un buon promemoria, non una soglia magica. Quello che le ricerche sostengono in modo più costante è l'abitudine di interrompere spesso il lavoro da vicino. Se 20 secondi ti sembrano pochi, una pausa più lunga, in cui ti alzi e distogli lo sguardo dallo schermo, non fa male. L'importante è che le pause siano regolari: un promemoria, come il timer di questo sito, aiuta a non dimenticarle quando si è concentrati.",
      "Le pause non risolvono tutto. Se gli occhi restano stanchi nonostante le abitudini corrette, la causa può essere un difetto visivo non corretto o occhiali non adatti alla distanza dello schermo: in questo caso un controllo della vista da un ottico-optometrista è un buon punto di partenza. Se invece compaiono dolore, arrossamento che non passa o disturbi persistenti, la figura giusta è l'oculista.",
    ],
    sources: [
      "talens-estarelles-2023",
      "johnson-rosenfield-2023",
      "aao-computer-usage",
      "aoa-computer-vision-syndrome",
    ],
  },
  {
    slug: "affaticamento-visivo-sintomi-prevenzione",
    title: "Affaticamento visivo da schermo: sintomi e prevenzione",
    description:
      "I disturbi più comuni dell'affaticamento visivo digitale, perché compaiono e quali accorgimenti su pause, postazione e ambiente aiutano a ridurli.",
    category: "Prevenzione",
    publishedAt: "2026-11-19",
    readingTime: "5 min",
    content: [
      "Con affaticamento visivo digitale (in inglese digital eye strain, o computer vision syndrome) si indica un insieme di disturbi legati all'uso prolungato di computer, tablet e smartphone. È molto diffuso: secondo una revisione della letteratura pubblicata nel 2018, riguarda circa metà degli utenti abituali di dispositivi digitali, o anche di più a seconda degli studi.",
      "I sintomi più frequenti sono occhi stanchi, secchi o che bruciano, visione momentaneamente offuscata, difficoltà a rimettere a fuoco quando si distoglie lo sguardo, fastidio alla luce e mal di testa. Spesso si accompagnano a tensione al collo e alle spalle, dovuta alla postura. Nella maggior parte dei casi sono disturbi temporanei, che migliorano dopo una pausa o a fine giornata.",
      "Le cause sono diverse e spesso si sommano. Davanti allo schermo ammicchiamo meno e in modo meno completo, e la superficie dell'occhio si asciuga più in fretta. Il lavoro da vicino impegna a lungo la messa a fuoco e la convergenza. Pesano poi riflessi e contrasti sbagliati, una postazione scomoda e, molto spesso, piccoli difetti visivi non corretti o occhiali pensati per altre distanze.",
      "Le pause sono la prima cosa da sistemare: interrompere regolarmente il lavoro da vicino, guardando lontano per qualche secondo o alzandosi ogni tanto. Durante la pausa vale la pena ammiccare con calma qualche volta, in modo completo.",
      "Anche la postazione conta. L'American Optometric Association indica come riferimento uno schermo a circa 50-70 cm dagli occhi, con il centro leggermente più in basso dell'altezza degli occhi, così che lo sguardo sia rivolto un po' verso il basso. Lo smartphone, che di solito si tiene più vicino, è più impegnativo: aumentare la dimensione del testo aiuta a non avvicinarlo troppo.",
      "Poi c'è l'ambiente. Meglio evitare finestre o lampade che si riflettono sullo schermo e regolare la luminosità del monitor su quella della stanza: uno schermo molto più luminoso o molto più scuro di ciò che lo circonda affatica di più. L'aria molto secca o un getto d'aria diretto sul viso, per esempio da un condizionatore o da un ventilatore, possono peggiorare la secchezza.",
      "Infine, la vista va controllata. Un difetto anche lieve, o una presbiopia agli inizi, può bastare a rendere faticose le ore al computer. Un controllo dall'ottico-optometrista permette di capire se servono occhiali, o occhiali diversi, per la distanza a cui si lavora.",
      "Se i disturbi non migliorano nonostante questi accorgimenti, o se compaiono dolore oculare, arrossamento persistente, visione doppia o un calo della vista, è il momento di rivolgersi a un oculista. Un calo improvviso della vista richiede invece un controllo medico immediato.",
    ],
    sources: [
      "sheppard-wolffsohn-2018",
      "rosenfield-2011",
      "coles-brennan-2019",
      "aoa-computer-vision-syndrome",
      "aao-computer-usage",
    ],
  },
  {
    slug: "luce-blu-miti-e-realta",
    title: "Luce blu: miti e realtà",
    description:
      "La luce blu degli schermi danneggia gli occhi? Servono gli occhiali con filtro? Cosa dicono le evidenze su affaticamento visivo, retina e sonno.",
    category: "Approfondimenti",
    publishedAt: "2026-11-19",
    readingTime: "4 min",
    content: [
      "La luce blu è la parte dello spettro visibile con lunghezza d'onda più corta. La fonte principale è il sole: la quantità che arriva agli occhi da schermi e lampade a LED è molto più bassa di quella che riceviamo all'aperto in una giornata qualsiasi. Negli ultimi anni però è diventata il principale indiziato per la stanchezza degli occhi, e sono nati molti prodotti per filtrarla.",
      "Il primo timore è che la luce blu degli schermi danneggi la retina. Secondo l'American Academy of Ophthalmology non ci sono prove scientifiche che la luce blu dei dispositivi digitali danneggi gli occhi, e l'Accademia non raccomanda occhiali speciali con filtro per l'uso del computer.",
      "Il secondo è che i filtri riducano l'affaticamento visivo. Nel 2023 una revisione sistematica Cochrane ha analizzato 17 studi controllati sugli occhiali con filtro per la luce blu. Le conclusioni: rispetto a lenti normali, probabilmente non riducono l'affaticamento visivo legato al lavoro al computer, almeno nel breve periodo. Gli autori non ne raccomandano la prescrizione alla popolazione generale.",
      "C'è un motivo per cui i filtri non risolvono il problema: l'affaticamento visivo digitale dipende soprattutto da come usiamo gli schermi. Pesano le ore passate a guardare da vicino, le poche pause, l'ammiccamento ridotto, la postazione e la luce dell'ambiente. Sono questi i fattori su cui conviene intervenire.",
      "Dove la luce degli schermi ha un effetto documentato è il sonno. In uno studio del 2015 pubblicato su PNAS, leggere la sera su un tablet invece che su un libro stampato ha ritardato la produzione di melatonina, allungato i tempi per addormentarsi e reso più difficile il risveglio il giorno dopo. Lo studio era piccolo, 12 persone, ma il meccanismo è coerente con quello che si sa sul ruolo della luce nel ritmo sonno-veglia.",
      "In pratica: non serve preoccuparsi della luce blu per la salute degli occhi, ma ha senso ridurre gli schermi nell'ora prima di dormire o, se non è possibile, abbassarne la luminosità e attivare la modalità notturna. Per la stanchezza degli occhi durante il giorno sono più utili le pause e una postazione comoda. Se hai dubbi sugli occhiali più adatti a te, chiedi a un ottico-optometrista; per disturbi persistenti rivolgiti a un oculista.",
    ],
    sources: ["aao-blue-light", "singh-cochrane-2023", "chang-2015"],
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
