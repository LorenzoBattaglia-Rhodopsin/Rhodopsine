# Roadmap — WELL-BEING-EYE (WBe)

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
