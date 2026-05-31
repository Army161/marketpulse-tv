import { Router } from 'express';
import type { HealthResponse } from '@marketpulse/shared';
import { config } from '../config';

const router = Router();

router.get('/', (_req, res) => {
  const body: HealthResponse = {
    status: 'ok',
    version: config.version,
    uptime: Math.floor(process.uptime()),
  };
  res.json(body);
});

export default router;
