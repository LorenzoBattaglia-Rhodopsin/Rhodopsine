# Roadmap — Rhodopsine

> Evoluzione proposta oltre l'MVP. L'architettura attuale è pensata per
> crescere senza riscritture: dati e logica sono già isolati dalla UI.

## Stato attuale (MVP)
- ✅ Landing page (hero, problema, benefici, come funziona, avvertenza).
- ✅ Test di autovalutazione (18 domande, wizard mobile-first, accessibile).
- ✅ Algoritmo di scoring (0–100, livelli, punteggi per dominio).
- ✅ Pagina risultati educativa (gauge + consigli personalizzati leggeri).
- ✅ Disclaimer medico-legale onnipresente (footer + sezioni).
- ✅ SEO (Metadata, JSON-LD, sitemap, robots, manifest), performance, WCAG 2.2.

## Fase 1 — Consolidamento (breve termine)
- **Persistenza locale** della sessione (es. ripresa del test, confronto con
  l'ultimo esito) tramite storage del browser, senza backend.
- **Condivisione dell'esito** via link con parametri (già supportato dalla
  struttura `/risultati?s=&d=`) e immagine social dedicata.
- **Internazionalizzazione (i18n)**: estrarre i testi in file di traduzione;
  l'architettura dei contenuti (`data/`) lo rende diretto.
- **Test automatici**: unit test su `computeAssessment` (casi limite, domande
  protettive), test di accessibilità e end-to-end del flusso.
- **OG image dinamica** per pagina (route handler) al posto dell'SVG statico.

## Fase 2 — Contenuti e SEO (medio termine)
- **Blog/sezione educativa** (schema `articles` già previsto): articoli su
  igiene visiva, ergonomia, luce, sonno; ottimi per SEO long-tail.
- **Schema.org esteso**: `Article`, `FAQPage`, breadcrumb.
- **Nuovi test tematici** (es. ergonomia della postazione, esposizione serale):
  il motore del wizard e lo scoring sono già generici per dominio.
- **Newsletter** con double opt-in (schema `newsletter_subscriptions`).

## Fase 3 — Area utente e backend (lungo termine)
- **Autenticazione** e profilo (schema `users`).
- **Storico e dashboard**: andamento del punteggio nel tempo, per dominio, con
  grafici; tutto restando **non diagnostico**.
- **Database** (vedi DATABASE.md): migrazione di `data/*` a query, mantenendo i
  tipi e la logica pura invariati. Domande **versionate** per confrontare storici.
- **Privacy/compliance**: informativa dedicata, consenso esplicito, cifratura a
  riposo, retention e cancellazione (i dati su sintomi sono sensibili).

## Fase 4 — Approfondimenti (esplorativo)
- **Promemoria** opzionali (es. regola 20-20-20) come PWA con notifiche.
- **Personalizzazione** dei consigli più fine in base ai domini critici e allo
  storico.
- **Collaborazioni** con professionisti della visione per la revisione dei
  contenuti e percorsi di rinvio (sempre come indirizzamento, mai diagnosi).

## Principi che non cambiano
1. **Mai una diagnosi.** Ogni nuova funzione resta educativa/preventiva e
   rimanda al professionista quando serve.
2. **Privacy prima di tutto.** Si introduce persistenza solo con basi legali e
   tutele adeguate.
3. **Accessibilità e performance** come requisiti, non come extra.

---

## Storico revisioni

### Revisione del 2026-07-04 — preparazione roadmap v1.0
Il file `ROADMAP.md` fornito per la roadmap v1.0 coincide integralmente con la
revisione già presente in `docs/`: il contenuto sopra è quindi invariato e non
è stato necessario conservare una copia separata. Il file complementare
`PROMPTS-CLAUDE-CODE.md` **non è stato ricevuto** insieme a questa revisione e
resta da aggiungere quando disponibile.

### Verifica ⚑ del 2026-07-04 (sola ricognizione, nessuna correzione applicata)

**Versioni** (installate, da `npm ls --depth=0`):
- Node **v24.16.0** · npm 11.13.0
- **next 16.2.9** (build con Turbopack) · **react / react-dom 19.2.7** ·
  **typescript 5.9.3** (in `package.json` dichiarato `^5.7.0`)
- Nota: `eslint-config-next` è `^15.1.0`, una major indietro rispetto a Next 16.

**Rotte reali in `src/app`:**
- `/` (landing) · `/test` · `/risultati` (dinamica, noindex)
- `/articoli` + `/articoli/[slug]` — SSG con 3 articoli:
  `regola-20-20-20-funziona-davvero`, `affaticamento-visivo-sintomi-prevenzione`,
  `luce-blu-miti-e-realta`
- `/fonti` · `/timer`
- File convention: `sitemap.ts`, `robots.ts`, `manifest.ts`,
  `opengraph-image.tsx`, `twitter-image.tsx`
- ⚠️ `/articoli`, `/fonti` e `/timer` non compaiono nella mappa di CLAUDE.md §4.

**Esito comandi:**
- `npm run typecheck` → ✅ 0 errori.
- `npm run build` → ✅ verde. Pagine: **○ statiche** `/`, `/_not-found`,
  `/articoli`, `/fonti`, `/test`, `/timer`, `manifest.webmanifest`,
  `robots.txt`, `sitemap.xml`, `opengraph-image`, `twitter-image` ·
  **● SSG** `/articoli/[slug]` (3 percorsi) · **ƒ dinamica** `/risultati`
  (conforme a CLAUDE.md §6.5).

**Presenza / assenza:**
- **Pagine legali dedicate: assenti** (nessuna rotta privacy/cookie/termini e
  nessun link a una policy nel footer). Esiste però il banner **Iubenda** con
  blocco preventivo per GA4 (`components/shared/cookie-consent.tsx`, ID in
  `data/site.ts`) e analytics cookieless Plausible
  (`components/shared/analytics.tsx`).
- **`not-found.tsx` / `error.tsx` / `global-error.tsx`: assenti** (la
  `/_not-found` in build è il default di Next).
- **JSON-LD: presente** — `getWebsiteJsonLd()` iniettato in `app/layout.tsx`
  e `getAssessmentJsonLd()` in `app/test/page.tsx`, entrambi via `<JsonLd>`.
- **Test automatici: assenti** (nessun `*.test.*`/`*.spec.*`, nessun runner
  configurato in `package.json`).
- **Workflow CI: assente** (nessuna cartella `.github/`).

**`/public/silence.wav`:** presente; referenziato da
`src/hooks/use-media-session.ts` (`export const SILENCE_SRC = "/silence.wav"`,
riga 28) e usato in `src/components/timer/timer-provider.tsx` (riga 283) come
`src` dell'elemento `<audio>` che mantiene viva la Media Session del timer
20-20-20 a schermo bloccato.

**`NEXT_PUBLIC_SITE_URL`:**
- `.env.example` → il vecchio dominio del progetto (pre-rebranding)
- Nessun `.env`/`.env.local` presente nel working tree: in build vale il
  fallback nel codice, `src/data/site.ts` riga 17 → il vecchio dominio.
- ⚠️ Divergenza dal rebranding **Rhodopsine**: il dominio configurato è ancora
  quello storico sia negli env di esempio sia nel fallback.
- ✅ **Risolto** (2026-11-19): ovunque `https://rhodopsine.com` (costante
  `SITE_URL` in `src/data/site.ts`). Il vecchio dominio è dismesso e non più
  registrato: nessun redirect da mantenere.

**Divergenze tra lo stato reale e la roadmap sopra:**
- La Fase 2 «Blog/sezione educativa» è **già avviata**: `/articoli` con 3
  articoli SSG, pagina `/fonti`, dati E-E-A-T in `src/data/e-e-a-t.ts`.
- La Fase 4 «Promemoria (regola 20-20-20)» è **parzialmente realizzata**:
  esiste `/timer` con `TimerProvider` e integrazione Media Session.
- La «OG image dinamica» (Fase 1) è **già fatta**: `opengraph-image.tsx` e
  `twitter-image.tsx` generano PNG 1200×630 in build.
- Restano effettivamente aperti dalla Fase 1: **test automatici**, **i18n**,
  **persistenza locale** della sessione. A questi si aggiungono, fuori roadmap:
  workflow CI, pagine `not-found`/`error`, pagine legali dedicate e
  aggiornamento del dominio in `NEXT_PUBLIC_SITE_URL`/`site.ts`.
