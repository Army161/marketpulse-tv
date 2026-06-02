import { Router } from 'express';
import type { Article, NewsResponse } from '@marketpulse/shared';
import { fetchSummarizedNews } from '../adapters/newsAI';
import { tryBenzingaNews } from '../adapters/benzinga';
import { withCache } from '../lib/cache';
import { config } from '../config';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = clampInt(req.query.limit, 8, 1, 20);
    const cacheKey = `news:${limit}`;
    const articles = await withCache(cacheKey, config.cache.newsTtl, () => loadNews(limit));
    const body: NewsResponse = { articles, updatedAt: new Date().toISOString() };
    res.json(body);
  } catch (err) {
    next(err);
  }
});

/**
 * News source priority:
 *   1. Benzinga — real newswire; editor-written teasers (no AI call needed).
 *   2. NewsAPI + Gemini summarization — fallback.
 *   3. Mock articles — final fallback (handled inside fetchSummarizedNews).
 */
async function loadNews(limit: number): Promise<Article[]> {
  const benzinga = await tryBenzingaNews(limit);
  if (benzinga) return benzinga;
  return fetchSummarizedNews(limit);
}

function clampInt(raw: unknown, fallback: number, min: number, max: number): number {
  const n = typeof raw === 'string' ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

export default router;
