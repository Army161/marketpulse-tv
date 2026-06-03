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
- Roku manifest build_version = 00007 (bump every sideload).
- Roku device renders UI at 720p; design space is FHD 1920×1080.

## Active bug (see HANDOFF.md for full detail + fix plan)
- Section nav shows EMPTY pages (even static titles missing) + BACK/Home dead.
  Root cause hypothesis: runtime error in Dashboard.brs `onSectionChange`.
  Fix: guard node refs before callFunc; capture console during a nav press.

## Personality / working style the user wants
- Direct, concise, no fluff. Build real working increments, verify on device,
  commit to git often. Be honest about limits (no fake "done", no blind claims).
  ADD features, never remove existing ones. The user reacts to results ("bad as fuck"
  = good). They move fast and want momentum.
