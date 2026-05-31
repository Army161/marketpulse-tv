import axios from 'axios';
import type { Coin } from '@marketpulse/shared';
import { config } from '../config';
import { Errors } from '../lib/errors';
import { logger } from '../lib/logger';
import { MOCK_COINS } from './mockData';

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
}

/**
 * Fetch top crypto market data from CoinGecko. Public endpoint works without
 * an API key, but we attach the demo key when present to lift rate limits.
 */
export async function fetchCoins(limit = 50): Promise<Coin[]> {
  try {
    const url = `${config.coingecko.baseUrl}/coins/markets`;
    const headers: Record<string, string> = {};
    if (config.coingecko.apiKey) headers['x-cg-demo-api-key'] = config.coingecko.apiKey;

    const resp = await axios.get<CoinGeckoMarket[]>(url, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
      headers,
      timeout: 8000,
    });

    return resp.data.map(mapCoin);
  } catch (err) {
    logger.error('CoinGecko fetch failed', { err: String(err) });
    if (limit <= MOCK_COINS.length) return MOCK_COINS.slice(0, limit);
    throw Errors.upstream('CoinGecko');
  }
}

function mapCoin(m: CoinGeckoMarket): Coin {
  const spark = m.sparkline_in_7d?.price ?? [];
  return {
    id: m.id,
    symbol: m.symbol.toUpperCase(),
    name: m.name,
    price: m.current_price,
    change24h: m.price_change_percentage_24h ?? 0,
    marketCap: m.market_cap,
    volume24h: m.total_volume,
    sparkline: sampleSparkline(spark, 7),
  };
}

/** Down-sample the 168-point hourly sparkline to N evenly-spaced points. */
function sampleSparkline(points: number[], target: number): number[] {
  if (points.length === 0) return [];
  if (points.length <= target) return points;
  const step = (points.length - 1) / (target - 1);
  return Array.from({ length: target }, (_, i) => points[Math.round(i * step)]);
}
