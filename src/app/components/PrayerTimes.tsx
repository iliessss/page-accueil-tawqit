import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Search, LocateFixed, MapPin, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import type { TranslationKey } from '../translations';
import { CityHit, PrayerDay, fetchPrayerDay, nearestCity, searchCities } from '../lib/prayerApi';

const STORAGE_KEY = 'tawqit.city';

const DEFAULT_CITY: CityHit = {
  name: 'Paris',
  country: 'France',
  countryCode: 'FR',
  latitude: 48.85341,
  longitude: 2.3488,
  timezone: 'Europe/Paris',
  population: 2138551,
};

const SUGGESTIONS = ['Paris', 'Roubaix', 'Bruxelles', 'Casablanca', 'Alger', 'Tunis', 'La Mecque'];

const HIJRI_MONTHS = [
  '', 'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Joumada al-Oula', 'Joumada al-Thania',
  'Rajab', 'Chaabane', 'Ramadan', 'Chawwal', 'Dhou al-Qi\'da', 'Dhou al-Hijja',
];

type PrayerKey = keyof PrayerDay['times'];

const ROWS: { key: PrayerKey; label: TranslationKey; isPrayer: boolean }[] = [
  { key: 'fajr', label: 'ptFajr', isPrayer: true },
  { key: 'sunrise', label: 'ptSunrise', isPrayer: false },
  { key: 'dhuhr', label: 'ptDhuhr', isPrayer: true },
  { key: 'asr', label: 'ptAsr', isPrayer: true },
  { key: 'maghrib', label: 'ptMaghrib', isPrayer: true },
  { key: 'isha', label: 'ptIsha', isPrayer: true },
];

function loadSavedCity(): CityHit {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const c = JSON.parse(raw);
      if (typeof c?.latitude === 'number' && typeof c?.timezone === 'string') return c;
    }
  } catch {
    // stockage indisponible (navigation privée…) → ville par défaut
  }
  return DEFAULT_CITY;
}

/** Secondes écoulées depuis minuit dans le fuseau de la ville. */
function secondsOfDayIn(timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get('hour') * 3600 + get('minute') * 60 + get('second');
}

const toSeconds = (hhmm: string): number | null => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm ?? '');
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 : null;
};

function formatCountdown(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function PrayerTimes() {
  const { t, language } = useLanguage();
  const [city, setCity] = useState<CityHit>(loadSavedCity);
  const [day, setDay] = useState<PrayerDay | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<CityHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<TranslationKey | null>(null);
  const [now, setNow] = useState(() => secondsOfDayIn(city.timezone));
  const [reloadKey, setReloadKey] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  // Horaires du jour pour la ville choisie
  useEffect(() => {
    const ctrl = new AbortController();
    setStatus('loading');
    fetchPrayerDay(city, ctrl.signal)
      .then((d) => {
        setDay(d);
        setStatus('ready');
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') setStatus('error');
      });
    return () => ctrl.abort();
  }, [city, reloadKey]);

  // Horloge (fuseau de la ville) ; recharge au changement de jour
  useEffect(() => {
    let prev = -1;
    const tick = () => {
      const s = secondsOfDayIn(city.timezone);
      if (s < prev) setReloadKey((k) => k + 1);
      prev = s;
      setNow(s);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [city.timezone]);

  // Autocomplétion (anti-rebond)
  useEffect(() => {
    if (query.trim().length < 2) {
      setHits([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const id = window.setTimeout(() => {
      searchCities(query)
        .then((r) => {
          if (cancelled) return;
          setHits(r);
          setActive(0);
        })
        .catch(() => !cancelled && setNotice('ptSearchError'))
        .finally(() => !cancelled && setSearching(false));
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [query]);

  // Ferme la liste au clic extérieur
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const selectCity = (c: CityHit) => {
    setCity(c);
    setQuery('');
    setHits([]);
    setOpen(false);
    setNotice(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {
      // ignore
    }
  };

  const pickSuggestion = async (name: string) => {
    try {
      const [first] = await searchCities(name, 1);
      if (first) selectCity(first);
    } catch {
      setNotice('ptSearchError');
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setNotice('ptGeoError');
      return;
    }
    setLocating(true);
    setNotice(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const c = await nearestCity(pos.coords.latitude, pos.coords.longitude);
          if (c) selectCity(c);
        } catch {
          setNotice('ptSearchError');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setNotice('ptGeoError');
      },
      { timeout: 10000, maximumAge: 600000 },
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open && hits[active]) {
      e.preventDefault();
      selectCity(hits[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Prochaine prière + compte à rebours
  const next = useMemo(() => {
    if (!day) return null;
    const prayers = ROWS.filter((r) => r.isPrayer);
    let previous = -1;
    for (const r of prayers) {
      let s = toSeconds(day.times[r.key]);
      if (s === null) continue;
      if (s < previous) s += 86400; // Icha après minuit
      previous = s;
      if (s > now) return { key: r.key, label: r.label, remaining: s - now };
    }
    const fajr = toSeconds(day.times.fajr);
    return fajr === null ? null : { key: 'fajr' as PrayerKey, label: 'ptFajr' as TranslationKey, remaining: fajr + 86400 - now };
  }, [day, now]);

  const gregorian = useMemo(() => {
    const s = new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
      timeZone: city.timezone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
    return s.charAt(0).toUpperCase() + s.slice(1);
    // `day` : recalcule le libellé quand la date change
  }, [language, city.timezone, day]);

  const anglesLabel = useMemo(() => {
    if (!day) return '';
    const deg = (v: number) => `${String(Math.abs(v)).replace('.', language === 'fr' ? ',' : '.')}°`;
    const isha = day.angles.isha !== null ? deg(day.angles.isha) : t('ptIshaAfterMaghrib');
    return `${t('ptFajr')} ${deg(day.angles.fajr)} · ${t('ptIsha')} ${isha}`;
  }, [day, language, t]);

  const listId = 'pt-city-list';

  return (
    <div className="py-24 lg:py-32 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-['CormorantSC-Bold'] text-4xl lg:text-5xl xl:text-6xl text-white mb-6 tracking-wide leading-tight">
            {t('ptTitle')}
          </h2>
          <p className="font-['adobe-devanagari_844'] text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            {t('ptSubtitle')}
          </p>
        </motion.div>

        {/* Recherche */}
        <div className="max-w-2xl mx-auto relative z-20">
          <div className="flex flex-col sm:flex-row gap-3">
            <div ref={boxRef} className="relative flex-1">
              <Search className="absolute z-10 left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
              <input
                type="text"
                role="combobox"
                aria-expanded={open && hits.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-label={t('ptSearchPlaceholder')}
                autoComplete="off"
                value={query}
                placeholder={t('ptSearchPlaceholder')}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                className="w-full h-14 pl-14 pr-12 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white placeholder:text-white/50 font-['adobe-devanagari_844'] text-lg outline-none focus:border-[#F9DACA]/60 transition-colors"
              />
              {searching && (
                <Loader2 className="absolute z-10 right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 animate-spin" />
              )}

              {open && query.trim().length >= 2 && !searching && (
                <ul
                  id={listId}
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#2C2A5A] border border-white/20 shadow-2xl overflow-hidden max-h-80 overflow-y-auto"
                >
                  {hits.length === 0 ? (
                    <li className="px-5 py-4 font-['adobe-devanagari_844'] text-white/60">{t('ptNoResult')}</li>
                  ) : (
                    hits.map((h, i) => (
                      <li
                        key={`${h.name}-${h.latitude}-${h.longitude}`}
                        role="option"
                        aria-selected={i === active}
                        onMouseEnter={() => setActive(i)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectCity(h);
                        }}
                        className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${
                          i === active ? 'bg-white/15' : ''
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-[#F9DACA] shrink-0" />
                        <span className="font-['adobe-devanagari_844'] text-lg text-white truncate">{h.name}</span>
                        <span className="font-['adobe-devanagari_844'] text-white/50 ml-auto shrink-0">{h.country}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={locate}
              disabled={locating}
              className="h-14 px-6 rounded-2xl bg-[#F9DACA] text-[#2C2A5A] font-['CormorantSC-Bold'] text-base flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-xl disabled:opacity-60"
            >
              {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
              {t('ptLocate')}
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {SUGGESTIONS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => pickSuggestion(name)}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/70 hover:text-white hover:bg-white/15 font-['adobe-devanagari_844'] text-base transition-colors"
              >
                {name}
              </button>
            ))}
          </div>

          {notice && (
            <p role="alert" className="mt-4 text-center font-['adobe-devanagari_844'] text-[#F9DACA]">
              {t(notice)}
            </p>
          )}
        </div>

        {/* Carte des horaires */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto mt-10 p-6 sm:p-8 lg:p-10 rounded-3xl bg-white/5 backdrop-blur-xl border-2 border-white/20 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#F9DACA] shrink-0" />
                <h3 className="font-['CormorantSC-Bold'] text-3xl lg:text-4xl text-white tracking-wide">
                  {city.name}
                  <span className="font-['CormorantSC-Regular'] text-white/50 text-2xl lg:text-3xl"> · {city.country}</span>
                </h3>
              </div>
              <p className="font-['adobe-devanagari_844'] text-lg text-white/70 mt-2">
                {gregorian}
                {day && ` — ${day.hijri.day} ${HIJRI_MONTHS[day.hijri.month]} ${day.hijri.year} H`}
              </p>
            </div>

            {status === 'ready' && next && (
              <div className="lg:text-right" aria-live="off">
                <p className="font-['adobe-devanagari_844'] text-white/60 text-base">
                  {t('nextPrayer')} · <span className="text-[#F9DACA]">{t(next.label)}</span>
                </p>
                <p className="font-['CormorantSC-Bold'] text-4xl lg:text-5xl text-white tabular-nums tracking-wider">
                  {formatCountdown(next.remaining)}
                </p>
              </div>
            )}
          </div>

          {status === 'error' ? (
            <div className="text-center py-10">
              <p className="font-['adobe-devanagari_844'] text-lg text-white/70 mb-5">{t('ptLoadError')}</p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="px-6 py-3 rounded-2xl bg-white/20 text-white font-['CormorantSC-Bold'] hover:bg-white/30 transition-colors border border-white/30"
              >
                {t('ptRetry')}
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 transition-opacity ${
                status === 'loading' ? 'opacity-40' : ''
              }`}
              aria-busy={status === 'loading'}
            >
              {ROWS.map((r) => {
                const isNext = status === 'ready' && next?.key === r.key;
                return (
                  <div
                    key={r.key}
                    className={`rounded-2xl px-4 py-5 text-center border-2 transition-colors ${
                      isNext
                        ? 'bg-[#F9DACA] border-[#F9DACA] text-[#2C2A5A] shadow-2xl'
                        : r.isPrayer
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-transparent border-white/10 text-white/70'
                    }`}
                  >
                    <p className="font-['CormorantSC-Medium'] text-lg tracking-wide opacity-80">{t(r.label)}</p>
                    <p className="font-['CormorantSC-Bold'] text-3xl lg:text-4xl tabular-nums mt-1">
                      {day?.times[r.key] || '--:--'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {day && status !== 'error' && (
            <p className="font-['adobe-devanagari_844'] text-base text-white/50 mt-6 text-center leading-relaxed">
              {t('ptMethodNote')} {anglesLabel}
              {day.hanafiAsr && ` · ${t('ptHanafiAsr')}`}
              {day.polar && ` · ${t('ptPolarNote')}`}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
