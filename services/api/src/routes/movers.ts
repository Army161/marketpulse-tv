import { Router } from 'express';
import type { MoversResponse } from '@marketpulse/shared';
import { fetchTopMovers } from '../adapters/movers';
import { withCache } from '../lib/cache';
import { config } from '../config';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await withCache('movers:3', config.cache.moversTtl, () => fetchTopMovers(3));
    const body: MoversResponse = { ...result, updatedAt: new Date().toISOString() };
    res.json(body);
  } catch (err) {
    next(err);
  }
});

export default router;
