/**
 * Single source of truth for all shared data contracts between
 * the backend API and TV client applications (Fire TV, Roku).
 *
 * Endpoint responses are documented in docs/api-contracts.md.
 */

/** A stock ticker quote. */
export interface Stock {
  /** Ticker symbol, e.g. "AAPL". */
  symbol: string;
  /** Latest trade price in USD. */
  price: number;
  /** Absolute price change since previous close. */
  change: number;
  /** Percent change since previous close, e.g. 0.61 for +0.61%. */
  changePercent: number;
  /** Optional company name. */
  name?: string;
  /** 24h trading volume (when available). */
  volume?: number;
  /** Market sector (when available). */
  sector?: string;
}

/** A cryptocurrency quote. */
export interface Coin {
  /** CoinGecko ID, e.g. "bitcoin". */
  id: string;
  /** Trading symbol, e.g. "BTC". */
  symbol: string;
  /** Latest price in USD. */
  price: number;
  /** Percent change over 24h, e.g. 2.41 for +2.41%. */
  change24h: number;
  /** Optional display name. */
  name?: string;
  /** Market cap in USD (when available). */
  marketCap?: number;
  /** 24h volume in USD (when available). */
  volume24h?: number;
  /** Compact price history for sparkline (length-7 typical). */
  sparkline?: number[];
}

/** An AI-summarized news article. */
export interface Article {
  /** Original headline. */
  headline: string;
  /** AI-generated 1–2 sentence summary. */
  summary: string;
  /** Publisher name, e.g. "Reuters". */
  source: string;
  /** Story category. */
  category: ArticleCategory;
  /** ISO-8601 publish timestamp. */
  publishedAt: string;
  /** Original article URL (optional, for source attribution). */
  url?: string;
}

export type ArticleCategory = 'Stocks' | 'Crypto' | 'Economy' | 'Earnings' | 'General';

/** A top mover summary entry. */
export interface Mover {
  symbol: string;
  changePercent: number;
  price?: number;
  name?: string;
}

/* ---------- Endpoint response shapes ---------- */

export interface StocksResponse {
  tickers: Stock[];
  updatedAt: string;
}

export interface CryptoResponse {
  coins: Coin[];
  updatedAt: string;
}

export interface NewsResponse {
  articles: Article[];
  updatedAt: string;
}

export interface MoversResponse {
  gainers: Mover[];
  losers: Mover[];
  updatedAt: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  version: string;
  uptime?: number;
}

/** Standard typed error response — never leak raw third-party errors to clients. */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/* ---------- Subscription / entitlement ---------- */

export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface Entitlement {
  tier: SubscriptionTier;
  active: boolean;
  /** ISO-8601 expiry timestamp, if applicable. */
  expiresAt?: string;
  /** Originating store: 'amazon' | 'roku'. */
  source: 'amazon' | 'roku' | 'none';
}
