import type { NextFunction, Request, Response } from 'express';
import type { ApiErrorResponse } from '@marketpulse/shared';
import { ApiError } from '../lib/errors';
import { logger } from '../lib/logger';

/**
 * Global error middleware. Always returns a typed ApiErrorResponse so TV
 * clients can render a consistent error state without parsing free-form text.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    logger.warn('Handled API error', { route: req.path, code: err.code, message: err.message });
    const body: ApiErrorResponse = { error: { code: err.code, message: err.message } };
    res.status(err.status).json(body);
    return;
  }

  logger.error('Unhandled error', { route: req.path, err: String(err) });
  const body: ApiErrorResponse = {
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' },
  };
  res.status(500).json(body);
}

export function notFoundHandler(req: Request, res: Response): void {
  const body: ApiErrorResponse = {
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found.` },
  };
  res.status(404).json(body);
}
