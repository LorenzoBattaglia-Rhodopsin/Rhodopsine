# Architettura — Rhodopsine

> Documento di riferimento per sviluppatori. Descrive scelte tecniche,
> struttura del codice e principi di estensione del progetto.

## 1. Obiettivo e vincoli

Rhodopsine è un sito educativo sul **benessere visivo digitale** con uno strumento di
**autovalutazione dell'affaticamento visivo** (Digital Eye Strain / Computer
Vision Syndrome). Vincolo fondamentale e non negoziabile:

> Lo strumento **non fornisce diagnosi** e **non sostituisce** il parere di un
> professionista della visione. Tutti i contenuti sono educativi e preventivi.

Questo principio guida testi, modello dei dati (`MedicalWebPage` informativa,
nessuna proprietà diagnostica), copy dei risultati e disclaimer onnipresente.

## 2. Stack tecnologico

| Ambito        | Scelta                                   | Motivazione |
|---------------|------------------------------------------|-------------|
| Framework     | **Next.js 16** (App Router)              | RSC, routing a file, SEO/metadata API, performance |
| Linguaggio    | **TypeScript** (strict)                  | Sicurezza dei tipi end-to-end |
| Stile         | **TailwindCSS 3.4** + variabili CSS HSL  | Theming centralizzato, zero CSS morto |
| Componenti UI | **shadcn/ui** (stile new-york) scritti a mano su **Radix** | Accessibilità nativa, pieno controllo |
| Icone         | **lucide-react**                         | Coerenti, leggere, tree-shakeable |
| Font          | **Stack di sistema**                     | Zero richieste di rete → LCP ottimo |

### Perché il font di sistema
Niente `next/font/google`: il testo è reso con il font nativo del dispositivo
(San Francisco su Apple, Segoe UI su Windows, Roboto su Android). Questo elimina
una richiesta di rete bloccante e migliora LCP/CLS. È sufficiente modificare
`fontFamily` in `tailwind.config.ts` (e, volendo, aggiungere `next/font`) per
introdurre un font brandizzato in futuro.

## 3. Modello di rendering

- **Server Components di default**: tutte le pagine e la maggior parte dei
  componenti sono RSC (nessun JS inviato al client).
- **Client Components mirati** (`"use client"`): solo dove serve interattività o
  stato — il wizard del test, la scala Likert, la ricerca professionisti
  (`components/nearby/`) e le primitive Radix che usano hook (`progress`,
  `radio-group`, `label`).
- **Codice caricato su richiesta**: la mappa (Leaflet + react-leaflet + CSS) è
  importata con `next/dynamic` e `ssr: false` e montata solo a ricerca
  completata: non pesa sul caricamento di `/risultati` né di `/test`.
- **`/risultati` è dinamica** (server-rendered on demand) perché legge
  `searchParams`. In **Next.js 15** `params`/`searchParams` sono `Promise`:
  la pagina è `async` e usa `await searchParams`.

```
Confine client/server
─────────────────────
app/test/page.tsx (RSC)
  └─ AssessmentWizard ("use client")   ← stato delle risposte, routing
       └─ QuestionStep (RSC-friendly)
            └─ LikertScale ("use client") ← RadioGroup Radix
```

## 4. Struttura delle cartelle

```
src/
├─ app/                      # Routing (App Router)
│  ├─ layout.tsx             # Layout radice: lang, metadata, header/footer, JSON-LD
│  ├─ page.tsx               # Landing
│  ├─ globals.css            # Direttive Tailwind + token di tema (HSL) + reduced-motion
│  ├─ test/page.tsx          # Pagina del test (monta il wizard)
│  ├─ risultati/page.tsx     # Risultati (async, legge searchParams, noindex)
│  ├─ sitemap.ts             # Sitemap (esclude /risultati)
│  ├─ robots.ts              # Robots (disallow /risultati)
│  └─ manifest.ts            # Web App Manifest (PWA di base)
├─ components/
│  ├─ ui/                    # Primitive shadcn/ui (button, card, badge, progress…)
│  ├─ shared/                # Logo, Section, EyeIllustration, JsonLd
│  ├─ layout/                # SiteHeader, SiteFooter (con disclaimer)
│  ├─ landing/               # Hero, Problem, Benefits, HowItWorks, DisclaimerSection
│  ├─ assessment/            # LikertScale, QuestionStep, AssessmentWizard
│  ├─ results/               # ScoreGauge, RecommendationList
│  └─ nearby/                # NearbyProfessionals, ProfessionalList, NearbyMap (on demand)
├─ data/                     # Contenuti tipizzati: site, questions, recommendations
├─ features/assessment/      # Logica di dominio: scoring, results-content
├─ features/nearby/          # Ricerca professionisti: geo, Nominatim, Overpass, hook
├─ hooks/                    # use-assessment (hook riutilizzabile)
├─ lib/                      # utils (cn), seo (metadata + JSON-LD)
└─ types/                    # Tipi del dominio (assessment.ts, nearby.ts)
```

### Principi di organizzazione
- **Separazione dati / logica / presentazione.** Le domande e i consigli vivono
  in `data/`; lo scoring in `features/`; la UI non contiene contenuti hard-coded
  rilevanti per il dominio.
- **Single source of truth.** `data/site.ts` centralizza nome, claim, URL, rotte
  e navigazione. `globals.css` centralizza i colori.
- **Tipi condivisi.** `types/assessment.ts` tiene allineati dati, algoritmo e UI.

## 5. Flusso dell'autovalutazione

1. L'utente apre `/test` → monta `AssessmentWizard` (client).
2. Una domanda per schermata (ottimale su mobile); nessun auto-avanzamento
   (scelta di accessibilità). Lo stato è un `Record<idDomanda, valore>`.
3. Al termine, `computeAssessment(answers)` calcola punteggio e domini.
4. Il wizard naviga a `/risultati?s={0–100}&d={dominio}` (nessun dato lascia il
   browser).
5. `/risultati` (server) valida i parametri, determina il livello, recupera
   contenuto e consigli, e rende il gauge + i suggerimenti.

### Ricerca professionisti nelle vicinanze (privacy by design)

1. Sotto l'esito, `<NearbyProfessionals />` (client) è montato **senza props**:
   non conosce punteggio né dominio.
2. Nessuna richiesta esterna finché l'utente non preme «Usa la mia posizione»
   (Geolocation API, `enableHighAccuracy: false`) o invia un CAP/città
   (Nominatim, solo al submit, max 1 richiesta/s).
3. Le coordinate vengono arrotondate a 2 decimali (~1 km) appena ottenute.
4. Il browser interroga direttamente Overpass API (10 km, 25 km se < 5
   risultati; backoff su 429/50x), calcola le distanze (Haversine) e mostra
   lista + mappa. Le tile arrivano da `tile.openstreetmap.org`.
5. Lo stato vive solo in memoria React: «Cancella ricerca» lo azzera e smonta
   la mappa. Nessuno storage, cookie, URL o evento analytics.
6. `Referrer-Policy: strict-origin-when-cross-origin` → i servizi OSM vedono
   solo l'origine del sito, mai `/risultati?s=…`.

Vedi [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) per la palette e
[DATABASE.md](./DATABASE.md) per lo schema logico previsto per l'espansione.

## 6. SEO

- **Metadata API** centralizzata in `lib/seo.ts` (`buildMetadata`): title,
  description, canonical, Open Graph, Twitter Card.
- **JSON-LD**: `WebSite` (globale, nel layout) e `MedicalWebPage` informativa
  (pagina test). La pagina risultati è esplicitamente `noindex`.
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest` generati a runtime.
- `metadataBase` da `NEXT_PUBLIC_SITE_URL` (vedi `.env.example`).

## 7. Accessibilità (WCAG 2.2)

- Contrasti AA+ verificati (vedi DESIGN-SYSTEM.md).
- Focus sempre visibile (anello su `:focus-visible`).
- Target tattili ≥ 44px (bottoni e righe della scala Likert).
- Skip-link "Vai al contenuto"; landmark `header`/`main`/`footer`.
- Wizard: `fieldset/legend`, `aria-live` sull'avanzamento, gestione del focus
  al cambio domanda.
- `prefers-reduced-motion` rispettato globalmente.

## 8. Performance

- RSC + font di sistema → JS iniziale ridotto (~106 kB First Load condiviso).
- Illustrazioni in **SVG inline** (nessun download di immagini, nitide ovunque).
- Nessuna libreria pesante lato client.
- Target Lighthouse ≥ 95 su tutte le categorie (vedi README).

## 9. Note di build

- ESLint è ignorato in fase di build (`next.config.mjs`) per non bloccare la
  pipeline; gli errori di **tipo**, invece, fanno fallire la build (correttezza).
- Header di sicurezza di base impostati in `next.config.mjs`.
