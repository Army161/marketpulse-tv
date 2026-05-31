# MarketPulse TV — Session Handoff

_Last updated: 2026-05-31_

This document lets any fresh Claude session (Cowork, Code, or web) pick up
exactly where the last session left off. Read this first.

## What this project is
AI-powered financial dashboard for **Amazon Fire TV** and **Roku**.
- Live stocks (Alpaca), crypto (CoinGecko), AI-summarized news (NewsAPI + Gemini).
- Monorepo: npm workspaces (`apps/firetv`, `services/api`, `shared`) + `apps/roku` (BrightScript).

## Live production backend
- URL: **https://marketpulse-tv.vercel.app**
- Endpoints: `/api/health`, `/api/stocks`, `/api/crypto`, `/api/movers`, `/api/news`, `/privacy`
- Vercel project: `jeremy-gepharts-projects/marketpulse-tv` (id `prj_Qo0fBj4RMdeBkpH8gHZKIHCwTIxF`)
- All API keys are set as Vercel env vars (Alpaca, CoinGecko, Gemini, NewsAPI) AND in local `.env`.

## Status by surface
| Surface | State |
|---|---|
| Backend (Vercel) | ✅ Live, all endpoints + `/privacy`, real data |
| Roku channel | ✅ On-device validated on real hardware, clean console, build_version 00002 |
| Fire TV (RN/TS) | ✅ Code complete, typechecks clean, points at prod — NO native APK yet |
| Shared types | ✅ Single source of truth in `shared/src/types` |
| Roku store submission | 📋 In-repo prep done; human-only steps remain |

## What's DONE and verified
- Full backend with caching, rate limiting, typed errors, mock-data fallback.
- All Fire TV screens + components + D-pad nav + paywall + IAP wrapper (JS layer).
- Roku channel: Task-node async fetch (critical — see gotchas), all 4 panels
  rendering live data, 2-decimal formatting, clean BrightScript console.
- `/privacy` policy route live in production (for store submission).
- Roku submission docs in `docs/roku-submission/`.

## Remaining work (pick a track)
### Track A — Roku store/private publish (human-only, see docs/roku-submission/packaging-runbook.md)
1. Branded icon art: 248×140, 290×218, 540×405 PNGs (placeholders fail review)
2. Roku developer account
3. Device-bound: `genkey` → Package → signed `.pkg`
4. Portal upload + submit (privacy URL already live to paste)

### Track B — Fire TV native scaffold (engineering)
1. Generate `apps/firetv/android/` (RN community CLI)
2. Wire Amazon IAP native module
3. Move staged PEM: `apps/firetv/assets/AppstoreAuthenticationKey.pem`
   → `apps/firetv/android/app/src/main/assets/`
4. Build + sideload APK to a Fire TV

### Track C — optional polish
- Richer multi-line News/Crypto cards via Roku `MarkupGrid` + itemComponent
- Stablecoin rounding ($0.99 → $1.00) if desired

## Security note
One Dependabot/npm-audit advisory exists (`fast-xml-parser <5.7.0`, moderate).
It is a React Native CLI build-tooling transitive dep — NOT in the deployed
backend, NOT exploitable here, and there is no non-breaking fix. Do NOT
`npm audit fix --force` (it would break-bump react-native). It resolves
naturally when react-native is upgraded in the Fire TV scaffold phase. Full
assessment in `SECURITY.md`.

## CRITICAL gotchas for the next session
1. **Folder name has a `.zip` suffix but IS a real directory.**
   `C:\Users\Armyg\marketpulse-tv-claude-code.zip` — don't try to unzip it.
   Recommend renaming to `marketpulse-tv` when no process holds it open.
2. **Roku `roUrlTransfer` is MAIN|TASK-thread only.** Never create it on the
   render thread — all Roku network I/O MUST live in the `DataFetcher` Task node
   (`apps/roku/components/DataFetcher.brs`). This was a fatal crash; don't regress it.
3. **Node on this machine is via nvm:** `C:\Users\Armyg\AppData\Local\nvm\v24.11.1\node.exe`.
   `node`/`npx`/`vercel` are often NOT on git-bash PATH. Use full paths or
   `export PATH="/c/Users/Armyg/AppData/Local/nvm/v24.11.1:/c/Users/Armyg/AppData/Roaming/npm:$PATH"`.
4. **Vercel serverless function lives at root `api/index.ts`** (NOT
   `services/api/api/`). It imports the Express app from `services/api/src/app.ts`.
   Routes must be servable inline (no runtime fs reads — won't be in the bundle).
5. **Roku dev device:** IP `192.168.1.80`, user `rokudev`, dev password `2789`.
   Sideload: `curl --user rokudev:2789 --digest -F mysubmit=Replace -F archive=@dist/marketpulse-roku.zip http://192.168.1.80/plugin_install`
   Console: `telnet 192.168.1.80 8085`. Launch: `curl -d "" http://192.168.1.80:8060/launch/dev`.

## Key commands
```bash
# Typecheck everything
npm run typecheck --workspaces
# Backend dev (from repo root)
npm run dev:api
# Package Roku channel (manifest at zip root; excludes bsconfig/out/ artifacts)
python3 scripts/package-roku.py
# Deploy backend (needs VERCEL_TOKEN env)
vercel --prod --yes
```

## Repo map
```
api/index.ts                 Vercel serverless entry (imports services/api app)
services/api/                Express backend (routes/, adapters/, lib/, middleware/)
apps/firetv/                 React Native TV app (src/screens, components, monetization)
apps/roku/                   BrightScript channel (components/, source/, manifest, images/)
shared/src/types/            Shared TS contracts
docs/                        architecture, monetization, tv-ux-rules, api-contracts,
                             store-submission, roku-submission/, amazon-iap-sandbox
dist/marketpulse-roku.zip    Latest packaged Roku channel
.env                         Local secrets (gitignored)
```
