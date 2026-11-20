#!/usr/bin/env node
/**
 * ESTRATTO STATICO — ottici e oculisti in Italia da OpenStreetMap
 * --------------------------------------------------------------------------
 * Uso (una volta al mese):  npm run data:professionisti
 *
 * Scarica da Overpass API tutte le attività con:
 *   shop=optician · healthcare=optometrist · healthcare:speciality=ophthalmology
 * dentro i confini italiani, le classifica e scrive un JSON compatto in
 * public/data/professionisti-it.json, servito dal sito come file statico.
 *
 * PERCHÉ: l'istanza pubblica di Overpass è spesso sovraccarica. Con
 * l'estratto il browser dell'utente non interroga più Overpass: scarica dal
 * nostro sito un file identico per tutti (che non rivela la posizione) e
 * filtra per distanza in locale.
 *
 * AFFIDABILITÀ
 * - L'Italia è divisa in riquadri 2°×2°: query leggere, meno timeout.
 * - Per ogni riquadro si provano più istanze Overpass, con backoff.
 *   (Qui viaggiano solo dati pubblici OSM, nessun dato degli utenti.)
 * - Se un riquadro fallisce su tutte le istanze, o il totale è troppo basso,
 *   lo script esce con errore SENZA sovrascrivere il file esistente.
 *
 * LICENZA: i dati OSM sono © OpenStreetMap contributors, ODbL 1.0. Il file
 * generato è un database derivato: resta sotto ODbL con attribuzione.
 */
import { writeFile, rename, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "data", "professionisti-it.json");
/**
 * Schede di dettaglio (orari, telefono, sito, specializzazioni): lette SOLO
 * lato server per generare le pagine /trova-ottici-oculisti/[id]. Non stanno
 * in public/: il browser scarica solo l'elenco leggero qui sopra.
 */
const OUT_DETAILS = path.join(ROOT, "src", "data", "generated", "professionisti-dettagli.json");

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const USER_AGENT = "Rhodopsine-data-script/1.0 (+https://rhodopsine.com)";
const REQUEST_TIMEOUT_MS = 120_000;
const RETRY_DELAYS_MS = [3_000, 8_000];
const PAUSE_BETWEEN_TILES_MS = 1_500;

/** Riquadri che coprono l'Italia (lat 35–48, lon 6–19), passo 2°. */
const TILE = 2;
const LAT = [35, 48];
const LON = [6, 19];

/**
 * Soglia di sicurezza: un estratto completo dell'Italia ha diverse migliaia
 * di attività. Sotto questa cifra qualcosa è andato storto: non si scrive.
 */
const MIN_EXPECTED = 3000;

const OPHTHALMOLOGY = /(^|;)\s*ophthalmology\s*(;|$)/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function tileQuery([s, w, n, e]) {
  const bbox = `(${s},${w},${n},${e})`;
  return `[out:json][timeout:90];
area["ISO3166-1"="IT"]["admin_level"="2"]->.it;
(
  nwr["shop"="optician"](area.it)${bbox};
  nwr["healthcare"="optometrist"](area.it)${bbox};
  nwr["healthcare:speciality"~"(^|;) *ophthalmology *(;|$)"](area.it)${bbox};
);
out center tags;`;
}

async function queryOnce(endpoint, query) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": USER_AGENT,
        accept: "application/json",
      },
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Query interrotta lato server: risposta 200 ma incompleta.
    if (json.remark && /runtime error/i.test(json.remark)) {
      throw new Error(`remark: ${json.remark.slice(0, 80)}`);
    }
    if (!Array.isArray(json.elements)) throw new Error("risposta senza elements");
    return json.elements;
  } finally {
    clearTimeout(timer);
  }
}

/** Prova ogni istanza (con backoff) finché una risponde in modo completo. */
async function queryTile(tile) {
  const query = tileQuery(tile);
  const errors = [];
  for (const endpoint of ENDPOINTS) {
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      try {
        const elements = await queryOnce(endpoint, query);
        return { elements, endpoint };
      } catch (err) {
        errors.push(`${new URL(endpoint).host}: ${err.message ?? err}`);
        const delay = RETRY_DELAYS_MS[attempt];
        if (delay === undefined) break;
        await sleep(delay);
      }
    }
  }
  throw new Error(`riquadro ${tile.join(",")} fallito:\n  ${errors.join("\n  ")}`);
}

/* ---------------------------------------------------------------------- */
/* VALIDAZIONE DEI CAMPI                                                    */
/* I dati OSM li inserisce chiunque: ogni campo è ripulito e validato. Ciò  */
/* che non supera la validazione viene SCARTATO, mai "corretto" o dedotto.  */
/* ---------------------------------------------------------------------- */

/** Testo libero: niente caratteri di controllo o di direzione, spazi normalizzati. */
function cleanText(value, max = 200) {
  if (typeof value !== "string") return "";
  const text = value
    .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? "" : text;
}

/**
 * Sito web: solo http(s), host con dominio valido, niente credenziali.
 * Un dominio senza schema ("www.ottica.it", comune in OSM) riceve
 * "https://": è la stessa interpretazione che ne darebbe il browser.
 */
function cleanWebsite(value) {
  const raw = cleanText(value, 300).split(";")[0].trim();
  if (!raw) return undefined;
  const withScheme = /^https?:\/\//i.test(raw)
    ? raw
    : /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(raw)
      ? `https://${raw}`
      : null;
  if (!withScheme) return undefined;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    if (url.username || url.password) return undefined;
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** Telefoni: solo cifre, "+", spazi e separatori comuni; da 6 a 15 cifre. */
function cleanPhones(...values) {
  const out = [];
  for (const value of values) {
    for (const part of cleanText(value, 200).split(/[;,]/)) {
      const phone = part.trim();
      if (!/^\+?[0-9 ()./-]+$/.test(phone)) continue;
      const digits = phone.replace(/\D/g, "").length;
      if (digits < 6 || digits > 15) continue;
      if (!out.includes(phone)) out.push(phone);
    }
  }
  return out.slice(0, 3);
}

/** Valori multipli separati da ";" (convenzione OSM). */
const splitValues = (value) =>
  cleanText(value, 300)
    .split(";")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

/**
 * Tag che POTREBBERO indicare specializzazioni: servono solo al report
 * stampato a fine script, per decidere la whitelist in modo informato.
 */
const SPECIALITY_TAG_HINT =
  /speciality|optometr|optician|contact|lens|ortho|paediatric|pediatric|low_vision|vision/i;
const tagReport = new Map();
function reportTags(tags) {
  for (const [key, value] of Object.entries(tags)) {
    if (!SPECIALITY_TAG_HINT.test(key) || key.startsWith("contact:")) continue;
    for (const v of splitValues(value)) {
      const k = `${key}=${v}`;
      tagReport.set(k, (tagReport.get(k) ?? 0) + 1);
    }
  }
}

/**
 * WHITELIST delle specializzazioni: SOLO valori espliciti di tag OSM, mai
 * dedotti dal nome dell'attività. Valori non in elenco → ignorati.
 * Per aggiungerne una: controlla il report dei tag e aggiungila qui.
 */
const SPECIALITY_TAGS = {
  "healthcare:speciality": {
    paediatric_ophthalmology: "Oftalmologia pediatrica",
    orthoptics: "Ortottica",
    contact_lenses: "Lenti a contatto",
    orthokeratology: "Ortocheratologia",
    low_vision: "Ipovisione",
  },
};

function specialities(tags) {
  const out = [];
  for (const [key, map] of Object.entries(SPECIALITY_TAGS)) {
    for (const v of splitValues(tags[key])) {
      const label = map[v];
      if (label && !out.includes(label)) out.push(label);
    }
  }
  return out;
}

/** Scheda di dettaglio: solo i campi presenti e validi (chiavi brevi = file leggero). */
function toDetail(tags) {
  const detail = {};
  const hours = cleanText(tags.opening_hours, 300);
  if (hours) detail.h = hours;
  const phones = cleanPhones(tags.phone, tags["contact:phone"]);
  if (phones.length) detail.p = phones;
  const website = cleanWebsite(tags.website ?? tags["contact:website"]);
  if (website) detail.w = website;
  const spec = specialities(tags);
  if (spec.length) detail.s = spec;
  return detail;
}

function toRecord(el) {
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat === undefined || lon === undefined) return null;
  const t = el.tags ?? {};
  const kind = OPHTHALMOLOGY.test(t["healthcare:speciality"] ?? "") ? 1 : 0;
  const street = [cleanText(t["addr:street"], 120), cleanText(t["addr:housenumber"], 20)]
    .filter(Boolean)
    .join(" ");
  const city = [cleanText(t["addr:postcode"], 10), cleanText(t["addr:city"], 80)]
    .filter(Boolean)
    .join(" ");
  const address = [street, city].filter(Boolean).join(", ");
  return [
    `${el.type[0]}${el.id}`, // id stabile: n123 / w456 / r789
    Math.round(lat * 1e5) / 1e5, // 5 decimali ≈ 1 m
    Math.round(lon * 1e5) / 1e5,
    kind, // 1 = oculista, 0 = ottico/optometrista
    cleanText(t.name, 120),
    address,
  ];
}

async function main() {
  const tiles = [];
  for (let s = LAT[0]; s < LAT[1]; s += TILE) {
    for (let w = LON[0]; w < LON[1]; w += TILE) {
      tiles.push([s, w, Math.min(s + TILE, LAT[1]), Math.min(w + TILE, LON[1])]);
    }
  }

  const byId = new Map();
  const details = new Map();
  const used = new Set();
  for (const [i, tile] of tiles.entries()) {
    const { elements, endpoint } = await queryTile(tile);
    used.add(new URL(endpoint).host);
    for (const el of elements) {
      const rec = toRecord(el);
      if (!rec) continue;
      byId.set(rec[0], rec); // i riquadri si toccano: niente doppioni
      details.set(rec[0], toDetail(el.tags ?? {}));
      reportTags(el.tags ?? {});
    }
    console.log(
      `[${String(i + 1).padStart(2)}/${tiles.length}] ${tile.join(",")} → ${elements.length} (tot ${byId.size}) via ${new URL(endpoint).host}`,
    );
    await sleep(PAUSE_BETWEEN_TILES_MS);
  }

  const items = [...byId.values()].sort((a, b) => a[0].localeCompare(b[0]));
  const ophthalmologists = items.filter((r) => r[3] === 1).length;
  if (items.length < MIN_EXPECTED) {
    throw new Error(
      `solo ${items.length} attività (< ${MIN_EXPECTED}): estratto sospetto, file NON aggiornato.`,
    );
  }

  const previous = existsSync(OUT)
    ? JSON.parse(await readFile(OUT, "utf8")).items.length
    : null;

  const dataset = {
    generatedAt: new Date().toISOString(),
    source: "OpenStreetMap via Overpass API",
    attribution: "© OpenStreetMap contributors",
    license: "ODbL 1.0 — https://opendatacommons.org/licenses/odbl/",
    fields: ["id", "lat", "lon", "kind(1=oculista,0=ottico)", "name", "address"],
    items,
  };

  await mkdir(path.dirname(OUT), { recursive: true });
  // Scrittura atomica: o il file nuovo completo, o resta quello vecchio.
  const tmp = `${OUT}.tmp`;
  await writeFile(tmp, JSON.stringify(dataset));
  await rename(tmp, OUT);

  // Schede: solo gli id con almeno un campo in più (gli altri non servono).
  const detailItems = {};
  for (const [id] of items) {
    const d = details.get(id);
    if (d && Object.keys(d).length) detailItems[id] = d;
  }
  const detailDataset = {
    generatedAt: dataset.generatedAt,
    attribution: dataset.attribution,
    license: dataset.license,
    fields: { h: "opening_hours", p: "telefoni", w: "sito web", s: "specializzazioni (whitelist)" },
    items: detailItems,
  };
  await mkdir(path.dirname(OUT_DETAILS), { recursive: true });
  const tmpDetails = `${OUT_DETAILS}.tmp`;
  await writeFile(tmpDetails, JSON.stringify(detailDataset));
  await rename(tmpDetails, OUT_DETAILS);

  const count = (key) => Object.values(detailItems).filter((d) => d[key]).length;
  console.log(
    `\nSchede: orari ${count("h")}, telefono ${count("p")}, sito ${count("w")}, specializzazioni ${count("s")}`,
  );
  console.log("\nReport tag candidati a specializzazione (tag=valore → occorrenze):");
  for (const [k, n] of [...tagReport].sort((a, b) => b[1] - a[1]).slice(0, 60)) {
    console.log(`  ${String(n).padStart(5)}  ${k}`);
  }

  console.log(
    `\nOK: ${items.length} attività (${ophthalmologists} oculisti, ${items.length - ophthalmologists} ottici)` +
      (previous !== null ? ` — prima erano ${previous}` : "") +
      `\nIstanze usate: ${[...used].join(", ")}\nScritto: ${path.relative(ROOT, OUT)}`,
  );
}

main().catch((err) => {
  console.error(`\nERRORE: ${err.message}`);
  process.exit(1);
});
