import axios from 'axios';
import type { Stock } from '@marketpulse/shared';
import { config, hasAlpacaCreds } from '../config';
import { Errors } from '../lib/errors';
import { logger } from '../lib/logger';
import { MOCK_STOCKS } from './mockData';

/** Symbols we surface on the dashboard ticker. */
export const DEFAULT_SYMBOLS = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN',
  'META', 'TSLA', 'JPM', 'V', 'INTC',
];

interface AlpacaSnapshotResponse {
  [symbol: string]: {
    latestTrade?: { p: number };
    prevDailyBar?: { c: number };
    dailyBar?: { c: number; v: number };
  };
}

/**
 * Fetch quotes for the given tickers from Alpaca Markets v2 snapshots.
 * Falls back to mock data when credentials are missing so dev/sandbox
 * still renders a populated UI.
 */
export async function fetchStockQuotes(symbols: string[] = DEFAULT_SYMBOLS): Promise<Stock[]> {
  if (!hasAlpacaCreds()) {
    logger.warn('Alpaca credentials missing — returning mock stocks');
    return MOCK_STOCKS.filter((s) => symbols.includes(s.symbol));
  }

  try {
    const url = `${config.alpaca.baseUrl}/v2/stocks/snapshots`;
    const resp = await axios.get<AlpacaSnapshotResponse>(url, {
      params: { symbols: symbols.join(',') },
      headers: {
        'APCA-API-KEY-ID': config.alpaca.apiKey,
        'APCA-API-SECRET-KEY': config.alpaca.secretKey,
      },
      timeout: 8000,
    });

    return symbols
      .map((symbol) => mapSnapshot(symbol, resp.data[symbol]))
      .filter((s): s is Stock => s !== null);
  } catch (err) {
    logger.error('Alpaca fetch failed', { err: String(err) });
    throw Errors.upstream('Alpaca');
  }
}

function mapSnapshot(symbol: string, snap: AlpacaSnapshotResponse[string] | undefined): Stock | null {
  if (!snap?.latestTrade?.p) return null;
  const price = snap.latestTrade.p;
  const prevClose = snap.prevDailyBar?.c ?? snap.dailyBar?.c ?? price;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;
  return {
    symbol,
    price: round2(price),
    change: round2(change),
    changePercent: round2(changePercent),
    volume: snap.dailyBar?.v,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
