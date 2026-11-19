/**
 * CONTENUTI — Fonti scientifiche e linee guida
 * --------------------------------------------------------------------------
 * Unica fonte di verità per le referenze sull'affaticamento visivo digitale
 * (Digital Eye Strain / Computer Vision Syndrome). La UI (vedi
 * `components/shared/sources-list`) legge SOLO da qui.
 *
 * Sono riferimenti reali e verificabili: studi peer-reviewed, enti ufficiali e
 * pagine di riferimento. Servono a documentare la base delle informazioni
 * (segnale di E-E-A-T), NON a fornire indicazioni cliniche personalizzate.
 *
 * Aggiungere una fonte = aggiungere un oggetto all'array `sources`.
 */

export type SourceKind = "Studio" | "Linea guida" | "Ente ufficiale";

export type ScientificSource = {
  /** Identificatore stabile e univoco (anche React key). */
  id: string;
  /** Titolo della pubblicazione o della pagina di riferimento. */
  title: string;
  /** Autori o ente che pubblica. */
  authors: string;
  /** Rivista, editore od organizzazione. */
  publication: string;
  /** Anno di pubblicazione (o ultimo aggiornamento noto). */
  year: number;
  /** URL ufficiale (DOI quando disponibile). */
  url: string;
  /** Natura della fonte, per l'etichetta nella UI. */
  kind: SourceKind;
};

export const sources: ScientificSource[] = [
  {
    id: "sheppard-wolffsohn-2018",
    title:
      "Digital eye strain: prevalence, measurement and amelioration",
    authors: "Sheppard A.L., Wolffsohn J.S.",
    publication: "BMJ Open Ophthalmology",
    year: 2018,
    url: "https://doi.org/10.1136/bmjophth-2018-000146",
    kind: "Studio",
  },
  {
    id: "rosenfield-2011",
    title:
      "Computer vision syndrome: a review of ocular causes and potential treatments",
    authors: "Rosenfield M.",
    publication: "Ophthalmic & Physiological Optics",
    year: 2011,
    url: "https://doi.org/10.1111/j.1475-1313.2011.00834.x",
    kind: "Studio",
  },
  {
    id: "coles-brennan-2019",
    title: "Management of digital eye strain",
    authors: "Coles-Brennan C., Sulley A., Young G.",
    publication: "Clinical and Experimental Optometry",
    year: 2019,
    url: "https://doi.org/10.1111/cxo.12798",
    kind: "Studio",
  },
  {
    id: "aoa-computer-vision-syndrome",
    title: "Computer vision syndrome (digital eye strain)",
    authors: "American Optometric Association (AOA)",
    publication: "aoa.org — Eye and vision conditions",
    year: 2024,
    url: "https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome",
    kind: "Ente ufficiale",
  },
  {
    id: "aao-computer-usage",
    title: "Computers, digital devices and eye strain",
    authors: "American Academy of Ophthalmology (AAO)",
    publication: "aao.org — Tips & prevention",
    year: 2024,
    url: "https://www.aao.org/eye-health/tips-prevention/computer-usage",
    kind: "Ente ufficiale",
  },
  {
    id: "talens-estarelles-2023",
    title:
      "The effects of breaks on digital eye strain, dry eye and binocular vision: testing the 20-20-20 rule",
    authors: "Talens-Estarelles C., Cerviño A., García-Lázaro S., Fogelton A., Sheppard A., Wolffsohn J.S.",
    publication: "Contact Lens and Anterior Eye",
    year: 2023,
    url: "https://doi.org/10.1016/j.clae.2022.101744",
    kind: "Studio",
  },
  {
    id: "johnson-rosenfield-2023",
    title: "20-20-20 rule: are these numbers justified?",
    authors: "Johnson S., Rosenfield M.",
    publication: "Optometry and Vision Science",
    year: 2023,
    url: "https://doi.org/10.1097/OPX.0000000000001971",
    kind: "Studio",
  },
  {
    id: "singh-cochrane-2023",
    title:
      "Blue-light filtering spectacle lenses for visual performance, sleep, and macular health in adults",
    authors: "Singh S., Keller P.R., Busija L., McMillan P., Makrai E., Lawrenson J.G., Hull C.C., Downie L.E.",
    publication: "Cochrane Database of Systematic Reviews",
    year: 2023,
    url: "https://doi.org/10.1002/14651858.CD013244.pub2",
    kind: "Studio",
  },
  {
    id: "chang-2015",
    title:
      "Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness",
    authors: "Chang A.M., Aeschbach D., Duffy J.F., Czeisler C.A.",
    publication: "PNAS",
    year: 2015,
    url: "https://doi.org/10.1073/pnas.1418490112",
    kind: "Studio",
  },
  {
    id: "aao-blue-light",
    title: "Should you be worried about blue light?",
    authors: "American Academy of Ophthalmology (AAO)",
    publication: "aao.org — Tips & prevention",
    year: 2024,
    url: "https://www.aao.org/eye-health/tips-prevention/should-you-be-worried-about-blue-light",
    kind: "Ente ufficiale",
  },
];

/** Recupera le fonti a partire dai loro id, nell'ordine dato (ignora id inesistenti). */
export function getSourcesByIds(ids: readonly string[]): ScientificSource[] {
  return ids
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is ScientificSource => source !== undefined);
}

/** Tutte le fonti, dalla più recente alla più datata. */
export function getAllSources(): ScientificSource[] {
  return [...sources].sort((a, b) => b.year - a.year);
}
