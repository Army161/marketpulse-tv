import axios from 'axios';
import type { Article, ArticleCategory } from '@marketpulse/shared';
import { config, hasNewsAiCreds } from '../config';
import { logger } from '../lib/logger';
import { MOCK_ARTICLES } from './mockData';

interface NewsApiResponse {
  articles: Array<{
    title: string;
    description?: string;
    source: { name: string };
    publishedAt: string;
    url: string;
  }>;
}

interface RawHeadline {
  headline: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
}

/**
 * Fetch raw headlines from NewsAPI then summarize via OpenAI or Gemini.
 * Returns the existing mock article set if no AI provider is configured —
 * keeps the news screen useful during sandbox/store-review testing.
 */
export async function fetchSummarizedNews(limit = 8): Promise<Article[]> {
  if (!hasNewsAiCreds()) {
    logger.warn('No AI credentials configured — returning mock articles');
    return MOCK_ARTICLES.slice(0, limit);
  }

  const raw = await fetchRawHeadlines(limit);
  if (raw.length === 0) return MOCK_ARTICLES.slice(0, limit);

  const summaries = await summarizeBatch(raw);
  return raw.map((h, i) => ({
    headline: h.headline,
    summary: summaries[i] ?? truncate(h.description, 220),
    source: h.source,
    category: classify(h.headline + ' ' + h.description),
    publishedAt: h.publishedAt,
    url: h.url,
  }));
}

async function fetchRawHeadlines(limit: number): Promise<RawHeadline[]> {
  if (!config.newsapi.apiKey) {
    return MOCK_ARTICLES.slice(0, limit).map((a) => ({
      headline: a.headline,
      description: a.summary,
      source: a.source,
      publishedAt: a.publishedAt,
      url: a.url ?? '',
    }));
  }

  try {
    const resp = await axios.get<NewsApiResponse>(`${config.newsapi.baseUrl}/top-headlines`, {
      params: { category: 'business', language: 'en', pageSize: limit, apiKey: config.newsapi.apiKey },
      timeout: 6000,
    });
    return resp.data.articles.map((a) => ({
      headline: a.title,
      description: a.description ?? '',
      source: a.source.name,
      publishedAt: a.publishedAt,
      url: a.url,
    }));
  } catch (err) {
    logger.error('NewsAPI fetch failed', { err: String(err) });
    return [];
  }
}

async function summarizeBatch(headlines: RawHeadline[]): Promise<string[]> {
  const prompt = buildSummaryPrompt(headlines);
  try {
    if (config.openai.apiKey) return await callOpenAI(prompt);
    if (config.gemini.apiKey) return await callGemini(prompt);
    return [];
  } catch (err) {
    logger.error('AI summarization failed — falling back to descriptions', { err: String(err) });
    return headlines.map((h) => truncate(h.description, 220));
  }
}

function buildSummaryPrompt(headlines: RawHeadline[]): string {
  const list = headlines
    .map((h, i) => `${i + 1}. ${h.headline}\n   ${h.description}`)
    .join('\n\n');
  return `Summarize each of the following finance headlines in EXACTLY one or two short sentences each, factual and neutral, no preamble. Return only the numbered list, one summary per number, no extra text.\n\n${list}`;
}

async function callOpenAI(prompt: string): Promise<string[]> {
  const resp = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: config.openai.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    },
    {
      headers: { Authorization: `Bearer ${config.openai.apiKey}` },
      timeout: 15000,
    },
  );
  const text = resp.data.choices?.[0]?.message?.content ?? '';
  return parseNumberedList(text);
}

async function callGemini(prompt: string): Promise<string[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;
  const resp = await axios.post(
    url,
    { contents: [{ parts: [{ text: prompt }] }] },
    { timeout: 15000 },
  );
  const text = resp.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return parseNumberedList(text);
}

function parseNumberedList(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^\s*\d+[\.\)]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

function classify(text: string): ArticleCategory {
  const t = text.toLowerCase();
  if (/(crypto|bitcoin|ethereum|btc|eth|coin)/.test(t)) return 'Crypto';
  if (/(earnings|revenue|quarter|guidance)/.test(t)) return 'Earnings';
  if (/(fed|inflation|gdp|jobs|cpi|recession|economy)/.test(t)) return 'Economy';
  if (/(stock|equity|nasdaq|s&p|dow|share)/.test(t)) return 'Stocks';
  return 'General';
}
