# Rhodopsin — “La tua vista conta”

Sito educativo sul **benessere visivo digitale** con uno strumento di
**autovalutazione dell'affaticamento visivo** (Digital Eye Strain / Computer
Vision Syndrome).

> **Importante:** lo strumento è **educativo e preventivo**. Non fornisce
> diagnosi e non sostituisce il parere di un professionista della visione.

Costruito con **Next.js 15 (App Router)**, **TypeScript**, **TailwindCSS** e
componenti in stile **shadcn/ui** su **Radix**. Mobile-first, accessibile
(WCAG 2.2), con SEO e dati strutturati Schema.org.

---

## Requisiti
- **Node.js ≥ 18.18** (consigliato 20+)
- npm (o pnpm/yarn)

## Avvio rapido
```bash
npm install
npm run dev        # http://localhost:3000
```

## Build di produzione
```bash
npm run build
npm run start      # avvia il server di produzione
```

## Script disponibili
| Script | Azione |
|--------|--------|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build di produzione |
| `npm run start` | Avvia la build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Controllo dei tipi TypeScript |

## Variabili d'ambiente
Copia `.env.example` in `.env.local` e imposta l'URL pubblico (usato per
canonical, Open Graph, sitemap):
```
NEXT_PUBLIC_SITE_URL=https://www.esempio.it
```
In assenza, viene usato `http://localhost:3000`.

---

## Struttura del progetto
```
rhodopsin/
├─ src/
│  ├─ app/                  # Routing (App Router)
│  │  ├─ layout.tsx         # Layout radice: lang, metadata, header/footer, JSON-LD
│  │  ├─ page.tsx           # Landing
│  │  ├─ globals.css        # Token di tema (HSL) + base + reduced-motion
│  │  ├─ test/page.tsx      # Pagina del test
│  │  ├─ risultati/page.tsx # Risultati (async searchParams, noindex)
│  │  ├─ sitemap.ts · robots.ts · manifest.ts
│  ├─ components/
│  │  ├─ ui/                # button, card, badge, progress, radio-group, label
│  │  ├─ shared/            # logo, section, eye-illustration, json-ld
│  │  ├─ layout/            # site-header, site-footer (disclaimer)
│  │  ├─ landing/           # hero, problem, benefits, how-it-works, disclaimer-section
│  │  ├─ assessment/        # likert-scale, question-step, assessment-wizard
│  │  └─ results/           # score-gauge, recommendation-list
│  ├─ data/                 # site.ts, questions.ts (18 domande), recommendations.ts
│  ├─ features/assessment/  # scoring.ts (algoritmo), results-content.ts
│  ├─ hooks/                # use-assessment.ts
│  ├─ lib/                  # utils.ts (cn), seo.ts (metadata + JSON-LD)
│  └─ types/                # assessment.ts (tipi del dominio)
├─ public/                  # og-image.svg, icon.svg
├─ docs/                    # ARCHITETTURA, DESIGN-SYSTEM, WIREFRAME, DATABASE, ROADMAP
├─ tailwind.config.ts · next.config.mjs · tsconfig.json · components.json
└─ package.json
```

## Documentazione
- [`docs/ARCHITETTURA.md`](./docs/ARCHITETTURA.md) — scelte tecniche e struttura
- [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md) — palette, hex, contrasti, tipografia
- [`docs/WIREFRAME.md`](./docs/WIREFRAME.md) — wireframe ASCII delle pagine
- [`docs/DATABASE.md`](./docs/DATABASE.md) — schema logico per l'espansione
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — evoluzione del prodotto

---

## Funzionalità (MVP)
- **Landing** con narrazione tesi → problema → benefici → come funziona → avvertenza.
- **Test** a 18 domande su scala Likert 1–5, una per schermata (wizard).
- **Scoring** 0–100 con livelli (basso/moderato/elevato) e punteggi per dominio;
  consigli pratici ordinati per pertinenza. **Nessuna diagnosi.**
- **Disclaimer medico-legale** sempre presente.

### Privacy
Le risposte del test restano **nel browser**: non vengono inviate ad alcun
server né memorizzate.

## Accessibilità (WCAG 2.2)
Contrasti AA+ verificati, focus visibile, target ≥44px, skip-link, landmark,
`fieldset/legend` e `aria-live` nel wizard, `prefers-reduced-motion` rispettato.

## Performance & SEO
- Server Components + font di sistema → JS iniziale ridotto.
- Illustrazioni in SVG inline (zero download di immagini).
- Metadata API, JSON-LD (`WebSite`, `MedicalWebPage`), `sitemap.xml`,
  `robots.txt`, `manifest.webmanifest`.

### Target Lighthouse
Obiettivo **≥ 95** su Performance, Accessibilità, Best Practices e SEO.
Verificare con:
```bash
npm run build && npm run start
# poi Lighthouse (Chrome DevTools) su http://localhost:3000
```

---

## Note tecniche
- **Next.js 15**: in `/risultati`, `searchParams` è una `Promise` e viene atteso
  (`await`) in un Server Component asincrono.
- **Font**: stack di sistema per LCP ottimale; sostituibile in `tailwind.config.ts`.
- **Tema**: tutti i colori sono variabili CSS in `globals.css`; cambiarli aggiorna
  l'intero sito senza toccare i componenti.
- In build ESLint è ignorato per non bloccare la pipeline; gli errori di tipo,
  invece, fanno fallire la build.
