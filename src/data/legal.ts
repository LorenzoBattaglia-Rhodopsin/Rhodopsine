import { routes, siteConfig } from "@/data/site";

/**
 * CONTENUTI DELLE PAGINE LEGALI
 * --------------------------------------------------------------------------
 * Testi di privacy policy, cookie policy, note legali e disclaimer. Le pagine
 * in `src/app/<rotta>/page.tsx` si limitano a passare il documento a
 * `<LegalPage>`.
 *
 * Il titolare è indicato come "Redazione di Rhodopsine", contattabile via
 * email: il sito è un progetto editoriale senza partita IVA. I dati del
 * titolare stanno tutti in `legalEntity` qui sotto.
 *
 * Quando si modifica un testo, aggiornare `legalLastUpdated`.
 * Testi informativi, non consulenza legale: prevedere una revisione legale.
 */

/** Data dell'ultimo aggiornamento dei testi legali (ISO, AAAA-MM-GG). */
export const legalLastUpdated = "2026-11-20";

/** Dati del titolare del trattamento / gestore del sito. */
export const legalEntity = {
  name: `Redazione di ${siteConfig.name}`,
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

const titolareText = `${legalEntity.name}, contattabile all'indirizzo email ${legalEntity.email}. ${siteConfig.name} è un progetto editoriale indipendente, senza finalità commerciali.`;

/* ------------------------------------------------------------------------ */
/* PRIVACY POLICY                                                            */
/* ------------------------------------------------------------------------ */

export const privacyPolicy: LegalDocument = {
  path: routes.privacy,
  title: "Privacy policy",
  heading: "Informativa sulla privacy",
  description: `Come ${siteConfig.name} tratta i dati personali di chi visita il sito: quali dati, perché, per quanto tempo e quali sono i tuoi diritti (GDPR).`,
  intro: `Questa informativa spiega in parole semplici quali dati personali tratta il sito ${siteConfig.url.replace(/^https?:\/\//, "")} e perché, come previsto dagli articoli 13 e 14 del Regolamento (UE) 2016/679 ("GDPR"). Per usare il sito non devi registrarti e non ti chiediamo dati che ti identificano.`,
  sections: [
    {
      id: "in-breve",
      title: "In breve",
      blocks: [
        ul(
          "Non serve registrarsi: non ti chiediamo nome, email o altri dati per usare il sito.",
          "Le risposte al test restano nel tuo browser: non le riceviamo e non le salviamo.",
          "La ricerca di ottici e oculisti è facoltativa. La tua posizione resta nel browser: non la riceviamo e non la salviamo.",
          "Non usiamo cookie di profilazione o pubblicità e non facciamo marketing.",
          "Contiamo le visite solo in forma aggregata, senza cookie.",
          `Per qualsiasi richiesta sui tuoi dati scrivi a ${legalEntity.email}.`,
        ),
      ],
    },
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
          "Dati di navigazione. Come per ogni sito, i server che ospitano e proteggono il sito registrano in automatico alcuni dati tecnici: indirizzo IP, data e ora, pagina visitata, tipo di browser e sistema operativo, pagina di provenienza. Servono a far funzionare il sito e a proteggerlo da abusi e attacchi.",
        ),
        p(
          "Test di autovalutazione. Le risposte vengono elaborate nel tuo browser e non ci vengono inviate. Per mostrarti l'esito, il punteggio complessivo (da 0 a 100) e l'area più critica vengono inseriti nell'indirizzo della pagina dei risultati: per questo possono comparire nei dati di navigazione. Non li usiamo per identificarti, per profilarti o per altri scopi.",
        ),
        p(
          "Timer 20-20-20. Lo stato e le impostazioni del timer vengono salvati solo sul tuo dispositivo e non ci vengono inviati. Se attivi le notifiche, il permesso lo gestisce il tuo browser.",
        ),
        p(
          "Statistiche di visita. Usiamo Cloudflare Web Analytics per sapere, in forma aggregata, quante visite riceve il sito e quali pagine vengono lette. Secondo Cloudflare, il servizio non usa cookie, non crea profili e non usa l'indirizzo IP per seguire i visitatori.",
        ),
        p(
          "Dati che ci invii tu. Se ci scrivi via email, trattiamo il tuo indirizzo email e il contenuto del messaggio. Ti chiediamo di non inviarci informazioni sulla tua salute: la casella è un contatto editoriale, non clinico.",
        ),
      ],
    },
    {
      id: "ricerca-professionisti",
      title: "Ricerca di ottici e oculisti",
      blocks: [
        p(
          "Nella pagina «Trova ottici e oculisti» e nella pagina dei risultati del test puoi cercare, se vuoi, ottici e oculisti vicini a te. La ricerca è facoltativa e parte solo quando premi «Usa la mia posizione» oppure cerchi una città o un CAP. Prima di allora la pagina non contatta servizi esterni.",
        ),
        p(
          "La tua posizione. Se usi la posizione, il browser ti chiede il permesso. La posizione viene subito resa approssimativa (circa 1 km) e usata solo nel tuo browser per calcolare le distanze. Non ci viene inviata e non la salviamo.",
        ),
        p(
          "Città o CAP. Se scrivi una città o un CAP, il testo viene inviato al servizio Nominatim di OpenStreetMap, che trova la località sulla mappa.",
        ),
        p(
          "La mappa. Le immagini della mappa arrivano dai server di OpenStreetMap e vengono caricate solo dopo che hai avviato una ricerca.",
        ),
        p(
          "Chi riceve questi dati. Nominatim e i server delle mappe sono gestiti dalla OpenStreetMap Foundation, con sede nel Regno Unito (Paese che la Commissione europea riconosce come adeguato per la protezione dei dati). Come ogni sito che visiti, ricevono il tuo indirizzo IP e i dati tecnici della richiesta e li trattano come titolari autonomi, non per nostro conto. La loro informativa è su https://osmfoundation.org/wiki/Privacy_Policy.",
        ),
        p(
          "Indicazioni stradali. Il link «Indicazioni» apre Google Maps in una nuova scheda, con la sola destinazione (la posizione del centro), mai la tua. È un normale collegamento: Google riceve dati solo se lo apri, e da quel momento vale l'informativa di Google (https://policies.google.com/privacy).",
        ),
        p(
          "L'elenco dei professionisti. L'elenco proviene dai dati pubblici di OpenStreetMap ed è ospitato sul nostro sito. Il browser lo scarica per intero, uguale per tutti: non rivela la zona che stai cercando. Le schede dei singoli centri sono normali pagine del sito e, come ogni pagina visitata, compaiono nei dati di navigazione.",
        ),
        p(
          `Cosa non facciamo. ${siteConfig.name} non riceve e non conserva la tua posizione, la città o il CAP che cerchi, né i risultati della ricerca. Non li salviamo nemmeno nel tuo browser (niente cookie né archiviazione locale) e non li colleghiamo ai risultati del test. Quando cancelli la ricerca o chiudi la pagina, spariscono.`,
        ),
        p(
          "Puoi negare il permesso di posizione e cercare per città o CAP. Se lo hai concesso, puoi revocarlo in qualsiasi momento dalle impostazioni del browser.",
        ),
      ],
    },
    {
      id: "finalita",
      title: "Perché trattiamo i dati (finalità e basi giuridiche)",
      blocks: [
        ul(
          "Far funzionare il sito e proteggerlo (dati di navigazione): nostro legittimo interesse (art. 6, par. 1, lett. f GDPR).",
          "Statistiche aggregate di visita, senza cookie: nostro legittimo interesse a capire quali contenuti sono utili (art. 6, par. 1, lett. f GDPR).",
          "Rispondere alle tue email: misure richieste da te (art. 6, par. 1, lett. b GDPR).",
          "Rispettare eventuali obblighi di legge (art. 6, par. 1, lett. c GDPR).",
        ),
        p(
          "Non facciamo profilazione, né decisioni automatizzate, né marketing.",
        ),
      ],
    },
    {
      id: "fornitori",
      title: "A chi vengono comunicati i dati",
      blocks: [
        p(
          "Ci affidiamo ad alcuni fornitori, che trattano i dati per nostro conto (responsabili del trattamento):",
        ),
        ul(
          "Cloudflare, Inc. (Stati Uniti): rende il sito veloce e lo protegge dagli attacchi; fornisce le statistiche aggregate di visita.",
          "Netlify, Inc. (Stati Uniti): ospita il sito.",
          "Google LLC / Google Ireland Ltd: gestisce la casella email di contatto.",
        ),
        p(
          "I servizi di OpenStreetMap usati dalla ricerca facoltativa di ottici e oculisti non lavorano per nostro conto: vedi la sezione «Ricerca di ottici e oculisti».",
        ),
        p(
          "Alcuni fornitori possono trattare dati negli Stati Uniti. In questi casi il trasferimento è protetto dalle garanzie previste dagli articoli 45 e 46 del GDPR: l'EU-US Data Privacy Framework, per i fornitori che vi aderiscono, oppure le clausole contrattuali standard approvate dalla Commissione europea.",
        ),
        p("Non vendiamo né cediamo i dati a nessuno."),
      ],
    },
    {
      id: "conservazione",
      title: "Per quanto tempo conserviamo i dati",
      blocks: [
        ul(
          "Dati di navigazione: per il tempo previsto dai fornitori di hosting e sicurezza per finalità tecniche, secondo le loro informative.",
          "Statistiche: solo in forma aggregata, che non permette di identificarti.",
          "Email: il tempo necessario a rispondere e comunque non oltre 12 mesi dall'ultimo messaggio, salvo obblighi di legge.",
          "Impostazioni del timer: restano sul tuo dispositivo finché non cancelli i dati del sito dal browser.",
          "Ricerca di ottici e oculisti: non conserviamo nulla. I servizi di OpenStreetMap conservano i propri dati tecnici secondo le loro regole.",
        ),
      ],
    },
    {
      id: "diritti",
      title: "I tuoi diritti",
      blocks: [
        p(
          "Puoi chiederci in ogni momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne l'uso o riceverli in un formato leggibile (portabilità). Puoi anche opporti ai trattamenti basati sul nostro legittimo interesse (articoli da 15 a 22 GDPR).",
        ),
        p(
          `Per farlo scrivi a ${legalEntity.email}. Ti rispondiamo entro un mese.`,
        ),
        p(
          "Se pensi che i tuoi dati siano trattati in modo non corretto, puoi presentare reclamo al Garante per la protezione dei dati personali (https://www.garanteprivacy.it) o all'autorità del Paese in cui vivi o lavori.",
        ),
      ],
    },
    {
      id: "minori",
      title: "Minori",
      blocks: [
        p(
          "Il sito è educativo e si rivolge a tutti. Non raccogliamo consapevolmente dati di minori di 14 anni: se sei un genitore e pensi che tuo figlio ci abbia scritto, contattaci e cancelleremo i dati.",
        ),
      ],
    },
    {
      id: "modifiche",
      title: "Modifiche a questa informativa",
      blocks: [
        p(
          "Possiamo aggiornare questa informativa, per esempio se cambiano i servizi usati dal sito. La data dell'ultimo aggiornamento è in cima alla pagina.",
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
    "I cookie sono piccoli file che un sito salva nel tuo browser. Qui trovi quali strumenti di questo tipo usa il sito e perché non vedi un banner per il consenso.",
  sections: [
    {
      id: "in-breve",
      title: "In breve",
      blocks: [
        ul(
          "Il sito non installa cookie propri.",
          "Nessun cookie di profilazione, pubblicità o marketing.",
          "Statistiche di visita senza cookie.",
          "Cloudflare, che protegge il sito, può impostare due cookie tecnici di sicurezza.",
          "Il timer 20-20-20 salva le tue impostazioni solo sul tuo dispositivo.",
          "La ricerca di ottici e oculisti non salva nulla nel browser.",
        ),
      ],
    },
    {
      id: "elenco",
      title: "Cookie e strumenti usati",
      blocks: [
        p("Questi sono tutti gli strumenti che possono essere salvati nel tuo browser:"),
        ul(
          "__cf_bm (cookie tecnico di Cloudflare): distingue i visitatori reali dal traffico automatico. Dura circa 30 minuti.",
          "cf_clearance (cookie tecnico di Cloudflare): ricorda che hai superato una verifica di sicurezza, solo se ti è stata mostrata. Dura da pochi minuti ad alcune ore.",
          "wbe_timer_v1 (archiviazione locale del browser): ricorda lo stato e le impostazioni del timer 20-20-20, solo se lo usi. Resta finché non cancelli i dati del sito dal browser e non ci viene inviato.",
        ),
        p(
          "Sono tutti strettamente necessari alla sicurezza del sito o a una funzione che hai scelto di usare, e non servono a profilarti. Per questo non richiedono il tuo consenso.",
        ),
        p(
          "Se attivi le notifiche del timer, il browser ti chiede un permesso, che puoi revocare in qualsiasi momento dalle sue impostazioni.",
        ),
        p(
          "La ricerca di ottici e oculisti non salva nulla nel browser: posizione, città e risultati spariscono quando cancelli la ricerca o chiudi la pagina.",
        ),
      ],
    },
    {
      id: "statistiche",
      title: "Statistiche di visita",
      blocks: [
        p(
          "Usiamo Cloudflare Web Analytics, che conta le visite in forma aggregata senza cookie e senza creare profili. Non usiamo Google Analytics né altri strumenti di tracciamento.",
        ),
      ],
    },
    {
      id: "terze-parti",
      title: "Contenuti di terze parti",
      blocks: [
        p(
          "Il sito non incorpora video, pulsanti social o altri contenuti esterni che installano cookie. I caratteri tipografici sono ospitati sul nostro sito. I link verso altri siti (per esempio le fonti scientifiche o il link «Indicazioni», che apre Google Maps) portano a pagine con regole proprie.",
        ),
        p(
          "La mappa della ricerca di ottici e oculisti arriva dai server di OpenStreetMap e si carica solo quando avvii una ricerca. Ad oggi questi servizi non impostano cookie. Per i dettagli vedi la privacy policy.",
        ),
      ],
    },
    {
      id: "banner",
      title: "Perché non c'è il banner dei cookie",
      blocks: [
        p(
          "Secondo le Linee guida del Garante per la protezione dei dati personali sui cookie (10 giugno 2021), il consenso, e quindi il banner, serve solo per cookie e strumenti non tecnici. Il sito usa solo strumenti tecnici e statistiche senza cookie, quindi il consenso non è necessario. Questa pagina ti dà comunque tutte le informazioni previste.",
        ),
      ],
    },
    {
      id: "gestione",
      title: "Come gestire cookie e dati del sito",
      blocks: [
        p(
          "Puoi cancellare o bloccare cookie e dati del sito dalle impostazioni del browser (di solito nella sezione privacy). Se blocchi i cookie tecnici di Cloudflare, alcune verifiche di sicurezza potrebbero ripetersi.",
        ),
        p(
          `Per qualsiasi domanda scrivi a ${legalEntity.email}. Per i dati personali vedi anche la privacy policy.`,
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
