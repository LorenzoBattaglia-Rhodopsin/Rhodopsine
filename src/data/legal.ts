import { routes, siteConfig } from "@/data/site";

/**
 * CONTENUTI DELLE PAGINE LEGALI
 * --------------------------------------------------------------------------
 * Testi di privacy policy, cookie policy, note legali e disclaimer. Le pagine
 * in `src/app/<rotta>/page.tsx` si limitano a passare il documento a
 * `<LegalPage>`.
 *
 * ⚠️ I valori tra parentesi quadre (es. [NOME_TITOLARE]) sono SEGNAPOSTO da
 * compilare prima della pubblicazione: non vanno inventati. Si trovano tutti
 * in `legalEntity` qui sotto, più eventuali durate di conservazione nei testi.
 *
 * Quando si modifica un testo, aggiornare `legalLastUpdated`.
 * Testi informativi, non consulenza legale: prevedere una revisione legale.
 */

/** Data dell'ultimo aggiornamento dei testi legali (ISO, AAAA-MM-GG). */
export const legalLastUpdated = "2026-11-19";

/** Dati del titolare del trattamento / gestore del sito. */
export const legalEntity = {
  name: "[NOME_TITOLARE]",
  taxId: "[CODICE_FISCALE_O_PARTITA_IVA]",
  address: "[INDIRIZZO_COMPLETO]",
  email: siteConfig.contact.email,
} as const;

/** Blocco di testo: paragrafo o elenco puntato. */
export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: readonly string[] };

export interface LegalSection {
  /** Ancora stabile per l'indice (es. "titolare"). */
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
}

export interface LegalDocument {
  path: string;
  /** Titolo breve (link nel footer, title SEO). */
  title: string;
  /** Titolo H1 della pagina. */
  heading: string;
  description: string;
  intro: string;
  sections: readonly LegalSection[];
}

const p = (text: string): LegalBlock => ({ type: "p", text });
const ul = (...items: string[]): LegalBlock => ({ type: "ul", items });

const titolareText = `${legalEntity.name}, ${legalEntity.address}, codice fiscale/P.IVA ${legalEntity.taxId}. Email: ${legalEntity.email}.`;

/* ------------------------------------------------------------------------ */
/* PRIVACY POLICY                                                            */
/* ------------------------------------------------------------------------ */

export const privacyPolicy: LegalDocument = {
  path: routes.privacy,
  title: "Privacy policy",
  heading: "Informativa sulla privacy",
  description: `Come ${siteConfig.name} tratta i dati personali di chi visita il sito: quali dati, per quali finalità, per quanto tempo e quali sono i tuoi diritti (GDPR).`,
  intro: `Questa informativa spiega quali dati personali vengono trattati quando visiti ${siteConfig.url.replace(/^https?:\/\//, "")}, ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 ("GDPR"). Il sito non richiede registrazione e non ti chiede di inserire dati che ti identificano.`,
  sections: [
    {
      id: "titolare",
      title: "Titolare del trattamento",
      blocks: [p(titolareText)],
    },
    {
      id: "dati-trattati",
      title: "Quali dati trattiamo",
      blocks: [
        p(
          "Dati di navigazione. Quando visiti il sito, i server dei fornitori che lo distribuiscono e lo proteggono registrano in modo automatico alcuni dati tecnici: indirizzo IP, data e ora della richiesta, indirizzo della pagina richiesta (compresi gli eventuali parametri), tipo di browser e sistema operativo, pagina di provenienza. Servono a far funzionare il sito e a proteggerlo da abusi e attacchi.",
        ),
        p(
          "Risposte al test di autovalutazione. Le risposte alle singole domande vengono elaborate nel tuo browser e non sono inviate né salvate da noi. Per mostrarti l'esito, il punteggio complessivo (da 0 a 100) e l'area più critica vengono inseriti nell'indirizzo della pagina dei risultati (per esempio /risultati?s=50&d=breaks). Come ogni indirizzo visitato, può quindi comparire nei log tecnici descritti sopra, insieme all'indirizzo IP. Non usiamo questi dati per identificarti, né per profilarti, né per altri scopi.",
        ),
        p(
          "Timer 20-20-20. Lo stato e le preferenze del timer vengono salvati solo sul tuo dispositivo (archiviazione locale del browser) e non ci vengono trasmessi. Se attivi le notifiche, il permesso è gestito dal tuo browser.",
        ),
        p(
          "Statistiche di visita. Usiamo Cloudflare Web Analytics per conoscere in forma aggregata quante visite riceve il sito e quali pagine sono più lette. Secondo quanto dichiarato da Cloudflare, il servizio non usa cookie, non crea profili e non utilizza l'indirizzo IP per tracciare i visitatori.",
        ),
        p(
          "Dati che ci invii volontariamente. Se ci scrivi via email, trattiamo il tuo indirizzo email e il contenuto del messaggio. Ti chiediamo di non inviarci informazioni sulla tua salute: il canale di contatto è editoriale, non clinico.",
        ),
      ],
    },
    {
      id: "finalita",
      title: "Finalità e basi giuridiche",
      blocks: [
        ul(
          "Erogazione del sito e sicurezza (dati di navigazione): legittimo interesse del titolare a rendere disponibile il sito e a proteggerlo (art. 6, par. 1, lett. f GDPR).",
          "Statistiche aggregate di visita: legittimo interesse a capire quali contenuti sono utili, con dati aggregati e senza cookie (art. 6, par. 1, lett. f GDPR).",
          "Risposta alle tue richieste via email: esecuzione di misure adottate su tua richiesta (art. 6, par. 1, lett. b GDPR).",
          "Adempimento di obblighi di legge, se presenti (art. 6, par. 1, lett. c GDPR).",
        ),
        p(
          "Non effettuiamo profilazione, né decisioni basate unicamente su trattamenti automatizzati, né attività di marketing.",
        ),
      ],
    },
    {
      id: "fornitori",
      title: "A chi vengono comunicati i dati",
      blocks: [
        p(
          "I dati sono trattati da fornitori che agiscono come responsabili del trattamento per conto del titolare:",
        ),
        ul(
          "Cloudflare, Inc. (Stati Uniti): rete di distribuzione dei contenuti (CDN), protezione da attacchi e statistiche aggregate (Cloudflare Web Analytics).",
          "Netlify, Inc. (Stati Uniti): hosting del sito.",
          "Google LLC / Google Ireland Ltd: servizio di posta elettronica usato per la casella di contatto.",
        ),
        p(
          "Alcuni di questi fornitori possono trattare dati negli Stati Uniti. Il trasferimento avviene sulla base delle garanzie previste dagli articoli 45 e 46 del GDPR: la decisione di adeguatezza EU-US Data Privacy Framework, per i fornitori che vi aderiscono, oppure le clausole contrattuali standard approvate dalla Commissione europea.",
        ),
        p("I dati non vengono venduti né ceduti a terzi per finalità proprie."),
      ],
    },
    {
      id: "conservazione",
      title: "Per quanto tempo conserviamo i dati",
      blocks: [
        ul(
          "Dati di navigazione: per il periodo previsto dai fornitori di CDN e hosting per finalità tecniche e di sicurezza, secondo le rispettive informative.",
          "Statistiche: solo in forma aggregata, che non permette di identificarti.",
          "Email: per il tempo necessario a gestire la tua richiesta e comunque non oltre [DURATA_CONSERVAZIONE_EMAIL], salvo obblighi di legge.",
          "Dati del timer nel browser: finché non li cancelli tu, svuotando i dati del sito dal browser.",
        ),
      ],
    },
    {
      id: "diritti",
      title: "I tuoi diritti",
      blocks: [
        p(
          "In ogni momento puoi chiedere al titolare l'accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento e la portabilità, e puoi opporti ai trattamenti basati sul legittimo interesse (articoli da 15 a 22 GDPR).",
        ),
        p(
          `Per esercitare i tuoi diritti scrivi a ${legalEntity.email}. Rispondiamo entro un mese dalla richiesta.`,
        ),
        p(
          "Se ritieni che il trattamento violi il GDPR, puoi proporre reclamo al Garante per la protezione dei dati personali (https://www.garanteprivacy.it) o all'autorità di controllo del Paese in cui risiedi o lavori.",
        ),
      ],
    },
    {
      id: "minori",
      title: "Minori",
      blocks: [
        p(
          "Il sito ha finalità educative e si rivolge a un pubblico generale. Non raccogliamo consapevolmente dati di minori di 14 anni: se sei un genitore e ritieni che tuo figlio ci abbia scritto, contattaci e cancelleremo i dati.",
        ),
      ],
    },
    {
      id: "modifiche",
      title: "Modifiche a questa informativa",
      blocks: [
        p(
          "Possiamo aggiornare questa informativa, per esempio se cambiano i servizi usati dal sito. La data dell'ultimo aggiornamento è indicata in cima alla pagina.",
        ),
      ],
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* COOKIE POLICY                                                             */
/* ------------------------------------------------------------------------ */

export const cookiePolicy: LegalDocument = {
  path: routes.cookiePolicy,
  title: "Cookie policy",
  heading: "Cookie policy",
  description: `${siteConfig.name} non usa cookie di profilazione né di marketing: solo strumenti tecnici necessari al funzionamento e alla sicurezza del sito.`,
  intro:
    "I cookie sono piccoli file che un sito salva nel browser. Strumenti simili sono l'archiviazione locale del browser (localStorage). Questa pagina spiega quali usa il sito e perché non trovi un banner per il consenso.",
  sections: [
    {
      id: "in-breve",
      title: "In breve",
      blocks: [
        ul(
          "Nessun cookie di profilazione, di marketing o pubblicitario.",
          "Nessun cookie installato dal codice del sito.",
          "Statistiche di visita senza cookie (Cloudflare Web Analytics).",
          "Possibili cookie tecnici di sicurezza impostati da Cloudflare.",
          "Archiviazione locale del browser solo per il timer 20-20-20.",
        ),
      ],
    },
    {
      id: "cookie-tecnici",
      title: "Cookie tecnici di sicurezza (Cloudflare)",
      blocks: [
        p(
          "Il sito è protetto da Cloudflare. Per distinguere i visitatori reali dal traffico automatizzato, Cloudflare può impostare questi cookie tecnici:",
        ),
        ul(
          "__cf_bm: gestione del traffico automatizzato (bot). Dura circa 30 minuti.",
          "cf_clearance: ricorda che hai superato una verifica di sicurezza, quando viene mostrata. Dura di norma alcuni minuti o ore, secondo la configurazione.",
        ),
        p(
          "Sono strettamente necessari alla sicurezza del sito e non servono a profilarti. Per questo non richiedono il consenso.",
        ),
      ],
    },
    {
      id: "archiviazione-locale",
      title: "Archiviazione locale del browser",
      blocks: [
        p(
          "Il timer 20-20-20 salva il proprio stato e le tue preferenze nell'archiviazione locale del browser, alla voce wbe_timer_v1, così ritrovi il timer come l'avevi lasciato. Il dato resta sul tuo dispositivo, non viene inviato a nessuno e serve solo alla funzione che hai scelto di usare.",
        ),
        p(
          "Se attivi le notifiche del timer, il browser ti chiede un permesso, che puoi revocare in qualsiasi momento dalle impostazioni del browser.",
        ),
      ],
    },
    {
      id: "statistiche",
      title: "Statistiche di visita",
      blocks: [
        p(
          "Usiamo Cloudflare Web Analytics, che misura le visite in forma aggregata senza installare cookie e senza creare profili. Non usiamo Google Analytics né altri strumenti di tracciamento.",
        ),
      ],
    },
    {
      id: "terze-parti",
      title: "Contenuti di terze parti",
      blocks: [
        p(
          "Il sito non incorpora video, mappe, pulsanti social o altri contenuti esterni che installano cookie. I caratteri tipografici sono ospitati sul sito stesso, senza richieste a servizi esterni. I link verso altri siti (per esempio le fonti scientifiche) portano a pagine con proprie policy.",
        ),
      ],
    },
    {
      id: "banner",
      title: "Perché non c'è il banner dei cookie",
      blocks: [
        p(
          "Le Linee guida del Garante per la protezione dei dati personali sui cookie e altri strumenti di tracciamento (10 giugno 2021) prevedono che il consenso, e quindi il banner, serva solo per cookie e strumenti non tecnici. Il sito usa esclusivamente strumenti tecnici e statistiche senza cookie, quindi il consenso non è necessario. Questa pagina fornisce comunque l'informativa prevista.",
        ),
      ],
    },
    {
      id: "gestione",
      title: "Come gestire cookie e dati del sito",
      blocks: [
        p(
          "Puoi cancellare o bloccare i cookie e i dati salvati dal sito dalle impostazioni del browser (di solito nella sezione privacy o dati dei siti). Se blocchi i cookie tecnici di Cloudflare, alcune verifiche di sicurezza potrebbero ripetersi.",
        ),
        p(
          `Per qualsiasi domanda scrivi a ${legalEntity.email}. Per il trattamento dei dati personali vedi anche la privacy policy.`,
        ),
      ],
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* NOTE LEGALI                                                               */
/* ------------------------------------------------------------------------ */

export const legalNotes: LegalDocument = {
  path: routes.legalNotes,
  title: "Note legali",
  heading: "Note legali",
  description: `Informazioni sul gestore di ${siteConfig.name}, proprietà intellettuale dei contenuti, link esterni e limitazioni di responsabilità.`,
  intro: `Le presenti note regolano l'uso del sito ${siteConfig.name}. Navigando sul sito accetti queste condizioni.`,
  sections: [
    {
      id: "gestore",
      title: "Gestore del sito",
      blocks: [p(titolareText)],
    },
    {
      id: "natura",
      title: "Natura del sito",
      blocks: [
        p(
          `${siteConfig.name} è un progetto educativo sul benessere visivo digitale. Non è una testata giornalistica: è aggiornato senza una periodicità prestabilita e non costituisce prodotto editoriale ai sensi della legge 7 marzo 2001, n. 62.`,
        ),
        p(
          "Il sito non offre servizi sanitari, non vende prodotti e non pubblica pubblicità. Per i limiti dei contenuti informativi vedi il disclaimer.",
        ),
      ],
    },
    {
      id: "proprieta-intellettuale",
      title: "Proprietà intellettuale",
      blocks: [
        p(
          `Testi, grafica, logo, nome "${siteConfig.name}" e codice del sito sono protetti dalle norme sul diritto d'autore e sui segni distintivi. Tutti i diritti sono riservati: senza autorizzazione scritta non è consentito copiarli, modificarli, distribuirli o riutilizzarli, in tutto o in parte.`,
        ),
        p(
          `È consentito citare brevi estratti con indicazione della fonte e link alla pagina originale. Per altre richieste scrivi a ${legalEntity.email}.`,
        ),
      ],
    },
    {
      id: "link-esterni",
      title: "Link a siti esterni",
      blocks: [
        p(
          "Il sito contiene link a fonti esterne (articoli scientifici, enti ufficiali) per permetterti di approfondire. Non controlliamo questi siti e non siamo responsabili dei loro contenuti, della loro disponibilità o delle loro policy sulla privacy.",
        ),
      ],
    },
    {
      id: "responsabilita",
      title: "Limitazione di responsabilità",
      blocks: [
        p(
          "Curiamo i contenuti con attenzione e li basiamo su fonti verificabili, ma non possiamo garantire che siano sempre completi e aggiornati. Il gestore non risponde di danni derivanti dall'uso del sito o dall'affidamento sui suoi contenuti, nei limiti consentiti dalla legge.",
        ),
        p(
          "Il sito può essere temporaneamente non disponibile per manutenzione o per cause tecniche non dipendenti dal gestore.",
        ),
      ],
    },
    {
      id: "legge",
      title: "Legge applicabile",
      blocks: [
        p(
          "Queste note sono regolate dalla legge italiana. Restano salvi i diritti riconosciuti ai consumatori dalla normativa applicabile.",
        ),
      ],
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* DISCLAIMER                                                                */
/* ------------------------------------------------------------------------ */

export const disclaimer: LegalDocument = {
  path: routes.disclaimer,
  title: "Disclaimer",
  heading: "Disclaimer",
  description: `I contenuti e il test di ${siteConfig.name} hanno finalità informative ed educative: non forniscono diagnosi e non sostituiscono la visita di un professionista della visione.`,
  intro: `${siteConfig.name} offre contenuti e strumenti di educazione al benessere visivo. Leggi con attenzione cosa possono e cosa non possono fare.`,
  sections: [
    {
      id: "finalita-informative",
      title: "Contenuti informativi ed educativi",
      blocks: [
        p(
          "Articoli, consigli, test di autovalutazione e timer hanno esclusivamente finalità informative, educative e preventive. Non costituiscono una diagnosi, un parere clinico, una prescrizione o un trattamento.",
        ),
      ],
    },
    {
      id: "test",
      title: "Il test di autovalutazione",
      blocks: [
        p(
          "Il test serve a riflettere sulle tue abitudini visive digitali. Non è uno strumento diagnostico né un dispositivo medico. L'esito (basso, moderato o elevato) descrive le risposte che hai dato, non lo stato di salute dei tuoi occhi.",
        ),
        p(
          "Un esito basso non esclude la presenza di disturbi; un esito elevato non indica una patologia. In entrambi i casi, se hai dubbi o sintomi, il riferimento è un professionista.",
        ),
      ],
    },
    {
      id: "professionisti",
      title: "A chi rivolgersi",
      blocks: [
        ul(
          "Per sintomi, sospette patologie o una diagnosi: il medico oculista, l'unica figura che può fare diagnosi.",
          "Per un controllo della vista o degli occhiali: l'ottico-optometrista, che non effettua diagnosi.",
        ),
        p(
          "Non interrompere né modificare cure o indicazioni ricevute da un professionista sulla base dei contenuti di questo sito.",
        ),
      ],
    },
    {
      id: "urgenze",
      title: "Urgenze",
      blocks: [
        p(
          "In caso di disturbi improvvisi della vista (per esempio perdita della visione, dolore oculare acuto, lampi di luce o una tenda nel campo visivo) contatta subito un medico o il numero di emergenza 112. Il sito e la casella email non sono un canale per urgenze.",
        ),
      ],
    },
    {
      id: "fonti",
      title: "Fonti e aggiornamento",
      blocks: [
        p(
          "I contenuti si basano sulla letteratura scientifica e su fonti ufficiali, elencate nella pagina Fonti. La ricerca evolve: alcune informazioni potrebbero non riflettere gli studi più recenti. Se trovi un errore, segnalacelo e lo verificheremo.",
        ),
      ],
    },
    {
      id: "nessun-rapporto",
      title: "Nessun rapporto professionale",
      blocks: [
        p(
          "L'uso del sito, del test o della casella email non instaura alcun rapporto medico-paziente o professionale. Il sito non promuove professionisti, strutture, prodotti o marchi.",
        ),
      ],
    },
  ],
};

/** Tutti i documenti legali, nell'ordine dei link nel footer. */
export const legalDocuments: readonly LegalDocument[] = [
  privacyPolicy,
  cookiePolicy,
  legalNotes,
  disclaimer,
];
