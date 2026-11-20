import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ProfessionalDetail } from "@/types/nearby";
import { isProfessionalId } from "@/features/nearby/ids";

/**
 * SCHEDE DI DETTAGLIO — SOLO LATO SERVER
 * --------------------------------------------------------------------------
 * Unisce i due file prodotti da `npm run data:professionisti`:
 * - public/data/professionisti-it.json (elenco: nome, tipo, indirizzo, posizione);
 * - src/data/generated/professionisti-dettagli.json (orari, telefono, sito,
 *   specializzazioni — già validati dallo script).
 *
 * Nessun dato degli utenti passa di qui: solo dati pubblici OSM.
 * I file sono inclusi nel bundle server via `outputFileTracingIncludes`
 * (next.config.mjs).
 */
const LIST_FILE = path.join(process.cwd(), "public", "data", "professionisti-it.json");
const DETAILS_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "generated",
  "professionisti-dettagli.json",
);

type ListRecord = [string, number, number, 0 | 1, string, string];

interface RawDetail {
  h?: string;
  p?: string[];
  w?: string;
  s?: string[];
}

const isString = (v: unknown): v is string => typeof v === "string" && v.length > 0;
const stringArray = (v: unknown): string[] | undefined =>
  Array.isArray(v) && v.every(isString) && v.length > 0 ? v : undefined;

/** Difesa in profondità: un sito che non sia http(s) non arriva mai in pagina. */
function safeWebsite(v: unknown): string | undefined {
  if (!isString(v)) return undefined;
  try {
    const url = new URL(v);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

let cache: Promise<Map<string, ProfessionalDetail>> | null = null;

async function loadAll(): Promise<Map<string, ProfessionalDetail>> {
  const [listRaw, detailsRaw] = await Promise.all([
    readFile(LIST_FILE, "utf8"),
    // Il file dei dettagli può mancare (estratto vecchio): le schede
    // mostrano allora solo i campi base.
    readFile(DETAILS_FILE, "utf8").catch(() => null),
  ]);
  const list = JSON.parse(listRaw) as { generatedAt: string; items: ListRecord[] };
  const details = detailsRaw
    ? (JSON.parse(detailsRaw) as { items: Record<string, RawDetail> }).items
    : {};

  const map = new Map<string, ProfessionalDetail>();
  for (const [id, lat, lon, k, name, address] of list.items) {
    if (!isProfessionalId(id) || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const d = Object.prototype.hasOwnProperty.call(details, id) ? details[id] : undefined;
    map.set(id, {
      id,
      name: isString(name) ? name : "",
      kind: k === 1 ? "ophthalmologist" : "optician",
      address: isString(address) ? address : undefined,
      position: { lat, lon },
      openingHours: isString(d?.h) ? d.h : undefined,
      phones: stringArray(d?.p),
      website: safeWebsite(d?.w),
      specialities: stringArray(d?.s),
      dataDate: list.generatedAt,
    });
  }
  return map;
}

/** Scheda per id; `null` se l'id non è valido o non esiste nell'estratto. */
export async function getProfessionalDetail(id: string): Promise<ProfessionalDetail | null> {
  if (!isProfessionalId(id)) return null;
  if (!cache) {
    cache = loadAll().catch((err) => {
      cache = null;
      throw err;
    });
  }
  return (await cache).get(id) ?? null;
}
