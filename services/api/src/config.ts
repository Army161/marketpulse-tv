import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Find a `.env` walking up from cwd. Lets you `cd services/api && npm run dev`
 * while keeping the actual secrets file at the monorepo root next to
 * `.env.example` (and inside `.gitignore`).
 */
function loadEnvFromAncestors(): void {
  let dir = process.cwd();
  for (let i = 0; i < 6; i += 1) {
    const candidate = resolve(dir, '.env');
    if (existsSync(candidate)) {
      loadDotenv({ path: candidate });
      return;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  // No .env found — that's fine, every adapter has a mock fallback.
  loadDotenv();
}

loadEnvFromAncestors();

/**
 * Central configuration. Every env var read happens here so the rest of the
 * codebase never touches `process.env` directly — this keeps secrets traceable
 * and makes mocking trivial in tests.
 */

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: envInt('PORT', 3000),
  version: '1.0.0',

  alpaca: {
    apiKey: process.env.ALPACA_API_KEY ?? '',
    secretKey: process.env.ALPACA_SECRET_KEY ?? '',
    baseUrl: process.env.ALPACA_BASE_URL ?? 'https://data.alpaca.markets',
  },

  coingecko: {
    apiKey: process.env.COINGECKO_API_KEY ?? '',
    baseUrl: process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? '',
    model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
  },

  newsapi: {
    apiKey: process.env.NEWSAPI_KEY ?? '',
    baseUrl: process.env.NEWSAPI_BASE_URL ?? 'https://newsapi.org/v2',
  },

  benzinga: {
    apiKey: process.env.BENZINGA_API_KEY ?? '',
    baseUrl: process.env.BENZINGA_BASE_URL ?? 'https://api.benzinga.com',
  },

  // AI Audio Anchor (Phase 3a). Optional — the /api/brief endpoint serves a
  // script-only brief (audioUrl: null) until both of these are set.
  googleTts: {
    apiKey: process.env.GOOGLE_TTS_API_KEY ?? '',
    voice: process.env.TTS_VOICE ?? 'en-US-Neural2-D',
    languageCode: process.env.TTS_LANGUAGE_CODE ?? 'en-US',
    baseUrl: process.env.TTS_BASE_URL ?? 'https://texttospeech.googleapis.com/v1',
  },

  blob: {
    token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
    baseUrl: process.env.BLOB_API_BASE_URL ?? 'https://blob.vercel-storage.com',
  },

  cache: {
    stocksTtl: envInt('CACHE_TTL_STOCKS', 30),
    cryptoTtl: envInt('CACHE_TTL_CRYPTO', 30),
    newsTtl: envInt('CACHE_TTL_NEWS', 300),
    moversTtl: envInt('CACHE_TTL_MOVERS', 30),
    // Brief is expensive (Gemini + TTS) — cache hard. 30 min default.
    briefTtl: envInt('CACHE_TTL_BRIEF', 1800),
  },

  rateLimit: {
    windowMs: envInt('RATE_LIMIT_WINDOW_MS', 60_000),
    maxRequests: envInt('RATE_LIMIT_MAX_REQUESTS', 120),
  },
} as const;

export function hasAlpacaCreds(): boolean {
  return Boolean(config.alpaca.apiKey && config.alpaca.secretKey);
}

export function hasNewsAiCreds(): boolean {
  return Boolean(config.openai.apiKey || config.gemini.apiKey);
}

export function hasBenzinga(): boolean {
  return Boolean(config.benzinga.apiKey);
}

/**
 * True only when BOTH the TTS provider and the blob host are configured.
 * Gates audio synthesis so the brief endpoint degrades to script-only.
 */
export function hasTtsCreds(): boolean {
  return Boolean(config.googleTts.apiKey && config.blob.token);
}
