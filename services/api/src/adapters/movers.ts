import type { Mover, Stock } from '@marketpulse/shared';
import { fetchStockQuotes, DEFAULT_SYMBOLS } from './alpaca';
import { deriveMockMovers } from './mockData';
import { hasAlpacaCreds } from '../config';

/**
 * Derive top movers from a stock universe. With Alpaca configured we use the
 * live snapshot list; otherwise we return the mock derivation so the dashboard
 * has something realistic to render.
 */
export async function fetchTopMovers(count = 3): Promise<{ gainers: Mover[]; losers: Mover[] }> {
  if (!hasAlpacaCreds()) return deriveMockMovers();

  const quotes = await fetchStockQuotes(DEFAULT_SYMBOLS);
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);

  return {
    gainers: sorted.slice(0, count).map(toMover),
    losers: sorted.slice(-count).reverse().map(toMover),
  };
}

function toMover(s: Stock): Mover {
  return { symbol: s.symbol, changePercent: s.changePercent, price: s.price, name: s.name };
}
