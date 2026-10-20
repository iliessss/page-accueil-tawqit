import type { CityHit, CityRequest, CityResponse } from './cityWorker';

export type { CityHit };

// ---------- Villes (worker) ----------

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, (r: CityResponse) => void>();

function cityWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./cityWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<CityResponse>) => {
      pending.get(e.data.id)?.(e.data);
      pending.delete(e.data.id);
    };
  }
  return worker;
}

type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never;

function ask(req: DistributiveOmit<CityRequest, 'id'>): Promise<CityHit[]> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, (r) => (r.error ? reject(new Error(r.error)) : resolve(r.hits)));
    cityWorker().postMessage({ ...req, id });
  });
}

export const searchCities = (query: string, limit = 8) => ask({ type: 'search', query, limit });

export const nearestCity = async (latitude: number, longitude: number) =>
  (await ask({ type: 'nearest', latitude, longitude }))[0] ?? null;

// ---------- Angles officiels par pays ----------
// Port de tawqit_flutter/lib/models/country_angles.dart. Hors de cette table :
// modèle Tawqit par défaut (18° / 17°). Toute modification doit être reportée des deux côtés.

interface CountryAngles {
  fajr: number;
  isha: number | null;
  ishaMinutesAfterMaghrib?: number;
}

const COUNTRY_ANGLES: Record<string, CountryAngles> = {
  MA: { fajr: -19, isha: -17 },
  TN: { fajr: -18, isha: -18 },
  LY: { fajr: -18, isha: -18 },
  EG: { fajr: -19.5, isha: -17.5 },
  SN: { fajr: -19, isha: -17 },
  GN: { fajr: -18, isha: -18 },
  NG: { fajr: -18, isha: -16 },
  BA: { fajr: -18, isha: -16 },
  LB: { fajr: -18, isha: -18 },
  SY: { fajr: -18.5, isha: -17.5 },
  PS: { fajr: -18, isha: -18 },
  JO: { fajr: -18, isha: -18 },
  KW: { fajr: -18, isha: -17.5 },
  SA: { fajr: -18.5, isha: null, ishaMinutesAfterMaghrib: 90 },
  YE: { fajr: -18, isha: -16 },
  QA: { fajr: -18, isha: -18 },
  OM: { fajr: -18, isha: -18 },
  AE: { fajr: -18, isha: -18 },
  PK: { fajr: -18, isha: -18 },
  IN: { fajr: -18, isha: -18 },
  BD: { fajr: -18, isha: -18 },
  AF: { fajr: -18, isha: -18 },
  KG: { fajr: -18, isha: -16 },
  MY: { fajr: -20, isha: -18 },
  ID: { fajr: -20, isha: -18 },
  BN: { fajr: -20, isha: -18 },
};

// Pays où l'avis hanafite (ombre double) s'applique d'office pour le Asr.
const HANAFI_ASR = new Set(['IN', 'PK', 'BD', 'TR', 'RE', 'MU', 'AF', 'ZA']);

const DEFAULT_ANGLES: CountryAngles = { fajr: -18, isha: -17 };

// ---------- API Tawqit ----------

export interface PrayerDay {
  date: string;
  hijri: { day: number; month: number; year: number };
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  hanafiAsr: boolean;
  angles: { fajr: number; isha: number | null; ishaMinutesAfterMaghrib?: number };
  polar: boolean;
}

/** Date du jour (YYYY-MM-DD) dans le fuseau de la ville — le serveur tourne en UTC. */
export function todayIn(timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Heure courante « HH:MM » dans le fuseau de la ville. */
export function nowIn(timezone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date());
}

function buildParams(city: CityHit, date: string): URLSearchParams {
  const angles = COUNTRY_ANGLES[city.countryCode] ?? DEFAULT_ANGLES;
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    timezone: city.timezone,
    date,
    fajrAngle: String(angles.fajr),
    // Règles des hautes latitudes = défauts de l'app mobile (app_state.dart) :
    // sans elles l'API renvoie un Fajr/Icha vide à Paris en juin (18° jamais atteint).
    polarRule: 'astronomicalMiddleNight',
    polarRuleHorizon: 'nearestCity',
    polarNightRule: 'noonForSunriseAsrMaghrib',
  });
  if (angles.isha !== null) params.set('ishaAngle', String(angles.isha));
  if (angles.ishaMinutesAfterMaghrib) {
    params.set('ishaMinutesAfterMaghrib', String(angles.ishaMinutesAfterMaghrib));
  }
  return params;
}

async function fetchDate(city: CityHit, date: string, signal?: AbortSignal): Promise<PrayerDay> {
  const angles = COUNTRY_ANGLES[city.countryCode] ?? DEFAULT_ANGLES;
  const hanafiAsr = HANAFI_ASR.has(city.countryCode);

  const res = await fetch(`/api/prayer-times?${buildParams(city, date)}`, { signal });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  const t = json.times;

  return {
    date: json.date,
    hijri: json.hijri,
    times: {
      fajr: t.fajr,
      sunrise: t.sunrise,
      dhuhr: t.dhuhr,
      asr: hanafiAsr ? t.asr2x : t.asr1x,
      maghrib: t.maghrib,
      isha: t.isha,
    },
    hanafiAsr,
    angles,
    polar: Boolean(t.polarFajr || t.polarIsha),
  };
}

export function fetchPrayerDay(city: CityHit, signal?: AbortSignal): Promise<PrayerDay> {
  return fetchDate(city, todayIn(city.timezone), signal);
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Toute une année, jour par jour (l'API ne calcule qu'une date à la fois).
 * Requêtes par lots pour ne pas saturer l'API ; `onProgress` reçoit 0..1.
 */
export async function fetchPrayerYear(
  city: CityHit,
  year: number,
  onProgress?: (ratio: number) => void,
  signal?: AbortSignal,
): Promise<PrayerDay[][]> {
  const dates: { m: number; d: number; iso: string }[] = [];
  for (let m = 1; m <= 12; m++) {
    const days = new Date(year, m, 0).getDate();
    for (let d = 1; d <= days; d++) dates.push({ m, d, iso: `${year}-${pad2(m)}-${pad2(d)}` });
  }

  const months: PrayerDay[][] = Array.from({ length: 12 }, () => []);
  let done = 0;
  const CONCURRENCY = 12;
  let next = 0;
  const worker = async () => {
    while (next < dates.length) {
      const i = next++;
      const { m, iso } = dates[i];
      months[m - 1][dates[i].d - 1] = await fetchDate(city, iso, signal);
      onProgress?.(++done / dates.length);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return months;
}
