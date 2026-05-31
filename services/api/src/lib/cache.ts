import NodeCache from 'node-cache';

/**
 * Shared in-process cache. On Vercel's serverless runtime each function
 * instance has its own memory, so this cache acts per-instance — that's
 * still enough to absorb burst traffic and stay under upstream rate limits.
 */
const cache = new NodeCache({ checkperiod: 60 });

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== undefined) return cached;

  const fresh = await loader();
  cache.set(key, fresh, ttlSeconds);
  return fresh;
}

export function invalidate(key: string): void {
  cache.del(key);
}

export function clearAll(): void {
  cache.flushAll();
}
