# Rhodopsine

Sito educativo sull'affaticamento visivo da schermi (Digital Eye Strain). Contiene un
questionario di autovalutazione a 18 domande, un timer per la regola 20-20-20 e alcune
pagine di approfondimento con le fonti citate.

Il questionario ha scopo solo informativo: non fa diagnosi e non sostituisce una visita
da un oculista o un controllo da un ottico/optometrista.

[Inserire screenshot qui]

Demo: [Link demo]

## Stack

- Next.js 16 (App Router), React 19, TypeScript 5.7 in modalità strict
- Tailwind CSS 3.4 con variabili CSS HSL per i colori del tema
- Componenti in stile shadcn/ui costruiti su Radix UI (`slot`, `radio-group`, `progress`, `label`)
- `class-variance-authority`, `clsx`, `tailwind-merge` per le varianti dei componenti
- Icone `lucide-react`, font Geist (pacchetto npm `geist`, self-hosted)
- ESLint 9 (flat config) con `eslint-config-next`

Non ci sono database, API o backend: tutto il sito è generato da Next.js e la logica
del test gira nel browser.

## Funzionalità

- **Questionario** su scala Likert 1–5, una domanda per schermata, divise in sei aree
  (esposizione, pause, ergonomia, ambiente, sintomi, sonno).
- **Punteggio** normalizzato 0–100 con tre livelli (basso, moderato, elevato) e
  individuazione dell'area più critica.
- **Pagina risultati** con consigli pratici filtrati per livello e ordinati in base
  all'area critica. Per il livello elevato rimanda a un professionista.
- **Timer 20-20-20**: stato condiviso tra header e pagina `/timer`, persistito in
  `localStorage` (sopravvive al refresh e si sincronizza tra schede), notifiche di
  sistema opzionali, segnale sonoro e controlli dalla schermata di blocco tramite
  Media Session API (con alcuni accorgimenti specifici per iOS).
- **Articoli** (`/articoli`) generati staticamente da `src/data/articles.ts`.
  Al momento sono tre testi di partenza.
- **Fonti** (`/fonti`): elenco dei riferimenti scientifici usati nei contenuti.
- **SEO**: metadata per pagina, JSON-LD (`Organization`, `WebSite`, `MedicalWebPage`),
  sitemap, robots, manifest e immagine Open Graph generata in build.
- **Statistiche opzionali** con Plausible (cookieless). Se la variabile d'ambiente non
  è impostata, non viene caricato nessuno script. Il sito non usa cookie.

## Avvio in locale

Requisiti: **Node.js 20.9 o superiore** (richiesto da Next.js 16) e npm.

```bash
git clone https://github.com/Pollozzz/Rhodopsine.git
cd Rhodopsine
npm install
cp .env.example .env.local
npm run dev
```

Il sito è su http://localhost:3000. Non servono migrazioni né seed.

### Variabili d'ambiente

Sono tutte opzionali in sviluppo.

| Variabile | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pubblico, usato per canonical, Open Graph e sitemap. In locale si può mettere `http://localhost:3000`. Se manca, si usa il dominio di produzione. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Token di Google Search Console (solo il valore del `content`). Se vuoto, il meta tag non viene emesso. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Dominio registrato su Plausible. Se vuoto, nessun analytics. |

### Script

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build di produzione |
| `npm run start` | Avvia la build di produzione |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

Prima di un deploy conviene lanciare `npm run typecheck && npm run build`.

## Struttura

```
src/
├─ app/                  rotte (home, test, risultati, timer, articoli, fonti) + sitemap/robots/manifest/OG
├─ components/           ui/ (primitive), layout/, landing/, assessment/, results/, timer/, articles/, shared/
├─ data/                 contenuti tipizzati: domande, consigli, articoli, fonti, configurazione sito
├─ features/assessment/  scoring e testi degli esiti
├─ hooks/                stato del wizard, macchina a stati del timer, notifiche, suono, Media Session
├─ lib/                  utility e helper SEO
└─ types/                tipi condivisi del dominio
```

I testi stanno in `src/data/` e in `src/features/assessment/results-content.ts`, non nei
componenti: per cambiare una domanda o un consiglio di solito basta toccare un file lì.

## Note tecniche

- **Nessun dato inviato a server.** Al termine del test il browser calcola il punteggio e
  passa alla pagina risultati solo il valore finale e l'area critica in query string
  (`/risultati?s=72&d=symptoms`). Le singole risposte non lasciano il dispositivo.
- **`/risultati` è l'unica pagina dinamica.** Legge `searchParams` (che in Next.js 15+ è
  una `Promise`), è marcata `noindex`, esclusa dalla sitemap e in `disallow` su
  `robots.txt`. Tutte le altre pagine sono statiche.
- **Scoring.** Le domande sono `symptom` (valore alto = peggio) o `protective` (invertite
  con `6 - valore`). La somma viene normalizzata su 0–100; le soglie dei livelli sono in
  `SCORE_THRESHOLDS` (`src/features/assessment/scoring.ts`).
- **Timer.** Un unico `TimerProvider` nel layout radice contiene la macchina a stati,
  così header e pagina `/timer` non creano due timer separati. Il tempo rimanente si
  ricalcola da un timestamp di scadenza, non contando i tick, per restare corretto
  quando la scheda è in background.
- **Tema.** Tutti i colori sono variabili HSL in `src/app/globals.css`, mappate in
  `tailwind.config.ts`. Il colore di base sta su `<html>` e il `<body>` è trasparente
  per lasciare visibili i due livelli decorativi di sfondo (`body::before`/`::after`).
- **Accessibilità.** Focus visibile, target da almeno 44px, skip-link, `aria-live` e
  gestione del focus nel wizard, rispetto di `prefers-reduced-motion` e
  `prefers-contrast`.
- **Build.** ESLint non blocca `next build` (va lanciato a parte); gli errori TypeScript sì.

Documentazione più dettagliata in [`docs/`](./docs): architettura, design system,
wireframe, schema dati per eventuali sviluppi futuri e roadmap.

## Licenza

[Specificare la licenza]
