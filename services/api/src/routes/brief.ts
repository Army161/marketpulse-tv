import { Router } from 'express';
import type { Article, BriefResponse } from '@marketpulse/shared';
import { fetchTopMovers } from '../adapters/movers';
import { fetchFearGreed } from '../adapters/sentiment';
import { tryBenzingaNews } from '../adapters/benzinga';
import { fetchSummarizedNews } from '../adapters/newsAI';
import { composeBriefScript } from '../adapters/brief';
import { synthesizeBrief } from '../adapters/tts';
import { withCache } from '../lib/cache';
import { config } from '../config';

const router = Router();

/**
 * GET /api/brief — the AI Audio Anchor segment.
 *
 * Composes a spoken market-brief script from live data (movers + Fear&Greed +
 * top headlines) via Gemini, then synthesizes audio when TTS is configured.
 * Heavily cached (config.cache.briefTtl) because Gemini + TTS are expensive.
 */
router.get('/', async (_req, res, next) => {
  try {
    const brief = await withCache('brief:daily', config.cache.briefTtl, buildBrief);
    res.json(brief);
  } catch (err) {
    next(err);
  }
});

async function buildBrief(): Promise<BriefResponse> {
  const [movers, sentiment, headlines] = await Promise.all([
    fetchTopMovers(3),
    fetchFearGreed(),
    loadHeadlines(2),
  ]);

  const script = await composeBriefScript({
    gainers: movers.gainers,
    losers: movers.losers,
    sentiment,
    headlines,
  });

  const synth = await synthesizeBrief(script.text);

  return {
    scriptText: script.text,
    audioUrl: synth ? synth.audioUrl : null,
    voice: synth ? synth.voice : null,
    source: script.source,
    generatedAt: new Date().toISOString(),
  };
}

/** Same source priority as /api/news: Benzinga first, AI-summarized fallback. */
async function loadHeadlines(limit: number): Promise<Article[]> {
  const benzinga = await tryBenzingaNews(limit);
  if (benzinga && benzinga.length > 0) return benzinga;
  return fetchSummarizedNews(limit);
}

export default router;
