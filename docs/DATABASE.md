# Schema dati logico (per l'espansione futura) — Rhodopsine

> ⚠️ **L'MVP non usa alcun database.** Le risposte del test restano nel browser
> e non vengono inviate ad alcun server. Questo documento descrive uno schema
> **logico** pensato per le evoluzioni previste (area utente, storico, blog,
> newsletter), così da progettare oggi senza vincolare le scelte di domani.

## 1. Principi

- **Privacy by design.** Dati sanitari "soft": minimizzazione, base giuridica
  esplicita (consenso), possibilità di cancellazione. I risultati restano
  **non diagnostici** anche se memorizzati.
- **Domande versionate.** Il questionario evolverà: ogni risposta riferisce la
  *versione* della domanda per mantenere confrontabili gli storici.
- **Append-only sugli esiti.** Un esito è una fotografia nel tempo: non si
  modifica, se ne crea uno nuovo.

## 2. Diagramma (ER semplificato)

```
users ──1:N── assessments ──1:N── answers ──N:1── questions
  │                │                                   │
  │                └──1:1── results                    └──N:1── question_options
  │
  └──1:N── newsletter_subscriptions

articles ──N:1── article_categories        (blog/SEO, indipendente dagli utenti)
```

## 3. Tabelle

### users
| Campo | Tipo | Note |
|------|------|------|
| id | uuid (PK) | |
| email | text, unique | |
| display_name | text, null | |
| locale | text | default `it-IT` |
| created_at | timestamptz | |
| consent_data_at | timestamptz, null | consenso al trattamento |
| deleted_at | timestamptz, null | soft delete |

### question_versions / questions
Per supportare la versione del questionario senza perdere lo storico.
| Campo | Tipo | Note |
|------|------|------|
| id | uuid (PK) | |
| key | text | id stabile (es. `breaks-202020`) |
| version | int | incrementale |
| text | text | |
| helper | text, null | |
| domain | enum | exposure, breaks, ergonomics, environment, symptoms, sleep |
| direction | enum | `symptom` / `protective` |
| is_active | bool | |
| UNIQUE | (key, version) | |

### question_options
| Campo | Tipo | Note |
|------|------|------|
| id | uuid (PK) | |
| value | smallint | 1–5 (Likert) |
| label | text | Mai … Sempre |

(Per l'MVP le opzioni sono fisse e condivise; in DB diventano riga per chiarezza/i18n.)

### assessments
Una sessione di compilazione.
| Campo | Tipo | Note |
|------|------|------|
| id | uuid (PK) | |
| user_id | uuid (FK→users), null | null = utente anonimo |
| questionnaire_version | int | versione usata |
| started_at | timestamptz | |
| completed_at | timestamptz, null | |
| source | text, null | es. `web` |

### answers
| Campo | Tipo | Note |
|------|------|------|
| id | uuid (PK) | |
| assessment_id | uuid (FK→assessments) | |
| question_key | text | + question_version |
| question_version | int | |
| value | smallint | 1–5 |
| UNIQUE | (assessment_id, question_key) | |

### results
Esito calcolato (append-only). Replica i campi di `AssessmentResult`.
| Campo | Tipo | Note |
|------|------|------|
| id | uuid (PK) | |
| assessment_id | uuid (FK→assessments), unique | |
| raw_score | int | |
| max_score | int | |
| normalized | smallint | 0–100 |
| level | enum | low / medium / high |
| top_domain | enum, null | dominio più critico |
| domain_scores | jsonb | `[{domain, normalized}]` |
| algorithm_version | text | versione dello scoring |
| created_at | timestamptz | |

### newsletter_subscriptions
| Campo | Tipo | Note |
|------|------|------|
| id | uuid (PK) | |
| email | text, unique | |
| user_id | uuid (FK→users), null | |
| status | enum | pending / confirmed / unsubscribed |
| confirmed_at | timestamptz, null | double opt-in |
| created_at | timestamptz | |

### articles / article_categories (blog & SEO)
| articles | Tipo | Note |
|------|------|------|
| id | uuid (PK) | |
| slug | text, unique | |
| title | text | |
| excerpt | text | |
| body | text/markdown | |
| category_id | uuid (FK) | |
| author | text | |
| status | enum | draft / published |
| published_at | timestamptz, null | |
| seo_title / seo_description | text, null | override Metadata |

| article_categories | Tipo |
|------|------|
| id | uuid (PK) |
| slug | text, unique |
| name | text |

## 4. Corrispondenza con il codice attuale

Lo schema rispecchia i tipi in `src/types/assessment.ts`:
`AssessmentQuestion` → `questions`, `AssessmentAnswers` → `answers`,
`AssessmentResult`/`DomainScore` → `results`. Migrare a DB significherebbe
sostituire i moduli `data/*.ts` con query, mantenendo invariati i tipi e la
funzione `computeAssessment` (logica pura, già isolata in `features/`).

## 5. Note legali

Memorizzare risposte legate a sintomi visivi può configurare un trattamento di
dati relativi alla salute. Prima di attivare la persistenza: informativa privacy
dedicata, consenso esplicito, cifratura a riposo, retention definita e procedura
di cancellazione. Gli esiti restano **educativi**, mai referti.
