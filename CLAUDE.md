# CLAUDE.md — Istruzioni tecniche per Rhodopsine

Guida operativa per sviluppatori e assistenti AI che lavorano su questo repository.
Leggi prima di tutto la sezione **Regole critiche**: alcuni vincoli non sono opzionali.

---

## 1. Cos'è il progetto

Rhodopsine è un sito **educativo** sul benessere visivo digitale con uno strumento di
**autovalutazione dell'affaticamento visivo** (Digital Eye Strain / Computer Vision
Syndrome). Il modello di business ha due facce: vetrina educativa gratuita per il
pubblico (B2C) e directory a pagamento per oculisti/ottici (B2B, in roadmap).

**Missione e vincolo fondamentale, NON negoziabile:**
> Lo strumento è educativo e preventivo. **Non fornisce diagnosi** e **non sostituisce**
> il parere di un professionista. Ogni contenuto, copy ed esito deve rispettare questo.

Lingua di contenuti, UI e commenti: **italiano**.

---

## 2. Comandi essenziali

```bash
npm install            # installa le dipendenze
npm run dev            # sviluppo su http://localhost:3000 (hot reload)
npm run build          # build di produzione
npm run start          # avvia la build
npm run lint           # ESLint
npm run typecheck      # controllo tipi (tsc --noEmit)
```

**Prima di considerare un lavoro concluso**, devono passare entrambi:
```bash
npm run typecheck && npm run build
```

---

## 3. Stack e versioni

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5.7** (strict)
- **TailwindCSS 3.4** (NON v4) con variabili CSS HSL + convenzione shadcn
- Componenti **shadcn/ui** (stile new-york) scritti a mano su **Radix UI**
  (`slot`, `radio-group`, `progress`, `label`)
- `class-variance-authority` + `clsx` + `tailwind-merge` per le varianti
- Icone: **lucide-react**
- Font: **Geist** via pacchetto npm `geist` (self-hosted, vedi §7)

---

## 4. Mappa del progetto — dove sta cosa

```
src/
├─ app/                       # Routing (App Router)
│  ├─ layout.tsx              # Layout radice: lang, metadata, font, header/footer, JSON-LD
│  ├─ page.tsx                # Landing (compone le sezioni landing/)
│  ├─ globals.css             # ⭐ Token di tema (HSL) + sfondo decorativo + reduced-motion
│  ├─ test/page.tsx           # Pagina test (monta il wizard)
│  ├─ risultati/page.tsx      # Risultati: async, legge searchParams, noindex (vedi §6)
│  ├─ sitemap.ts robots.ts manifest.ts
├─ components/
│  ├─ ui/                     # Primitive (button, card, badge, progress, radio-group, label)
│  ├─ shared/                 # logo, section, eye-illustration, json-ld
│  ├─ layout/                 # site-header, site-footer (contiene il disclaimer legale)
│  ├─ landing/                # hero, problem, benefits, how-it-works, disclaimer-section
│  ├─ assessment/             # likert-scale, question-step, assessment-wizard (client)
│  └─ results/                # score-gauge (SVG), recommendation-list
├─ data/                      # CONTENUTI tipizzati (modificare qui, non nei componenti)
│  ├─ site.ts                 # nome, claim "La tua vista conta", URL, nav, keyword SEO
│  ├─ questions.ts            # 18 domande + opzioni Likert + etichette domini
│  └─ recommendations.ts      # consigli pratici + getRecommendations()
├─ features/assessment/       # LOGICA di dominio (pura, testabile)
│  ├─ scoring.ts              # SCORE_THRESHOLDS, getResultLevel(), computeAssessment()
│  └─ results-content.ts      # testo dell'esito per livello + getResultContent()
├─ hooks/use-assessment.ts    # hook di stato del wizard (riutilizzabile)
├─ lib/                       # utils.ts (cn) · seo.ts (buildMetadata + JSON-LD)
└─ types/assessment.ts        # ⭐ tipi del dominio: fonte di verità condivisa
```

**Per modificare i TESTI** (riferimento rapido):
| Testo | File |
|---|---|
| Sezioni home | `src/components/landing/*` |
| Header / Footer + disclaimer | `src/components/layout/*` |
| Intro test / pagina risultati | `src/app/test/page.tsx`, `src/app/risultati/page.tsx` |
| Domande, opzioni, domini | `src/data/questions.ts` |
| Consigli | `src/data/recommendations.ts` |
| Esiti per livello | `src/features/assessment/results-content.ts` |
| Nome sito, claim, nav, keyword | `src/data/site.ts` |
| Meta SEO di pagina | il `metadata` in ogni `page.tsx` + default in `src/lib/seo.ts` |

---

## 5. Convenzioni di codice

- **Server Components di default.** Aggiungi `"use client"` SOLO se serve stato/effetti/
  interattività. Oggi sono client: `assessment-wizard`, `likert-scale`, e le primitive
  Radix con hook (`progress`, `radio-group`, `label`).
- **Separazione dati / logica / presentazione.** I contenuti vivono in `data/`, la logica
  in `features/`, la UI nei componenti. Non incollare contenuti di dominio dentro i componenti.
- **Tipi condivisi**: importa da `@/types/assessment`. Tieni allineati dati, scoring e UI.
- **Alias import**: `@/*` → `src/*`.
- **Stile SOLO via token Tailwind** mappati su variabili CSS (es. `bg-background`,
  `text-muted-foreground`, `text-primary`). **Mai colori hex/rgb hardcoded** nei componenti.
  (Unica eccezione: asset SVG standalone in `public/`, es. `og-image.svg`, `icon.svg`,
  che non vedono le variabili CSS.)
- **Varianti dei componenti** con `cva`; unisci le classi con `cn()` (da `lib/utils`).
- **Nomi file** in kebab-case; un componente per file; export nominato.

---

## 6. Regole critiche (NON violare)

1. **Contenuto non diagnostico.** Niente diagnosi, niente promesse mediche, niente
   allarmismo. Il livello "elevato" invita a consultare un professionista. Indirizza alla
   figura giusta: **sintomi/patologia → oculista** (unico che diagnostica);
   **controllo vista/occhiali → ottico/optometrista** (che NON fa diagnosi).
2. **Sobrietà "normativa".** La comunicazione sanitaria in Italia dev'essere informativa,
   non promozionale/suggestiva (vietati "il migliore", sconti, "prenota ora!"). I contenuti
   educativi sono ammessi. Vale soprattutto per la futura pagina/directory professionisti.
3. **Niente dati su server.** Le risposte del test restano nel browser e vengono passate
   alla pagina risultati via query string (`/risultati?s=&d=`). **Non introdurre** chiamate
   di rete che inviino le risposte senza una base privacy esplicita.
4. **Next.js 15 — `searchParams`/`params` sono `Promise`.** Nelle pagine vanno attese:
   `risultati/page.tsx` è `async` e fa `await searchParams`. Non trattarle come oggetti sincroni.
5. **`/risultati` è dinamica e `noindex`.** Esclusa da `sitemap.ts`, in `disallow` su
   `robots.ts`, e con `noIndex: true` nel suo `buildMetadata`. Mantienilo così.
6. **Build "verde".** In `next.config.mjs` ESLint è ignorato durante la build
   (`eslint.ignoreDuringBuilds: true`) per non bloccare la pipeline. Gli **errori di tipo
   TypeScript, invece, FANNO fallire la build**: scrivi tipi corretti.
7. **Accessibilità (WCAG 2.2) come requisito minimo:** focus sempre visibile,
   target ≥ 44px, `prefers-reduced-motion` e `prefers-contrast` rispettati (in `globals.css`),
   skip-link, landmark, `aria-live` e gestione focus nel wizard. Non regredire su questo.

---

## 7. Sistema di design

- **Tutti i colori** sono variabili CSS HSL in `:root` dentro `src/app/globals.css` e
  mappate in `tailwind.config.ts` via `hsl(var(--token))`. Per cambiare tema si modifica
  **solo** quel blocco. Vincoli: nessun bianco/nero puro; sfondo caldo scuro (#1A1816),
  testo crema (#E6DFD3), accento teal; livelli esito = salvia (basso) / ambra (moderato) /
  terracotta (elevato, **mai rosso allarme**).
- **Sfondo decorativo** (in `globals.css`): due livelli fissi dietro al contenuto —
  `body::before` (gradiente radiale morbido) e `body::after` (micro-grana SVG "carta").
  ⚠️ Funzionano perché il **colore base è sull'`html`** e il **`body` è trasparente**
  (`background-color: transparent`). NON rimettere `bg-background` sul `body` nel layout,
  o coprirai i livelli. Variabili di taratura: `--bg-glow`, `--bg-edge`, e `opacity`/
  `background-size` su `body::after`.
- **Elemento distintivo**: il motivo a "iride" (logo, hero, gauge dei risultati).
- **Font Geist** caricato in `layout.tsx` (`geist/font/sans` e `geist/font/mono`), applicato
  via classi `.variable` sull'`<html>`, esposto come `var(--font-geist-sans)` /
  `var(--font-geist-mono)` in Tailwind. È **self-hosted** (nessuna chiamata a Google).
  Per cambiare font mantieni gli stessi nomi di variabile CSS e non dovrai toccare Tailwind.
  NB: evitare `next/font/google` in ambienti di build senza accesso a Google Fonts.

---

## 8. SEO

- Metadata centralizzati in `lib/seo.ts` → `buildMetadata({ title, description, path, noIndex })`.
- JSON-LD: `getWebsiteJsonLd()` (globale, nel layout) e `getAssessmentJsonLd()`
  (`MedicalWebPage` informativa, nella pagina test), iniettati via `<JsonLd>`.
- `metadataBase` da `NEXT_PUBLIC_SITE_URL` (vedi `.env.example`); in assenza, localhost.
- Ogni pagina pubblica esporta il proprio `metadata`. La pagina risultati è `noindex`.

---

## 9. Ricette (come aggiungere/cambiare cose)

**Aggiungere una domanda al test** → in `src/data/questions.ts`, aggiungi un oggetto
all'array `questions`:
```ts
{
  id: "exposure-nuova",          // id stabile e univoco (usato anche come React key)
  text: "Testo della domanda…",
  helper: "Aiuto opzionale.",     // facoltativo
  domain: "exposure",             // exposure | breaks | ergonomics | environment | symptoms | sleep
  direction: "symptom",           // "symptom" (più alto = peggio) | "protective" (invertita nello scoring)
}
```
`totalQuestions` e lo scoring si aggiornano da soli. Le `protective` vengono invertite
(`6 - valore`) in `scoring.ts`.

**Aggiungere un consiglio** → in `src/data/recommendations.ts`, aggiungi a `recommendations`:
```ts
{ id: "...", title: "...", description: "...", domain: "breaks", levels: ["medium", "high"] }
```
`getRecommendations(level, topDomain?)` filtra per livello e mette in cima il dominio critico.

**Cambiare le soglie dell'esito** → `SCORE_THRESHOLDS` in `scoring.ts`
(default: basso `< 34`, moderato `< 67`, elevato `≥ 67`). Il punteggio è normalizzato 0–100.

**Aggiungere una sezione alla landing** → nuovo componente in `src/components/landing/`,
poi includilo in `src/app/page.tsx`. Usa `<Section>` per coerenza (eyebrow/title/description).

**Aggiungere una pagina** → nuova cartella in `src/app/<rotta>/page.tsx`, esporta
`metadata = buildMetadata({ path: "/<rotta>" })`. Se è privata/personale, usa `noIndex: true`
ed escludila da `sitemap.ts` (e valuta `disallow` in `robots.ts`).

---

## 10. Verifica prima di consegnare

1. `npm run typecheck` → 0 errori.
2. `npm run build` → build verde. Controlla che `/risultati` resti dinamica (`ƒ`) e le altre
   statiche (`○`).
3. Smoke test della pagina dinamica (con `npm run start`):
   - `/risultati?s=72&d=symptoms` → esito "elevato" + consigli
   - `/risultati?s=50` → "moderato" · `/risultati?s=10` → "basso"
   - `/risultati` (senza parametri) → invito a fare il test
4. Se hai toccato il wizard: verifica che, cambiando domanda, la selezione **non resti
   "bloccata"** (vedi §11) e che i testi non si sovrappongano.

---

## 11. Gotcha noti (errori già risolti — non reintrodurli)

- **RadioGroup "controllato".** In `likert-scale.tsx` il valore passato a Radix è
  `value !== undefined ? String(value) : ""` (stringa vuota, **non `undefined`**).
  Con `undefined` Radix torna "non controllato" e trattiene la selezione della domanda
  precedente. Inoltre il wizard rimonta la domanda con `key={current.id}`.
- **Niente `<fieldset>`/`<legend>` per la domanda.** Il `<legend>` ha un rendering speciale
  che causava sovrapposizioni di testo. `question-step.tsx` usa un `<div>` + `<h2>`; il
  gruppo è già un `radiogroup` Radix etichettato via `aria-labelledby`.
- **Sfondo decorativo vs `body`.** Vedi §7: il `body` deve restare trasparente.
- **Vulnerabilità npm audit (postcss dentro Next).** È un avviso build-time a rischio reale
  nullo per questo sito. **Non eseguire `npm audit fix --force`**: proporrebbe un downgrade
  di Next a v9 e romperebbe tutto. Eventualmente aggiorna Next nell'ambito della linea 15.

---

## 12. Documentazione di approfondimento

In `docs/`: `ARCHITETTURA.md`, `DESIGN-SYSTEM.md` (palette + contrasti), `WIREFRAME.md`,
`DATABASE.md` (schema logico per l'espansione futura), `ROADMAP.md`. Il `README.md` ha
setup e obiettivi Lighthouse (≥ 95).

*Questo file descrive convenzioni tecniche; non è consulenza legale o medica. Per il modello
a pagamento dei professionisti e l'eventuale persistenza dei dati, prevedere revisione legale
(pubblicità sanitaria) e privacy/GDPR.*
