// TESTO DA SOTTOPORRE A REVISIONE LEGALE PRIMA DELLA PUBBLICAZIONE.
/**
 * CONTENUTO — Cookie Policy
 * --------------------------------------------------------------------------
 * Fotografa lo stato REALE del sito: nessun cookie proprio (né tecnico né di
 * profilazione), nessun banner (motivato con le Linee guida del Garante del
 * 10 giugno 2021), possibili cookie tecnici di sicurezza del CDN Cloudflare
 * (dipendono dalla configurazione: verificare, vedi segnaposto), archiviazione
 * locale del timer, strumenti predisposti nel codice ma non attivi.
 */

import { siteConfig } from "@/data/site";
import type { LegalDocument } from "./types";

export const cookiePolicy: LegalDocument = {
  slug: "cookie-policy",
  eyebrow: "Documenti legali",
  title: "Cookie Policy",
  description:
    "Informativa sull'uso dei cookie del sito Rhodopsine: il sito non installa cookie propri né di profilazione; possibili cookie tecnici di sicurezza del CDN.",
  updatedAt: "2026-07-04",
  intro: [
    `Questa pagina descrive l'uso di cookie e tecnologie assimilate su ${siteConfig.name}. In sintesi: il sito non installa cookie propri, né tecnici né di profilazione, e non utilizza strumenti di analisi basati su cookie.`,
  ],
  sections: [
    {
      id: "cosa-sono",
      title: "1. Cosa sono i cookie",
      paragraphs: [
        "I cookie sono piccoli file di testo che i siti visitati inviano al browser, dove vengono memorizzati per essere ritrasmessi agli stessi siti alle visite successive. Si distinguono, in linea generale, i cookie tecnici (necessari al funzionamento o alla sicurezza del sito, che non richiedono consenso) dai cookie di profilazione e dagli altri strumenti di tracciamento (che richiedono il consenso preventivo dell'utente).",
      ],
    },
    {
      id: "cookie-di-questo-sito",
      title: "2. I cookie di questo sito",
      paragraphs: [
        `${siteConfig.name} non installa alcun cookie proprio: nessun cookie di profilazione, nessun cookie pubblicitario e nessun cookie tecnico di prima parte. Il sito non richiede login, non ha carrelli o preferenze lato server e non utilizza strumenti di statistica basati su cookie.`,
      ],
    },
    {
      id: "perche-non-c-e-un-banner",
      title: "3. Perché non c'è un banner dei cookie",
      paragraphs: [
        "In base alla normativa ePrivacy e alle Linee guida del Garante per la protezione dei dati personali su cookie e altri strumenti di tracciamento del 10 giugno 2021, il banner di richiesta del consenso è necessario soltanto quando un sito utilizza cookie diversi da quelli tecnici (per esempio cookie di profilazione o di analisi non anonimizzata).",
        "Poiché questo sito non utilizza cookie soggetti a consenso, non c'è alcun consenso da raccogliere: in luogo del banner è pubblicata questa informativa, che verrà aggiornata prima dell'eventuale introduzione di strumenti che lo rendano necessario.",
      ],
    },
    {
      id: "cdn-cloudflare",
      title: "4. Possibili cookie tecnici del CDN (Cloudflare)",
      paragraphs: [
        "Il sito è erogato tramite la rete di distribuzione Cloudflare, che lo protegge da abusi e attacchi. Per finalità esclusivamente tecniche e di sicurezza (per esempio la mitigazione di bot e di traffico automatizzato), Cloudflare può impostare propri cookie tecnici — tipicamente denominati __cf_bm o cf_clearance — quando le relative funzioni di protezione sono attive sulla configurazione del sito.",
        "Si tratta di cookie tecnici di sicurezza, esenti da consenso, che non profilano l'utente e hanno durata breve. [DA COMPLETARE: verificare nella configurazione Cloudflare attiva quali di questi cookie risultano effettivamente impostati e aggiornare di conseguenza questo elenco.]",
      ],
    },
    {
      id: "archiviazione-locale",
      title: "5. Archiviazione locale nel browser (non cookie)",
      paragraphs: [
        "Alcune funzioni del sito salvano informazioni esclusivamente nella memoria locale del browser (localStorage), senza alcuna trasmissione al server:",
      ],
      items: [
        "il timer 20-20-20 memorizza il proprio stato e le preferenze di utilizzo, così da poter riprendere da dove avevi lasciato;",
        "le risposte del test di autovalutazione restano nel browser per tutta la compilazione (per il dettaglio si rinvia alla Privacy Policy).",
      ],
      closing: [
        "Questi dati non sono cookie, non lasciano il dispositivo e possono essere eliminati in qualsiasi momento cancellando i dati di navigazione del browser.",
      ],
    },
    {
      id: "strumenti-futuri",
      title: "6. Strumenti predisposti e modifiche future",
      paragraphs: [
        "Il codice del sito predispone — senza attivarli — alcuni strumenti opzionali: statistiche aggregate senza cookie e senza dati personali (Plausible) e, in via eventuale, Google Analytics 4, che usa cookie e verrebbe quindi caricato solo previo consenso tramite un banner con blocco preventivo.",
        "Se in futuro uno di questi strumenti (o altri) venisse attivato, questa pagina sarà aggiornata prima dell'attivazione, con la nuova data di ultimo aggiornamento e, ove richiesto dalla normativa, con l'introduzione del banner di consenso.",
      ],
    },
    {
      id: "gestione",
      title: "7. Come gestire i cookie dal browser",
      paragraphs: [
        "Puoi comunque controllare o eliminare i cookie attraverso le impostazioni del tuo browser: tutti i principali browser permettono di visualizzare i cookie presenti, bloccarli in tutto o in parte ed eliminarli. Le istruzioni sono disponibili nella guida del browser che utilizzi (per esempio nelle sezioni dedicate a privacy e sicurezza).",
        "Tieni presente che il blocco di eventuali cookie tecnici di sicurezza del CDN potrebbe limitare l'accesso al sito durante le verifiche anti-abuso.",
      ],
    },
  ],
};
