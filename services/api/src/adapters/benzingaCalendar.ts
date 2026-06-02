import axios from 'axios';
import type { EarningsEvent } from '@marketpulse/shared';
import { config, hasBenzinga } from '../config';
import { logger } from '../lib/logger';
import { DEFAULT_SYMBOLS } from './alpaca';

/**
 * Benzinga Earnings Calendar adapter.
 *
 * We query earnings for the same 20 tickers the app already tracks, across a
 * window (recent past → near future), so the Calendar page is always populated
 * and relevant to what's on the ticker. Sorted with upcoming reports first.
 *
 * Docs: GET /api/v2.1/calendar/earnings  →  { earnings: [...] }
 */

interface BzEarning {
  date: string;
  ticker: string;
  name: string;
  time?: string;
  exchange?: string;
  eps?: string;
  eps_est?: string;
  eps_surprise_percent?: string;
}

export async function fetchEarningsCalendar(): Promise<EarningsEvent[]> {
  if (!hasBenzinga()) return [];

  const today = new Date();
  const from = isoDate(addDays(today, -21));
  const to = isoDate(addDays(today, 60));
  const todayStr = isoDate(today);

  try {
    const resp = await axios.get<{ earnings?: BzEarning[] }>(
      `${config.benzinga.baseUrl}/api/v2.1/calendar/earnings`,
      {
        params: {
          token: config.benzinga.apiKey,
          'parameters[date_from]': from,
          'parameters[date_to]': to,
          'parameters[tickers]': DEFAULT_SYMBOLS.join(','),
          pagesize: 100,
        },
        headers: { accept: 'application/json' },
        timeout: 8000,
      },
    );

    const rows = resp.data.earnings ?? [];
    const events = rows.map((r) => mapEvent(r, todayStr));

    // Sort: upcoming first (ascending date), then past (descending date).
    events.sort((a, b) => {
      if (a.upcoming !== b.upcoming) return a.upcoming ? -1 : 1;
      return a.upcoming ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });

    return events.slice(0, 40);
  } catch (err) {
    logger.warn('Benzinga earnings calendar failed', { err: String(err) });
    return [];
  }
}

function mapEvent(r: BzEarning, todayStr: string): EarningsEvent {
  const surprise = r.eps_surprise_percent ? parseFloat(r.eps_surprise_percent) : undefined;
  return {
    date: r.date,
    ticker: r.ticker,
    company: r.name,
    time: prettyTime(r.time),
    exchange: r.exchange,
    epsEst: emptyToUndef(r.eps_est),
    epsActual: emptyToUndef(r.eps),
    surprisePct: Number.isFinite(surprise) ? surprise : undefined,
    upcoming: r.date >= todayStr,
  };
}

function prettyTime(t?: string): string | undefined {
  if (!t) return undefined;
  // Benzinga gives "16:30:00"; classify into BMO/AMC for TV legibility.
  const hh = parseInt(t.slice(0, 2), 10);
  if (!Number.isFinite(hh)) return t;
  return hh < 12 ? 'Before Open' : 'After Close';
}

function emptyToUndef(s?: string): string | undefined {
  if (!s || s.trim() === '') return undefined;
  return s;
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
