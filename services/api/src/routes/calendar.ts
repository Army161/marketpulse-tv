import { Router } from 'express';
import type { CalendarResponse } from '@marketpulse/shared';
import { fetchEarningsCalendar } from '../adapters/benzingaCalendar';
import { withCache } from '../lib/cache';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    // Earnings dates change slowly — cache 30 min.
    const earnings = await withCache('calendar:earnings', 1800, fetchEarningsCalendar);
    const body: CalendarResponse = { earnings, updatedAt: new Date().toISOString() };
    res.json(body);
  } catch (err) {
    next(err);
  }
});

export default router;
