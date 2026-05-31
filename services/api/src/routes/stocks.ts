import { Router } from 'express';
import type { StocksResponse } from '@marketpulse/shared';
import { fetchStockQuotes, DEFAULT_SYMBOLS } from '../adapters/alpaca';
import { withCache } from '../lib/cache';
import { config } from '../config';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const symbols = parseSymbols(req.query.symbols);
    const cacheKey = `stocks:${symbols.join(',')}`;

    const tickers = await withCache(cacheKey, config.cache.stocksTtl, () => fetchStockQuotes(symbols));
    const body: StocksResponse = { tickers, updatedAt: new Date().toISOString() };
    res.json(body);
  } catch (err) {
    next(err);
  }
});

function parseSymbols(raw: unknown): string[] {
  if (typeof raw !== 'string' || raw.trim() === '') return DEFAULT_SYMBOLS;
  return raw
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 25);
}

export default router;
