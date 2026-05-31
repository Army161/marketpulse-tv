# MarketPulse TV — Architecture

## System Overview
```
┌─────────────────────┐      ┌─────────────────────┐
│  Fire TV (RN/Vega)  │      │  Roku (SceneGraph)  │
│  apps/firetv        │      │  apps/roku          │
└──────────┬──────────┘      └──────────┬──────────┘
           │  HTTPS                      │  HTTPS
           ▼                             ▼
       ┌───────────────────────────────────────┐
       │   Vercel Serverless (Node + Express)  │
       │   services/api                         │
       │                                        │
       │   /api/stocks   ─┐                     │
       │   /api/crypto   ─┤  in-process cache   │
       │   /api/news     ─┤  (NodeCache)        │
       │   /api/movers   ─┤  + rate limit       │
       │   /api/health    │                     │
       └────┬───────┬─────┴──────┬──────────┬───┘
            │       │            │          │
            ▼       ▼            ▼          ▼
       ┌────────┐ ┌─────────┐ ┌──────┐ ┌────────┐
       │ Alpaca │ │CoinGecko│ │ News │ │ OpenAI │
       │Markets │ │   API   │ │ API  │ │  /Gem  │
       └────────┘ └─────────┘ └──────┘ └────────┘
```

## Layer Responsibilities
- **TV clients** are presentation only. Every screen pulls from the typed
  Express endpoints through `useFetch` (Fire TV) or `HttpClient` (Roku).
- **Backend** normalizes responses into the shared interfaces in
  `shared/src/types/index.ts`, caches them, rate-limits clients, and
  translates upstream errors into a typed `ApiErrorResponse`.
- **Shared** is the single source of truth for data contracts. Both
  client apps and the API import from `@marketpulse/shared` so a change
  to a response shape can't drift across surfaces.

## Why npm workspaces + a shared TS package
- Zero publishing overhead — the API imports `@marketpulse/shared`
  directly from the local filesystem.
- Type checks ripple immediately when a shape changes — the API and
  Fire TV both light up red until both sides match.
- The Roku app can't consume TypeScript directly (BrightScript is its
  own language), so it relies on `docs/api-contracts.md` as the
  hand-off — the markdown is generated from the same source spec the
  TS types implement.

## Caching Strategy
| Resource | TTL | Reason |
|---|---|---|
| Stocks  | 30 s  | Alpaca free tier permits ~200 req/min — caching protects the budget. |
| Crypto  | 30 s  | CoinGecko free tier is 10–50 calls/min depending on key. |
| Movers  | 30 s  | Derived from same Alpaca snapshot, same cadence makes sense. |
| News    | 5 min | AI summarization is the expensive call — keep it rare. |

Per-instance caching is sufficient: Vercel cold starts spin up new
instances, and at our refresh cadence the cache hit rate stays high
on warm functions.

## Deployment Topology
- The backend deploys to **Vercel** as a single function (`api/index.ts`)
  with a rewrite that routes every `/api/*` request through Express.
- Static assets (icons, splashes) live with their respective TV apps
  and ship with the platform-native artifacts (APK / Roku channel ZIP).
- TV apps are distributed via **Amazon Appstore** and the **Roku Channel
  Store** respectively — see `docs/store-submission.md`.

## Error Handling Philosophy
Every external call is wrapped in try/catch. The handler maps to a
typed `ApiError`, which the global Express error middleware turns into
a clean `{ error: { code, message } }` response. TV clients render an
`ErrorState` with a Retry button — graceful degradation is mandatory
because a frozen TV dashboard is worse than a clearly-broken one.
