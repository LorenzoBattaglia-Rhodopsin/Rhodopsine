import type {
  AssessmentQuestion,
  LikertOption,
  AssessmentDomain,
} from "@/types/assessment";

/**
 * QUESTIONARIO — Affaticamento visivo digitale
 * --------------------------------------------------------------------------
 * 18 domande su scala Likert 1–5, ispirate alle aree indagate dalla
 * letteratura degli ultimi anni su Digital Eye Strain (DES) e Computer Vision
 * Syndrome (CVS), e a strumenti validati di riferimento (es. CVS-Q,
 * Seguí et al., 2015). NON è una riproduzione di uno strumento clinico e
 * NON ha valore diagnostico: serve solo ad aumentare la consapevolezza.
 *
 * Convenzione "direction":
 * - "symptom"     -> più alto = più affaticamento (es. "Avverto bruciore").
 * - "protective"  -> più alto = abitudine migliore (es. "Faccio pause").
 *                    Verrà invertita in `features/assessment/scoring.ts`.
 */

/** Opzioni della scala Likert (1 = Mai, 5 = Sempre). */
export const likertOptions: LikertOption[] = [
  { value: 1, label: "Mai" },
  { value: 2, label: "Raramente" },
  { value: 3, label: "A volte" },
  { value: 4, label: "Spesso" },
  { value: 5, label: "Sempre" },
];

/** Etichette leggibili dei domini (usate nei risultati). */
export const domainLabels: Record<AssessmentDomain, string> = {
  exposure: "Tempo di esposizione",
  breaks: "Pause visive",
  ergonomics: "Ergonomia",
  environment: "Ambiente e illuminazione",
  symptoms: "Sintomi oculari",
  sleep: "Uso serale e sonno",
};

export const questions: AssessmentQuestion[] = [
  // --- Tempo di esposizione -------------------------------------------------
  {
    id: "exposure-hours",
    text: "Trascorro molte ore consecutive davanti a schermi (smartphone, computer, tablet).",
    helper: "Considera una giornata tipica di lavoro o studio.",
    domain: "exposure",
    direction: "symptom",
  },
  {
    id: "exposure-continuous",
    text: "Uso lo schermo per lunghi periodi senza mai distogliere lo sguardo.",
    domain: "exposure",
    direction: "symptom",
  },
  // --- Pause visive ---------------------------------------------------------
  {
    id: "breaks-regular",
    text: "Faccio pause regolari per far riposare gli occhi durante l'uso dello schermo.",
    domain: "breaks",
    direction: "protective",
  },
  {
    id: "breaks-202020",
    text: "Applico la regola 20-20-20 (ogni 20 minuti guardo per 20 secondi un oggetto distante circa 6 metri).",
    domain: "breaks",
    direction: "protective",
  },
  {
    id: "breaks-blink",
    text: "Mi accorgo di ammiccare (sbattere le palpebre) meno del solito quando fisso lo schermo.",
    helper: "Davanti agli schermi la frequenza di ammiccamento tende a ridursi.",
    domain: "breaks",
    direction: "symptom",
  },
  // --- Ergonomia ------------------------------------------------------------
  {
    id: "ergonomics-distance",
    text: "Mantengo una distanza adeguata dallo schermo (circa 50–70 cm dal monitor).",
    domain: "ergonomics",
    direction: "protective",
  },
  {
    id: "ergonomics-phone-close",
    text: "Tengo lo smartphone molto vicino agli occhi (meno di 30 cm).",
    domain: "ergonomics",
    direction: "symptom",
  },
  {
    id: "ergonomics-posture",
    text: "Avverto tensione o dolore a collo e spalle dopo l'uso prolungato dei dispositivi.",
    domain: "ergonomics",
    direction: "symptom",
  },
  // --- Ambiente e illuminazione --------------------------------------------
  {
    id: "environment-glare",
    text: "Noto riflessi o bagliori fastidiosi sullo schermo.",
    domain: "environment",
    direction: "symptom",
  },
  {
    id: "environment-lighting",
    text: "Lavoro in un ambiente con illuminazione adeguata, né troppo buio né troppo intenso.",
    domain: "environment",
    direction: "protective",
  },
  {
    id: "environment-brightness",
    text: "La luminosità dello schermo è molto diversa da quella dell'ambiente intorno a me.",
    domain: "environment",
    direction: "symptom",
  },
  // --- Sintomi oculari ------------------------------------------------------
  {
    id: "symptoms-dryness",
    text: "Avverto secchezza, sensazione di sabbia o corpo estraneo agli occhi.",
    domain: "symptoms",
    direction: "symptom",
  },
  {
    id: "symptoms-burning",
    text: "Avverto bruciore, prurito o arrossamento agli occhi.",
    domain: "symptoms",
    direction: "symptom",
  },
  {
    id: "symptoms-blur",
    text: "Ho visione offuscata o difficoltà a mettere a fuoco dopo l'uso dello schermo.",
    domain: "symptoms",
    direction: "symptom",
  },
  {
    id: "symptoms-headache",
    text: "Ho mal di testa, in particolare nella zona frontale o intorno agli occhi.",
    domain: "symptoms",
    direction: "symptom",
  },
  {
    id: "symptoms-tearing",
    text: "I miei occhi lacrimano o sono particolarmente sensibili alla luce.",
    domain: "symptoms",
    direction: "symptom",
  },
  // --- Uso serale e sonno ---------------------------------------------------
  {
    id: "sleep-evening-use",
    text: "Uso schermi luminosi nell'ora prima di andare a dormire.",
    domain: "sleep",
    direction: "symptom",
  },
  {
    id: "sleep-quality",
    text: "Mi sveglio riposato/a e con gli occhi che non sono affaticati.",
    domain: "sleep",
    direction: "protective",
  },
];

/** Numero totale di domande (comodo per la UI e i test). */
export const totalQuestions = questions.length;
