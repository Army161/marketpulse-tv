# MarketPulse TV — API Contracts

Base URL (dev): `http://localhost:3000`
Base URL (prod): `https://<your-deployment>.vercel.app`

All endpoints return JSON and conform to the TypeScript interfaces in
[`shared/src/types/index.ts`](../shared/src/types/index.ts). Errors always have
the shape `{ "error": { "code": string, "message": string } }`.

---

## GET /api/health

Returns server health and version.

**Response:** `HealthResponse`
```json
{ "status": "ok", "version": "1.0.0", "uptime": 1234 }
```

---

## GET /api/stocks

Returns latest stock quotes. Cache TTL: 30s.

**Query:**
| Param | Type | Description |
|---|---|---|
| `symbols` | string | Optional comma-separated tickers (e.g. `AAPL,MSFT`). Defaults to the dashboard set. Max 25. |

**Response:** `StocksResponse`
```json
{
  "tickers": [
    { "symbol": "AAPL", "price": 201.43, "change": 1.23, "changePercent": 0.61 }
  ],
  "updatedAt": "2026-05-27T04:00:00Z"
}
```

---

## GET /api/crypto

Top crypto by market cap from CoinGecko. Cache TTL: 30s.

**Query:**
| Param | Type | Description |
|---|---|---|
| `limit` | number | 1–100, default 50. |

**Response:** `CryptoResponse`
```json
{
  "coins": [
    { "id": "bitcoin", "symbol": "BTC", "price": 109234.12, "change24h": 2.41 }
  ],
  "updatedAt": "2026-05-27T04:00:00Z"
}
```

---

## GET /api/news

AI-summarized finance headlines. Cache TTL: 5 min.

**Query:**
| Param | Type | Description |
|---|---|---|
| `limit` | number | 1–20, default 8. |

**Response:** `NewsResponse`
```json
{
  "articles": [
    {
      "headline": "Fed holds rates steady",
      "summary": "The Federal Reserve held rates at 4.5% citing stable inflation.",
      "source": "Reuters",
      "category": "Economy",
      "publishedAt": "2026-05-27T03:30:00Z"
    }
  ],
  "updatedAt": "2026-05-27T04:00:00Z"
}
```

---

## GET /api/movers

Top 3 gainers and losers from the default stock universe. Cache TTL: 30s.

**Response:** `MoversResponse`
```json
{
  "gainers": [ { "symbol": "NVDA", "changePercent": 4.21 } ],
  "losers":  [ { "symbol": "INTC", "changePercent": -3.10 } ],
  "updatedAt": "2026-05-27T04:00:00Z"
}
```

---

## Error Codes

| Code | HTTP | Meaning |
|---|---|---|
| `BAD_REQUEST` | 400 | Invalid query parameter. |
| `NOT_FOUND` | 404 | Route or resource not found. |
| `RATE_LIMITED` | 429 | Per-IP rate limit exceeded (120/min default). |
| `INTERNAL_ERROR` | 500 | Unhandled server failure. |
| `UPSTREAM_ERROR` | 502 | Third-party provider unavailable. |
| `NOT_CONFIGURED` | 503 | Required credentials are missing on the server. |

---

## Fallback Behavior

When third-party credentials are missing, every endpoint returns mock data
instead of failing. This keeps Fire TV / Roku UIs renderable during sandbox
testing and store-review screenshots. Mock data lives in
[`services/api/src/adapters/mockData.ts`](../services/api/src/adapters/mockData.ts).
