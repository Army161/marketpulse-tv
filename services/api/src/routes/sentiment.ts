import { Router } from 'express';
import type { SentimentResponse } from '@marketpulse/shared';
import { fetchFearGreed } from '../adapters/sentiment';
import { withCache } from '../lib/cache';
import { config } from '../config';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    // F&G updates daily; the news TTL (5min) is plenty fresh and protects the
    // upstream from per-TV hammering.
    const primary = await withCache('sentiment:fng', config.cache.newsTtl, fetchFearGreed);
    const body: SentimentResponse = {
      primary,
      gauges: [primary],
      updatedAt: new Date().toISOString(),
    };
    res.json(body);
  } catch (err) {
    next(err);
  }
});

export default router;
