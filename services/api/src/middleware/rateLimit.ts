import rateLimit from 'express-rate-limit';
import { config } from '../config';

/**
 * Per-IP rate limiter. Defaults to 120 req/min — easily enough for a TV that
 * refreshes panels every 30s but stops scrapers and runaway clients.
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { code: 'RATE_LIMITED', message: 'Too many requests, please slow down.' },
  },
});
