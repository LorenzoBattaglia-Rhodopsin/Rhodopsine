# Wireframe — Rhodopsine

> Schemi a bassa fedeltà delle pagine MVP. Approccio **mobile-first**: a
> sinistra il mobile, a destra il desktop. Le ancore (`#problema`, `#benefici`,
> `#come-funziona`) sono raggiungibili da header (desktop) e footer.

## Struttura comune (tutte le pagine)

```
┌───────────────────────────────────────┐
│ [Rhodopsine ◉]            Il problema  Benefici│  ← Header sticky, blur
│                    Come funziona  [Test]│     (nav nascosta < md)
├───────────────────────────────────────┤
│                                         │
│              CONTENUTO                  │  ← <main id="main">
│                                         │
├───────────────────────────────────────┤
│ [Rhodopsine ◉]  claim            Esplora       │  ← Footer
│                           · Il problema │
│  ▸ AVVERTENZE IMPORTANTI (disclaimer)   │     + DISCLAIMER medico-legale
│  © 2026 Rhodopsine                  │
└───────────────────────────────────────┘
```

## 1. Landing (`/`)

### Mobile
```
┌──────────────────────┐
│  ▸ Benessere visivo  │  eyebrow
│  La tua vista        │  H1 (display)
│  conta.              │
│  Sottotitolo……       │
│  [ Inizia il test → ]│  CTA primaria (≥44px)
│  [ Scopri di più    ]│  CTA secondaria
│  ✓ affidabile ✓ …    │  indicatori
│        ◉             │  iride (SVG, soft-pulse)
├──────────────────────┤
│ #problema            │
│  Il problema in 3    │
│  ┌────┐              │
│  │ 🖥 │ card 1       │  (stack verticale)
│  └────┘              │
│  ┌────┐ card 2       │
│  ┌────┐ card 3       │
│  nota: non diagnosi  │
├──────────────────────┤
│ #benefici            │
│  ┌──┐┌──┐            │  4 card (1 col mobile)
│  ┌──┐┌──┐            │
├──────────────────────┤
│ #come-funziona       │
│  ① rispondi          │
│  ② ottieni l'esito   │
│  ③ applica i consigli│
│  [ Inizia il test → ]│
├──────────────────────┤
│  ⓘ Avvertenza        │  disclaimer-section
└──────────────────────┘
```

### Desktop
```
┌───────────────────────────────────────────────┐
│  ▸ Benessere visivo                             │
│  La tua vista conta.                   ╭───────╮ │
│  Sottotitolo lungo su due righe……      │   ◉   │ │  hero a 2 colonne
│  [ Inizia il test → ]  [ Scopri di più]│ iride │ │
│  ✓ affidabile  ✓ gratuito  ✓ privato   ╰───────╯ │
├───────────────────────────────────────────────┤
│ #problema   ┌─────┐ ┌─────┐ ┌─────┐           │  3 card in riga
├───────────────────────────────────────────────┤
│ #benefici   ┌──┐ ┌──┐ ┌──┐ ┌──┐               │  4 card in riga
├───────────────────────────────────────────────┤
│ #come-funziona   ①────②────③      [ Test → ]  │
├───────────────────────────────────────────────┤
│ ⓘ Avvertenza educativa                          │
└───────────────────────────────────────────────┘
```

## 2. Test (`/test`)

Una domanda per schermata (wizard). Identico tra mobile e desktop, centrato e
con `max-w-2xl`.

```
┌──────────────────────────────┐
│        ▸ Autovalutazione      │
│  Quanto affaticano i tuoi     │  H1
│  occhi gli schermi?           │
│  18 domande · pochi minuti    │
│  (le risposte restano locali) │
│                               │
│  Domanda 3 di 18        17%   │
│  ▓▓▓░░░░░░░░░░░░░░░░░░░  ← Progress (aria)
│  ┌─────────────────────────┐ │
│  │ ▸ PAUSE VISIVE          │ │  dominio (eyebrow)
│  │ "Faccio pause regolari… │ │  legend (fieldset)
│  │  helper opzionale        │ │
│  │  ◯ Mai                   │ │
│  │  ◯ Raramente             │ │  RadioGroup
│  │  ⦿ A volte               │ │  (riga intera tappabile ≥48px)
│  │  ◯ Spesso                │ │
│  │  ◯ Sempre                │ │
│  └─────────────────────────┘ │
│  [← Indietro]      [Avanti →] │  (Avanti disabilitato finché non si risponde)
└──────────────────────────────┘
         │ ultima domanda
        ▼
   [← Indietro]   [Vedi i risultati]
        │  computeAssessment → /risultati?s=..&d=..
        ▼
```

## 3. Risultati (`/risultati?s=&d=`)

### Con punteggio valido
```
┌───────────────────────────────────────────────┐
│  ▸ Risultati                                    │
│   ╭───────╮   [● Affaticamento moderato]        │  badge colore=livello
│   │  50   │   Alcune abitudini possono…  (H1)   │  gauge a iride +
│   │ su100 │   Area che incide di più: Sintomi   │  sintesi (2 col su sm+)
│   ╰───────╯                                     │
│  Paragrafo educativo (mai diagnosi)……           │
│                                                 │
│  Consigli pratici per te                        │
│  ┌───────────┐ ┌───────────┐                    │
│  │[Pause]    │ │[Ergonomia]│   card consigli    │  1 col mobile / 2 col sm+
│  │ titolo    │ │ titolo    │   (ordinati per    │
│  │ testo……   │ │ testo……   │    pertinenza)     │
│  └───────────┘ └───────────┘                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Un promemoria importante                 │   │  riquadro avvertenza
│  │ Non è una diagnosi……                   │   │
│  │ [↺ Ripeti il test]  [Torna alla home]   │   │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

### Senza punteggio (parametri assenti/non validi)
```
┌──────────────────────────────┐
│        ▸ Risultati            │
│  Non abbiamo trovato un       │
│  punteggio da mostrare        │
│  Completa prima il test.      │
│        [ Fai il test → ]      │
└──────────────────────────────┘
```

## Note di interazione

- **Nessun auto-avanzamento** nel wizard: la conferma esplicita ("Avanti")
  è più accessibile e riduce errori.
- Il focus si sposta sull'intestazione della domanda a ogni step (screen reader).
- Colori dei livelli: basso = salvia, moderato = ambra, elevato = terracotta.
