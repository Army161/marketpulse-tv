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
  { symbol: 'AMD', name: 'AMD', price: 168.22, change: 3.41, changePercent: 2.07, sector: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix', price: 678.45, change: 5.12, changePercent: 0.76, sector: 'Communication' },
  { symbol: 'DIS', name: 'Disney', price: 112.30, change: -1.05, changePercent: -0.93, sector: 'Communication' },
  { symbol: 'BA', name: 'Boeing', price: 182.67, change: 2.21, changePercent: 1.22, sector: 'Industrials' },
  { symbol: 'WMT', name: 'Walmart', price: 81.04, change: 0.44, changePercent: 0.55, sector: 'Consumer' },
  { symbol: 'KO', name: 'Coca-Cola', price: 71.55, change: 0.18, changePercent: 0.25, sector: 'Consumer' },
  { symbol: 'XOM', name: 'Exxon Mobil', price: 118.92, change: -0.83, changePercent: -0.69, sector: 'Energy' },
  { symbol: 'BAC', name: 'Bank of America', price: 44.18, change: 0.36, changePercent: 0.82, sector: 'Finance' },
  { symbol: 'PFE', name: 'Pfizer', price: 28.74, change: -0.21, changePercent: -0.73, sector: 'Healthcare' },
  { symbol: 'CSCO', name: 'Cisco', price: 58.61, change: 0.49, changePercent: 0.84, sector: 'Technology' },
  { symbol: 'MA', name: 'Mastercard', price: 478.22, change: 1.44, changePercent: 0.30, sector: 'Finance' },
  { symbol: 'GS', name: 'Goldman Sachs', price: 512.30, change: -3.21, changePercent: -0.62, sector: 'Finance' },
  { symbol: 'CVX', name: 'Chevron', price: 153.44, change: 0.88, changePercent: 0.58, sector: 'Energy' },
  { symbol: 'CAT', name: 'Caterpillar', price: 341.20, change: 2.10, changePercent: 0.62, sector: 'Industrials' },
  { symbol: 'GE', name: 'GE Aerospace', price: 188.70, change: 1.55, changePercent: 0.83, sector: 'Industrials' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.88, change: -0.41, changePercent: -0.25, sector: 'Healthcare' },
  { symbol: 'UNH', name: 'UnitedHealth', price: 492.10, change: -5.20, changePercent: -1.05, sector: 'Healthcare' },
  { symbol: 'MRNA', name: 'Moderna', price: 44.32, change: 0.88, changePercent: 2.02, sector: 'Healthcare' },
  { symbol: 'ABBV', name: 'AbbVie', price: 198.55, change: 1.02, changePercent: 0.52, sector: 'Healthcare' },
  { symbol: 'PLTR', name: 'Palantir', price: 28.44, change: 0.72, changePercent: 2.60, sector: 'Technology' },
  { symbol: 'COIN', name: 'Coinbase', price: 218.33, change: 8.11, changePercent: 3.86, sector: 'Finance' },
  { symbol: 'SQ', name: 'Block', price: 64.20, change: 1.22, changePercent: 1.94, sector: 'Finance' },
  { symbol: 'UBER', name: 'Uber', price: 81.44, change: 1.10, changePercent: 1.37, sector: 'Technology' },
  { symbol: 'SPOT', name: 'Spotify', price: 422.88, change: 4.30, changePercent: 1.03, sector: 'Communication' },
  { symbol: 'GME', name: 'GameStop', price: 24.11, change: 1.44, changePercent: 6.35, sector: 'Consumer' },
  { symbol: 'AMC', name: 'AMC Entertainment', price: 3.88, change: -0.12, changePercent: -3.00, sector: 'Communication' },
  { symbol: 'RIVN', name: 'Rivian', price: 12.44, change: 0.33, changePercent: 2.73, sector: 'Auto' },
  { symbol: 'HOOD', name: 'Robinhood', price: 22.10, change: 0.55, changePercent: 2.55, sector: 'Finance' },
  { symbol: 'SOFI', name: 'SoFi Technologies', price: 12.88, change: 0.22, changePercent: 1.74, sector: 'Finance' },
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
