import axios from 'axios';
import type { Sentiment, SentimentLabel } from '@marketpulse/shared';
import { logger } from '../lib/logger';

/**
 * Crypto Fear & Greed Index from Alternative.me — free, no API key, commercial
 * use allowed with attribution. Endpoint: https://api.alternative.me/fng/
 *
 * Falls back to a neutral mock reading on failure so the gauge always renders.
 */

interface FngResponse {
  data: Array<{ value: string; value_classification: string; timestamp: string }>;
}

const MOCK: Sentiment = {
  source: 'Alternative.me',
  value: 50,
  label: 'Neutral',
  timestamp: new Date().toISOString(),
};

export async function fetchFearGreed(): Promise<Sentiment> {
  try {
    const resp = await axios.get<FngResponse>('https://api.alternative.me/fng/', {
      params: { limit: 1 },
      timeout: 6000,
    });
    const row = resp.data.data?.[0];
    if (!row) return MOCK;
    const value = clamp(parseInt(row.value, 10), 0, 100);
    return {
      source: 'Alternative.me',
      value,
      label: labelFor(value, row.value_classification),
      timestamp: new Date(parseInt(row.timestamp, 10) * 1000).toISOString(),
    };
  } catch (err) {
    logger.warn('Fear & Greed fetch failed — returning neutral mock', { err: String(err) });
    return MOCK;
  }
}

/** Normalize the upstream classification to our typed buckets (or derive it). */
function labelFor(value: number, raw: string): SentimentLabel {
  const normalized = raw?.trim().toLowerCase();
  if (normalized === 'extreme fear') return 'Extreme Fear';
  if (normalized === 'fear') return 'Fear';
  if (normalized === 'greed') return 'Greed';
  if (normalized === 'extreme greed') return 'Extreme Greed';
  if (normalized === 'neutral') return 'Neutral';
  // Derive from score if the upstream label is unexpected.
  if (value < 25) return 'Extreme Fear';
  if (value < 45) return 'Fear';
  if (value < 55) return 'Neutral';
  if (value < 75) return 'Greed';
  return 'Extreme Greed';
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return 50;
  return Math.max(min, Math.min(max, n));
}
