/// <reference lib="webworker" />
// Base de villes embarquée (GeoNames, villes > 5 000 hab) — même fichier et
// même logique de recherche que l'app mobile (tawqit_flutter/lib/services/city_database.dart).

export interface CityHit {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number;
}

export type CityRequest =
  | { id: number; type: 'search'; query: string; limit?: number }
  | { id: number; type: 'nearest'; latitude: number; longitude: number };

export interface CityResponse {
  id: number;
  hits: CityHit[];
  error?: string;
}

interface City {
  name: string;
  raw: string[];
  keys: string[];
  country: string;
  cc: string;
  lat: number;
  lon: number;
  tz: string;
  pop: number;
}

let cities: City[] | null = null;
let loading: Promise<void> | null = null;

// Minuscule + suppression des accents, apostrophes et tirets
// (« laquila » doit trouver « L'Aquila »).
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .normalize('NFD')
    .replace(/[̀-ͯ'’ʼ`´\-–]/g, '');
}

async function load(): Promise<void> {
  const res = await fetch('/data/cities.json.gz');
  if (!res.ok) throw new Error(`cities ${res.status}`);
  let buf = await res.arrayBuffer();
  const head = new Uint8Array(buf, 0, 2);
  // Selon le serveur, le fichier arrive encore gzippé ou déjà décodé.
  if (head[0] === 0x1f && head[1] === 0x8b) {
    const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
    buf = await new Response(stream).arrayBuffer();
  }
  const obj = JSON.parse(new TextDecoder().decode(buf));
  const tz: string[] = obj.tz;
  const countries: Record<string, string> = obj.countries;
  cities = (obj.cities as any[]).map((c) => {
    const [name, ascii, alts, cc, lat, lon, tzIdx, pop] = c;
    const raw: string[] = [name];
    if (ascii !== name) raw.push(ascii);
    raw.push(...alts);
    return { name, raw, keys: raw.map(norm), country: countries[cc] ?? cc, cc, lat, lon, tz: tz[tzIdx], pop };
  });
}

function toHit(c: City, label: string): CityHit {
  return {
    name: label,
    country: c.country,
    countryCode: c.cc,
    latitude: c.lat,
    longitude: c.lon,
    timezone: c.tz,
    population: c.pop,
  };
}

// Recherche par préfixe (priorité) puis par sous-chaîne ; la base est triée par population.
function search(query: string, limit: number): CityHit[] {
  const q = norm(query.trim());
  if (q.length < 2 || !cities) return [];
  const prefix: CityHit[] = [];
  const contains: CityHit[] = [];
  for (const c of cities) {
    let idx = c.keys.findIndex((k) => k.startsWith(q));
    if (idx !== -1) {
      prefix.push(toHit(c, c.raw[idx]));
      if (prefix.length >= limit) break;
      continue;
    }
    if (contains.length < limit) {
      idx = c.keys.findIndex((k) => k.includes(q));
      if (idx !== -1) contains.push(toHit(c, c.raw[idx]));
    }
  }
  return [...prefix, ...contains].slice(0, limit);
}

function nearest(lat: number, lon: number): CityHit[] {
  if (!cities) return [];
  const cosLat = Math.cos((lat * Math.PI) / 180);
  let best = Infinity;
  let bc: City | null = null;
  for (const c of cities) {
    const dLat = c.lat - lat;
    const dLon = (c.lon - lon) * cosLat;
    const d = dLat * dLat + dLon * dLon;
    if (d < best) {
      best = d;
      bc = c;
    }
  }
  return bc ? [toHit(bc, bc.name)] : [];
}

self.onmessage = async (e: MessageEvent<CityRequest>) => {
  const req = e.data;
  try {
    await (loading ??= load());
    const hits =
      req.type === 'search' ? search(req.query, req.limit ?? 8) : nearest(req.latitude, req.longitude);
    (self as DedicatedWorkerGlobalScope).postMessage({ id: req.id, hits } satisfies CityResponse);
  } catch (err) {
    loading = null;
    (self as DedicatedWorkerGlobalScope).postMessage({ id: req.id, hits: [], error: String(err) } satisfies CityResponse);
  }
};
