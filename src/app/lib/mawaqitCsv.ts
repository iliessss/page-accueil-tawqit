import type { CityHit, PrayerDay } from './prayerApi';
import { buildZip } from './zip';

// Même structure que l'export « Calendrier » de Mawaqit (vérifié sur un export
// réel, octobre 2026) : un fichier par mois, 01.csv … 12.csv, en-tête
// `Day,Fajr,Shuruk,Duhr,Asr,Maghrib,Isha`, une ligne par jour, heures HH:MM.
const HEADER = 'Day,Fajr,Shuruk,Duhr,Asr,Maghrib,Isha';

export function monthCsv(days: PrayerDay[]): string {
  // Horaire inexistant (Fajr/Icha d'été aux hautes latitudes) → case vide.
  const cell = (v: string | null) => v ?? '';
  const lines = days.map((d, i) => {
    const t = d.times;
    return [i + 1, t.fajr, t.sunrise, t.dhuhr, t.asr, t.maghrib, t.isha].map((v) => (typeof v === 'number' ? v : cell(v))).join(',');
  });
  return [HEADER, ...lines].join('\n') + '\n';
}

export function mawaqitZip(months: PrayerDay[][]): Blob {
  return buildZip(
    months.map((days, i) => ({ name: `${String(i + 1).padStart(2, '0')}.csv`, content: monthCsv(days) })),
  );
}

export function mawaqitFileName(city: CityHit, year: number): string {
  const slug = city.name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `tawqit-${slug}-${year}-mawaqit.zip`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
