import type { Article, Coin, Mover, Stock } from '@marketpulse/shared';

/**
 * Realistic-looking mock data used when third-party credentials aren't
 * configured. Lets the TV apps render meaningful screens during local dev
 * and store-review sandbox testing without burning API quota.
 */

export const MOCK_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 201.43, change: 1.23, changePercent: 0.61, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft', price: 421.89, change: -2.14, changePercent: -0.50, sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 945.21, change: 28.41, changePercent: 4.21, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 178.12, change: 0.92, changePercent: 0.52, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon', price: 188.43, change: 1.81, changePercent: 0.97, sector: 'Consumer' },
  { symbol: 'META', name: 'Meta', price: 521.66, change: 3.42, changePercent: 0.66, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla', price: 248.55, change: -4.21, changePercent: -1.67, sector: 'Auto' },
  { symbol: 'JPM', name: 'JPMorgan', price: 215.78, change: 0.45, changePercent: 0.21, sector: 'Finance' },
  { symbol: 'V', name: 'Visa', price: 287.91, change: 1.10, changePercent: 0.38, sector: 'Finance' },
  { symbol: 'INTC', name: 'Intel', price: 22.43, change: -0.72, changePercent: -3.10, sector: 'Technology' },
];

export const MOCK_COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 109234.12, change24h: 2.41, marketCap: 2_150_000_000_000, volume24h: 48_000_000_000 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3812.41, change24h: 1.82, marketCap: 458_000_000_000, volume24h: 22_000_000_000 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 178.92, change24h: 4.12, marketCap: 84_000_000_000, volume24h: 4_100_000_000 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 641.22, change24h: 0.91, marketCap: 95_000_000_000, volume24h: 1_800_000_000 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.54, change24h: -0.72, marketCap: 30_000_000_000, volume24h: 950_000_000 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.41, change24h: 1.21, marketCap: 14_000_000_000, volume24h: 320_000_000 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.142, change24h: -2.14, marketCap: 20_000_000_000, volume24h: 1_200_000_000 },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', price: 38.21, change24h: 3.14, marketCap: 15_000_000_000, volume24h: 410_000_000 },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', price: 17.91, change24h: 1.04, marketCap: 11_000_000_000, volume24h: 380_000_000 },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 6.42, change24h: -1.10, marketCap: 9_500_000_000, volume24h: 260_000_000 },
];

export const MOCK_ARTICLES: Article[] = [
  {
    headline: 'Fed holds rates steady citing stable inflation',
    summary: 'The Federal Reserve left rates at 4.5% and signaled patience as inflation tracks toward target.',
    source: 'Reuters',
    category: 'Economy',
    publishedAt: new Date().toISOString(),
  },
  {
    headline: 'NVIDIA tops earnings on AI demand',
    summary: 'NVIDIA beat estimates on data-center revenue, lifting the stock and pulling chip peers higher.',
    source: 'Bloomberg',
    category: 'Earnings',
    publishedAt: new Date().toISOString(),
  },
  {
    headline: 'Bitcoin tags fresh six-month high',
    summary: 'BTC pushed past $109K as spot ETF inflows accelerated; ETH and SOL followed the move higher.',
    source: 'CoinDesk',
    category: 'Crypto',
    publishedAt: new Date().toISOString(),
  },
  {
    headline: 'S&P 500 closes at record on tech leadership',
    summary: 'Mega-cap technology shares drove the index to a fresh closing high, with breadth narrowly positive.',
    source: 'CNBC',
    category: 'Stocks',
    publishedAt: new Date().toISOString(),
  },
  {
    headline: 'Apple readies AI features in next iOS',
    summary: 'Apple is preparing an expanded on-device AI suite for its upcoming iOS release, sources say.',
    source: 'WSJ',
    category: 'Stocks',
    publishedAt: new Date().toISOString(),
  },
];

export function deriveMockMovers(): { gainers: Mover[]; losers: Mover[] } {
  const sorted = [...MOCK_STOCKS].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sorted.slice(0, 3).map(toMover);
  const losers = sorted.slice(-3).reverse().map(toMover);
  return { gainers, losers };
}

function toMover(s: Stock): Mover {
  return { symbol: s.symbol, changePercent: s.changePercent, price: s.price, name: s.name };
}
