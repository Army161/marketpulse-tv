# MEMORY — durable facts for MarketPulse TV

Quick-reference memory. Pair with `HANDOFF.md` (full context) and
`docs/roku-v2/PLAN-NEXT.md` (next steps).

## Identity / access
- Repo: `Army161/marketpulse-tv` (private, GitHub). `gh` authenticated as Army161.
- Local dir: `C:\Users\Armyg\marketpulse-tv-claude-code.zip` (REAL folder, not a zip).
- Backend prod: https://marketpulse-tv.vercel.app
- Vercel: project `prj_Qo0fBj4RMdeBkpH8gHZKIHCwTIxF`, team `team_jyck86vLRB9EjYteV05GheRR`.
- Roku dev: `192.168.1.80`, user `rokudev`, pass `2789`. ECP port 8060, console 8085, install port 80.
- Node: nvm `C:\Users\Armyg\AppData\Local\nvm\v24.11.1\node.exe` (NOT on git-bash PATH).
- Vercel CLI invoked as `vercel.cmd`. VERCEL_TOKEN is in the chat history (ask user if missing).

## API keys (VALUES are in .env + Vercel env vars — never commit values)
- ALPACA_API_KEY / ALPACA_SECRET_KEY (data.alpaca.markets) — stocks, live.
- COINGECKO_API_KEY (CG- demo) — crypto.
- GEMINI_API_KEY (model gemini-flash-latest) — AI news fallback.
- NEWSAPI_KEY — news fallback only.
- BENZINGA_API_KEY — PRIMARY news + calendar. **Prefix is `bz.` not `bz_.`** (underscore = 401).
- Alternative.me — no key (Fear & Greed).
- Google Cloud TTS + HeyGen — user has accounts; Phase 3, not wired yet.

## Stack
- Monorepo (npm workspaces): `services/api` (Express/Vercel), `apps/firetv`
  (React Native TS), `shared` (TS types). `apps/roku` (BrightScript, not a workspace).
- Vercel function entry: root `api/index.ts` → imports `services/api/src/app.ts`.
  Routes must serve INLINE data (no runtime fs reads — not in the bundle).
- Roku: one Scene + page Groups + nav router. Network ONLY in DataFetcher Task node.

## Current build
- Roku manifest build_version = 00011 (bump every sideload). NOTE: 00011 is
  packaged (dist ready) but NOT yet sideloaded — Roku was offline at build time.
- Roku device renders UI at 720p; design space is FHD 1920×1080.
- Roku dev device friendly name: "War and Rock" (192.168.1.80).

## Phase 3a — AI Audio Anchor (built 2026-06-07)
- Backend: `GET /api/brief` returns a Gemini-written 3-para spoken script from
  live data (movers + Fear&Greed + Benzinga headlines); deterministic fallback
  if Gemini fails. Verified live (both gemini + fallback paths seen). 30-min cache.
- `adapters/tts.ts`: Google TTS (REST, API-key) → MP3 → Vercel Blob (`@vercel/blob`
  `put()`), GATED by `hasTtsCreds()` → returns audioUrl:null until creds set.
- Roku: "▶ Daily Brief" Button on Home (RIGHT focuses it, OK opens), new
  `BriefOverlay` (script reader + `Audio` node), DataFetcher `brief` field.
- Benzinga does NOT do voice. Pipeline = Benzinga (facts) → Gemini (script) →
  Google TTS (audio). See API-KEYS.md "Phase 3a" for turn-on steps.
- REMAINING (user-only): deploy backend (needs VERCEL_TOKEN) so /api/brief is
  live; set GOOGLE_TTS_API_KEY + BLOB_READ_WRITE_TOKEN; power Roku + sideload
  00011 + verify the button on the TV.

## Resolved bugs
- **Section-nav empty pages (build 00007 → fixed in 00008, current 00009).**
  Root cause: BrightScript `for each key in AssocArray` iterates VALUES not keys
  (unlike most langs). The visibility loop `m.groups[key]` was indexing AA by
  node references → invalid → every group hidden. Fix: explicit per-section
  visibility assignments + `<> invalid` guards on every callFunc. Code committed
  (1ee1301).
  **On-device verification 2026-06-05 (build 00009): ALL 8/8 sections PASS — CLOSED.**
  Confirmed rendering real content (no empty blue) on the actual Roku remote: Home,
  Crypto, Stocks, News, Calendar, Sentiment, Settings, Upgrade + chyron scrolling in
  every frame. Calendar (highest-risk, new in v2.2) renders earnings rows with list
  focus → confirms the setListFocus/alwaysNotify fix. See `photos.md` for the 10-frame
  log. Not separately captured (low risk): Stocks row→overlay→BACK, BACK→Home round-trip.

## Visual polish items — ✅ FIXED in build 00010 (user-confirmed on device 2026-06-05)
- Upgrade pricing cards: feature step 64→84px, label width 300→320 (Dashboard.brs
  buildPricing). 2-line features no longer overlap the next bullet.
- News cards: itemSize 150→172, numRows 5→4 (NewsPanel.xml); tickers y94→104, meta
  y122→134, rowBg/focusBar 150→172 (NewsRow.xml/.brs). 2-line headlines clear the
  ticker line. Root cause for both: fixed vertical step assumed single-line text.

## BrightScript gotcha (DO NOT regress)
- `for each x in AA` gives VALUES, not keys. Use `for each k in AA.Keys()` if
  you need keys, or just enumerate the keys explicitly.

## Personality / working style the user wants
- Direct, concise, no fluff. Build real working increments, verify on device,
  commit to git often. Be honest about limits (no fake "done", no blind claims).
  ADD features, never remove existing ones. The user reacts to results ("bad as fuck"
  = good). They move fast and want momentum.
