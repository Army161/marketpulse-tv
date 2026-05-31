import { Router } from 'express';
import type { CryptoResponse } from '@marketpulse/shared';
import { fetchCoins } from '../adapters/coingecko';
import { withCache } from '../lib/cache';
import { config } from '../config';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = clampInt(req.query.limit, 50, 1, 100);
    const cacheKey = `crypto:${limit}`;
    const coins = await withCache(cacheKey, config.cache.cryptoTtl, () => fetchCoins(limit));
    const body: CryptoResponse = { coins, updatedAt: new Date().toISOString() };
    res.json(body);
  } catch (err) {
    next(err);
  }
});

function clampInt(raw: unknown, fallback: number, min: number, max: number): number {
  const n = typeof raw === 'string' ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

export default router;
