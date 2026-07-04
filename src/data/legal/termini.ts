// TESTO DA SOTTOPORRE A REVISIONE LEGALE PRIMA DELLA PUBBLICAZIONE.
/**
 * CONTENUTO — Termini e note legali
 * --------------------------------------------------------------------------
 * Finalità educativa del sito, richiamo integrale del disclaimer medico
 * (stesso testo delle "Avvertenze importanti" nel footer), proprietà
 * intellettuale, limitazione di responsabilità, legge applicabile.
 */

import { siteConfig } from "@/data/site";
import type { LegalDocument } from "./types";

export const termini: LegalDocument = {
  slug: "termini",
  eyebrow: "Documenti legali",
  title: "Termini e note legali",
  description:
    "Termini di utilizzo del sito Rhodopsine: finalità educativa, avvertenze mediche, proprietà intellettuale, limitazione di responsabilità e legge applicabile.",
  updatedAt: "2026-07-04",
  intro: [
    `Questi termini regolano l'utilizzo di ${siteConfig.name} e dei suoi strumenti. Navigando il sito accetti le condizioni descritte in questa pagina; se non le condividi, ti invitiamo a non utilizzare il sito.`,
  ],
  sections: [
    {
      id: "oggetto",
      title: "1. Oggetto e finalità del sito",
      paragraphs: [
        `${siteConfig.name} è un sito educativo dedicato al benessere visivo digitale. Mette a disposizione, gratuitamente, contenuti informativi e uno strumento di autovalutazione dell'affaticamento visivo con finalità esclusivamente educative e preventive.`,
        "Il sito non vende prodotti né servizi al pubblico, non richiede registrazione e non eroga prestazioni sanitarie di alcun tipo.",
      ],
    },
    {
      id: "avvertenze-mediche",
      title: "2. Avvertenze importanti (natura non diagnostica)",
      paragraphs: [
        `I contenuti e gli strumenti presenti su ${siteConfig.name} hanno esclusivamente finalità informative, educative e preventive. Non costituiscono in alcun modo una diagnosi medica, un parere clinico o una prescrizione.`,
        "Il test di autovalutazione e i relativi risultati non sostituiscono la visita, la valutazione o la consulenza di un professionista. Per sintomi, sospette patologie o una diagnosi rivolgiti a un medico oculista; per un controllo della vista o degli occhiali la figura di riferimento è l'ottico-optometrista, che non effettua diagnosi.",
        "In caso di disturbi improvvisi della vista (per esempio perdita della visione, dolore oculare acuto, lampi di luce) contatta tempestivamente un medico o i servizi di emergenza.",
        "L'utilizzo del sito non instaura in alcun modo un rapporto medico-paziente né un rapporto professionale con il titolare.",
      ],
    },
    {
      id: "proprieta-intellettuale",
      title: "3. Proprietà intellettuale",
      paragraphs: [
        `Salvo dove diversamente indicato, i testi, la grafica, il logo, le illustrazioni, il questionario e il codice del sito sono di titolarità del gestore di ${siteConfig.name} o utilizzati su licenza, e sono protetti dalla normativa su diritto d'autore e proprietà intellettuale.`,
        "È consentita la lettura e la condivisione dei contenuti per uso personale e non commerciale, citando la fonte con un collegamento alla pagina originale. Non sono consentite la riproduzione sistematica, la modifica o la ridistribuzione dei contenuti senza autorizzazione scritta del titolare.",
        "Le fonti scientifiche citate restano dei rispettivi autori ed editori.",
      ],
    },
    {
      id: "uso-consentito",
      title: "4. Uso consentito del sito",
      paragraphs: [
        "Ti impegni a utilizzare il sito in modo lecito e corretto. In particolare non è consentito:",
      ],
      items: [
        "compromettere o tentare di compromettere la sicurezza, l'integrità o la disponibilità del sito;",
        "effettuare estrazioni massive o automatizzate dei contenuti (scraping) a fini di riutilizzo non autorizzato;",
        "utilizzare i contenuti in modo da presentarli come pareri medici o diagnostici.",
      ],
    },
    {
      id: "limitazione-responsabilita",
      title: "5. Limitazione di responsabilità",
      paragraphs: [
        "I contenuti sono redatti con cura e sottoposti a revisione, ma vengono forniti \"così come sono\", a scopo informativo, senza garanzia di completezza, esattezza o aggiornamento costante rispetto all'evoluzione delle conoscenze scientifiche.",
        "Nei limiti massimi consentiti dalla legge, il titolare non risponde delle decisioni assunte sulla sola base dei contenuti del sito né dei danni derivanti dal loro utilizzo improprio: per qualunque questione di salute visiva il riferimento resta il professionista competente, come indicato nelle avvertenze.",
        "Il sito può contenere collegamenti a risorse esterne (per esempio le fonti scientifiche citate): il titolare non ha controllo su tali risorse e non risponde dei loro contenuti o delle loro politiche.",
        "Il titolare non garantisce che il sito sia sempre disponibile o privo di errori e può modificarne, sospenderne o interromperne funzioni e contenuti in qualsiasi momento.",
      ],
    },
    {
      id: "legge-applicabile",
      title: "6. Legge applicabile e controversie",
      paragraphs: [
        "Questi termini sono regolati dalla legge italiana. Per gli utenti che rivestono la qualità di consumatori restano ferme le tutele inderogabili previste dalla normativa applicabile, incluse quelle sul foro competente.",
        "[DA COMPLETARE: eventuale indicazione del foro competente per i rapporti diversi da quelli con i consumatori, in sede di revisione legale.]",
      ],
    },
    {
      id: "modifiche",
      title: "7. Modifiche a questi termini",
      paragraphs: [
        "Il titolare può aggiornare questi termini per riflettere modifiche del sito o della normativa. Le versioni aggiornate vengono pubblicate su questa pagina con l'indicazione della data di ultimo aggiornamento riportata in alto; l'uso del sito successivo alla pubblicazione comporta l'accettazione dei termini aggiornati.",
      ],
    },
  ],
};
