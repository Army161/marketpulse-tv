import axios from 'axios';
import type { Article, ArticleCategory } from '@marketpulse/shared';
import { config, hasBenzinga } from '../config';
import { logger } from '../lib/logger';

/**
 * Benzinga News adapter — real financial newswire.
 *
 * Benzinga's `teaser` is an editor-written 1–2 sentence summary, so unlike the
 * NewsAPI path we do NOT need an AI summarization call — the summary ships with
 * the article (faster + cheaper). We map Benzinga's rich payload into our
 * shared `Article` shape, preserving tickers + a thumbnail when present.
 *
 * Docs: https://docs.benzinga.com  (GET /api/v2/news)
 */

interface BzStock {
  name: string;
  exchange?: string;
  sector?: string;
}
interface BzChannel {
  name: string;
}
interface BzImage {
  size: string;
  url: string;
}
interface BzArticle {
  id: number;
  title: string;
  teaser: string;
  body: string;
  author: string;
  created: string; // RFC-822, e.g. "Tue, 02 Jun 2026 17:12:02 -0400"
  url: string;
  stocks?: BzStock[];
  channels?: BzChannel[];
  image?: BzImage[];
}

export async function fetchBenzingaNews(limit = 8): Promise<Article[]> {
  if (!hasBenzinga()) {
    throw new Error('Benzinga not configured');
  }

  const url = `${config.benzinga.baseUrl}/api/v2/news`;
  const resp = await axios.get<BzArticle[]>(url, {
    params: {
      token: config.benzinga.apiKey,
      pageSize: Math.min(Math.max(limit, 1), 20),
      displayOutput: 'full',
    },
    headers: { accept: 'application/json' },
    timeout: 8000,
  });

  if (!Array.isArray(resp.data)) {
    throw new Error('Unexpected Benzinga response shape');
  }

  return resp.data.slice(0, limit).map(mapArticle);
}

function mapArticle(a: BzArticle): Article {
  const tickers = (a.stocks ?? []).map((s) => s.name).filter(Boolean).slice(0, 6);
  const thumb = pickImage(a.image);
  const summary = stripHtml(a.teaser) || stripHtml(a.body).slice(0, 220);
  return {
    headline: decodeEntities(a.title),
    // teaser is editor-written; fall back to body, then a ticker-aware line so
    // a card is never blank.
    summary: summary || fallbackSummary(tickers),
    source: 'Benzinga',
    category: categoryFrom(a.channels, a.title, a.teaser),
    publishedAt: toIso(a.created),
    url: a.url,
    tickers: tickers.length ? tickers : undefined,
    imageUrl: thumb,
  };
}

function fallbackSummary(tickers: string[]): string {
  if (tickers.length) return 'Market-moving update for ' + tickers.join(', ') + '.';
  return 'Breaking market update from Benzinga.';
}

function pickImage(images?: BzImage[]): string | undefined {
  if (!images || images.length === 0) return undefined;
  // Prefer a small/thumb image for TV list rendering.
  const thumb = images.find((i) => i.size === 'thumb') ?? images.find((i) => i.size === 'small');
  return (thumb ?? images[0]).url;
}

/** Map Benzinga channels to our ArticleCategory, with keyword fallback. */
function categoryFrom(channels: BzChannel[] | undefined, title: string, teaser: string): ArticleCategory {
  const names = (channels ?? []).map((c) => c.name.toLowerCase());
  const has = (s: string) => names.some((n) => n.includes(s));
  if (has('crypto')) return 'Crypto';
  if (has('earnings')) return 'Earnings';
  if (has('economic') || has('macro') || has('fed')) return 'Economy';
  if (has('market') || has('trading') || has('movers') || has('tech') || has('equit')) return 'Stocks';
  // keyword fallback on title+teaser
  const t = `${title} ${teaser}`.toLowerCase();
  if (/(crypto|bitcoin|ethereum|btc|eth)/.test(t)) return 'Crypto';
  if (/(earnings|revenue|guidance|quarter)/.test(t)) return 'Earnings';
  if (/(fed|inflation|gdp|cpi|jobs|economy)/.test(t)) return 'Economy';
  if (/(stock|nasdaq|s&p|dow|shares?)/.test(t)) return 'Stocks';
  return 'General';
}

function toIso(rfc822: string): string {
  const d = new Date(rfc822);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function stripHtml(s: string): string {
  if (!s) return '';
  return decodeEntities(s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function decodeEntities(s: string): string {
  if (!s) return '';
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/** Logged wrapper used by the route: tries Benzinga, signals caller to fall back. */
export async function tryBenzingaNews(limit: number): Promise<Article[] | null> {
  if (!hasBenzinga()) return null;
  try {
    const articles = await fetchBenzingaNews(limit);
    if (articles.length === 0) return null;
    return articles;
  } catch (err) {
    logger.warn('Benzinga news failed — falling back to NewsAPI/AI', { err: String(err) });
    return null;
  }
}
