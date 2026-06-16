import axios from 'axios';
import type { Stock } from '@marketpulse/shared';
import { config, hasAlpacaCreds } from '../config';
import { logger } from '../lib/logger';
import { MOCK_STOCKS } from './mockData';

/** Top-40 tickers surfaced on the ticker, stocks screen, and movers. */
export const DEFAULT_SYMBOLS = [
  // Mega-cap tech
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'AMD', 'INTC', 'CSCO',
  // Finance
  'JPM', 'BAC', 'V', 'MA', 'GS',
  // Consumer / retail
  'WMT', 'AMZN', 'DIS', 'NFLX', 'KO',
  // Energy / industrials
  'XOM', 'CVX', 'BA', 'CAT', 'GE',
  // Healthcare
  'PFE', 'JNJ', 'UNH', 'MRNA', 'ABBV',
  // High-beta / growth
  'PLTR', 'COIN', 'SQ', 'UBER', 'SPOT',
  // Meme / retail favorites
  'GME', 'AMC', 'RIVN', 'HOOD', 'SOFI',
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
    // Graceful degradation: a 401 (expired/invalid keys) or any upstream failure
    // returns mock data instead of an empty UI. Better to show illustrative prices
    // than empty Gainers/Losers panels on Home and a blank Stocks screen.
    logger.error('Alpaca fetch failed — returning mock stocks', { err: String(err) });
    return MOCK_STOCKS.filter((s) => symbols.includes(s.symbol));
  }
}

function mapSnapshot(symbol: string, snap: AlpacaSnapshotResponse[string] | undefined): Stock | null {
  if (!snap) return null;
  // Use latestTrade when available (market hours); fall back to dailyBar close
  // so the stocks screen stays populated on weekends and outside market hours.
  const price = snap.latestTrade?.p ?? snap.dailyBar?.c ?? snap.prevDailyBar?.c;
  if (!price) return null;
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
