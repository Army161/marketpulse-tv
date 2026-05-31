# Roku v2 Rebuild — BUILD Task List

## Phase 1 — Backend (this session)
- [ ] Add `Sentiment` + `SentimentResponse` types to shared
- [ ] Adapter `services/api/src/adapters/sentiment.ts` (alternative.me F&G)
- [ ] Route `services/api/src/routes/sentiment.ts` (`/api/sentiment`, 5min cache)
- [ ] Register route in app.ts (`/api/sentiment` + via `/api/*` rewrite)
- [ ] Bump crypto default limit to 20, stocks universe to 20
- [ ] Typecheck backend, deploy to Vercel, verify `/api/sentiment` live

## Phase 2 — Roku visual system + UX (this session)
- [ ] Generate premium PNG assets (gradient bg, gauge arc, panel glow, logo)
- [ ] `source/Theme.brs` — palette, type scale, spacing, color helpers
- [ ] Rewrite `DataFetcher` to fetch 20 crypto + 20 stocks + sentiment
- [ ] **TickerRow rewrite** — continuous scroll, 20 crypto → 20 stocks → loop
- [ ] **FearGreedGauge** component — color-zoned gauge + numeric readout
- [ ] **NavSidebar** component — D-pad selectable sections
- [ ] **DetailOverlay** component — opens on SELECT of any ticker/coin
- [ ] Rewrite `Dashboard.xml/.brs` — sidebar + content router + sections
- [ ] Restyle Crypto / Movers / News panels (typography + color + cards)
- [ ] Wire SELECT handlers (onKeyEvent / observeField focus) everywhere
- [ ] Bump manifest build_version → 00003
- [ ] Package (scripts/package-roku.py), sideload, verify on device, clean console

## Phase 3 — AI audio anchor (roadmap, spec only this session)
- [ ] Spec `/api/brief` (script compose + Google TTS) in PLAN
- [ ] Spec Roku Audio playback + "Daily Brief" control

## Phase 4 — HeyGen avatar (roadmap, spec only this session)
- [ ] Spec HeyGen generation pipeline + Roku Video playback

## Verification gates (every phase)
- Backend: typecheck 0 errors, endpoint returns 200 live.
- Roku: BrightScript console clean, sideload Install Success, on-device render
  confirmed by the user's eyes.
