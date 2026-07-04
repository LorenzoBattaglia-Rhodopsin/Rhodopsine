// TESTO DA SOTTOPORRE A REVISIONE LEGALE PRIMA DELLA PUBBLICAZIONE.
/**
 * CONTENUTO — Privacy Policy
 * --------------------------------------------------------------------------
 * Informativa ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679 (GDPR).
 * Descrive i trattamenti REALI del sito: log tecnici di hosting/CDN, email di
 * contatto, punteggio del test trasmesso in querystring. I segnaposto
 * [DA COMPLETARE: …] vanno valorizzati in sede di revisione legale: NON
 * inventare dati del titolare.
 */

import { siteConfig } from "@/data/site";
import type { LegalDocument } from "./types";

export const privacyPolicy: LegalDocument = {
  slug: "privacy-policy",
  eyebrow: "Documenti legali",
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali del sito Rhodopsine: log tecnici di hosting e CDN, email di contatto, funzionamento locale del test di autovalutazione.",
  updatedAt: "2026-07-04",
  intro: [
    `Questa informativa descrive, ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 ("GDPR"), come vengono trattati i dati personali di chi visita ${siteConfig.name}. Il sito ha finalità esclusivamente educative e preventive: non richiede registrazione, non profila i visitatori e riduce al minimo i dati trattati.`,
  ],
  sections: [
    {
      id: "titolare",
      title: "1. Titolare del trattamento",
      paragraphs: [
        "Il titolare del trattamento è Lorenzo [DA COMPLETARE: cognome del titolare], [DA COMPLETARE: indirizzo o domicilio eletto ai fini delle comunicazioni].",
        `Per ogni questione relativa a questa informativa e all'esercizio dei diritti puoi scrivere a ${siteConfig.contact.email}.`,
        "Non è stato nominato un responsabile della protezione dei dati (DPO), non ricorrendone i presupposti per la natura e la portata dei trattamenti descritti. [DA COMPLETARE: confermare in sede di revisione legale.]",
      ],
    },
    {
      id: "dati-trattati",
      title: "2. Quali dati vengono trattati",
      paragraphs: [
        "Il sito non richiede registrazione e non raccoglie dati tramite moduli. I trattamenti effettivamente in essere sono i seguenti.",
      ],
      items: [
        "Log tecnici di hosting e CDN. Il sito è erogato tramite un fornitore di hosting [DA COMPLETARE: denominazione del fornitore di hosting] e la rete di distribuzione Cloudflare. Come per qualunque sito web, i sistemi registrano automaticamente log tecnici che possono includere indirizzo IP, data e ora della richiesta, URL richiesto, user agent del browser e informazioni analoghe. Questi dati sono necessari a erogare il sito e a proteggerlo da abusi e attacchi.",
        `Email di contatto. Se scrivi a ${siteConfig.contact.email} (casella gestita tramite il servizio Gmail di Google), vengono trattati l'indirizzo email del mittente e i dati eventualmente contenuti nel messaggio, al solo fine di dare riscontro alla richiesta.`,
        "Test di autovalutazione. Le risposte alle domande del test restano esclusivamente nel browser e non vengono inviate né salvate dal sito. Al termine, soltanto il punteggio complessivo (un numero da 0 a 100) e l'eventuale area tematica prevalente vengono trasmessi come parametri nell'indirizzo della pagina dei risultati (querystring del percorso /risultati) al solo scopo di mostrare l'esito. Si tratta di valori privi di qualunque identificativo personale, che il sito non memorizza e non associa alla persona.",
      ],
      closing: [
        "Precisazione sul punteggio del test: poiché il punteggio transita nell'URL, la relativa richiesta può comparire — come qualsiasi altro URL visitato — nei log tecnici di hosting e CDN descritti sopra, accanto all'indirizzo IP. Il titolare non utilizza tali log per ricostruire, conservare o analizzare gli esiti del test, che restano un dato anonimo e non riconducibile a un profilo dell'utente.",
      ],
    },
    {
      id: "finalita-basi-giuridiche",
      title: "3. Finalità e basi giuridiche",
      paragraphs: [],
      items: [
        "Log tecnici: garantire l'erogazione, la sicurezza e la continuità del sito e prevenire abusi. Base giuridica: legittimo interesse del titolare (art. 6, par. 1, lett. f GDPR) alla sicurezza e al corretto funzionamento del servizio.",
        "Email di contatto: dare riscontro a richieste e segnalazioni ricevute. Base giuridica: esecuzione di misure adottate su richiesta dell'interessato (art. 6, par. 1, lett. b GDPR) e, per le comunicazioni successive strettamente collegate, legittimo interesse a gestire la corrispondenza (art. 6, par. 1, lett. f GDPR).",
        "Test di autovalutazione: non comporta alcun trattamento di dati personali lato server da parte del titolare, nei termini descritti alla sezione precedente.",
      ],
    },
    {
      id: "conservazione",
      title: "4. Tempi di conservazione",
      paragraphs: [],
      items: [
        "Log tecnici: sono conservati per i tempi tecnici definiti dai fornitori di hosting e CDN, di norma limitati a quanto necessario per finalità di sicurezza e diagnostica. [DA COMPLETARE: verificare e indicare i tempi di retention effettivi dei fornitori utilizzati.]",
        "Email: la corrispondenza è conservata per il tempo necessario a gestire la richiesta e per eventuali esigenze di documentazione, e comunque non oltre [DA COMPLETARE: termine di conservazione della corrispondenza].",
      ],
    },
    {
      id: "destinatari",
      title: "5. Destinatari e fornitori",
      paragraphs: [
        "I dati non vengono comunicati a terzi per finalità di marketing né ceduti ad alcun titolo. Possono venirne a conoscenza esclusivamente i fornitori tecnici di cui il sito si avvale, nei limiti dei rispettivi ruoli:",
      ],
      items: [
        "[DA COMPLETARE: fornitore di hosting] — erogazione dell'infrastruttura del sito;",
        "Cloudflare, Inc. — rete di distribuzione dei contenuti (CDN), protezione e sicurezza del traffico;",
        "Google Ireland Ltd. / Google LLC — gestione della casella email di contatto (Gmail).",
      ],
      closing: [
        "Ciascun fornitore tratta i dati sulla base dei propri termini di servizio e delle proprie informative, in qualità di responsabile del trattamento o di autonomo titolare secondo il rispettivo ruolo. [DA COMPLETARE: verificare l'inquadramento contrattuale dei singoli fornitori.]",
      ],
    },
    {
      id: "trasferimenti",
      title: "6. Trasferimenti extra-UE",
      paragraphs: [
        "Alcuni fornitori indicati sopra (Cloudflare, Google) hanno sede o infrastrutture negli Stati Uniti: i dati tecnici potrebbero quindi essere trasferiti al di fuori dello Spazio Economico Europeo. Tali trasferimenti avvengono sulla base delle garanzie previste dal GDPR, quali decisioni di adeguatezza (ad esempio l'EU-U.S. Data Privacy Framework, per i fornitori certificati) o clausole contrattuali standard approvate dalla Commissione europea.",
      ],
    },
    {
      id: "profilazione",
      title: "7. Assenza di profilazione e di decisioni automatizzate",
      paragraphs: [
        "Il sito non effettua alcuna profilazione dei visitatori e non adotta decisioni basate su trattamenti automatizzati che producano effetti giuridici o incidano in modo analogo sulle persone. Il punteggio del test è calcolato interamente nel browser, ha valore esclusivamente educativo e non viene associato all'identità di chi lo esegue.",
        "Il sito non utilizza cookie di profilazione: per il dettaglio si rinvia alla Cookie Policy.",
      ],
    },
    {
      id: "diritti",
      title: "8. Diritti degli interessati",
      paragraphs: [
        "Nei limiti in cui i trattamenti descritti riguardino dati personali, puoi esercitare in qualsiasi momento i diritti previsti dagli articoli 15-21 del GDPR:",
      ],
      items: [
        "accesso ai dati e alle informazioni sul trattamento (art. 15);",
        "rettifica dei dati inesatti o incompleti (art. 16);",
        "cancellazione, nei casi previsti (art. 17);",
        "limitazione del trattamento (art. 18);",
        "portabilità dei dati forniti, ove applicabile (art. 20);",
        "opposizione al trattamento fondato sul legittimo interesse (art. 21).",
      ],
      closing: [
        `Per esercitare i diritti è sufficiente scrivere a ${siteConfig.contact.email}. Resta ferma la possibilità di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it) se ritieni che un trattamento violi la normativa.`,
      ],
    },
    {
      id: "minori",
      title: "9. Minori",
      paragraphs: [
        "I contenuti del sito si rivolgono a un pubblico generale e non sono destinati specificamente ai minori. Il sito non raccoglie consapevolmente dati personali di minori: non essendo prevista alcuna registrazione né alcun modulo di raccolta dati, l'unico trattamento possibile resta quello tecnico descritto sopra.",
      ],
    },
    {
      id: "aggiornamenti",
      title: "10. Aggiornamenti di questa informativa",
      paragraphs: [
        "Questa informativa può essere aggiornata per riflettere modifiche del sito o della normativa. Le versioni aggiornate vengono pubblicate su questa pagina con l'indicazione della data di ultimo aggiornamento riportata in alto. In caso di modifiche sostanziali dei trattamenti (per esempio l'introduzione di strumenti di analisi o di persistenza dei dati) l'informativa sarà rivista prima della loro attivazione.",
      ],
    },
  ],
};
