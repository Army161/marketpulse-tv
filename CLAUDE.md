# MarketPulse TV — Claude Code Project Context (v2.2)

## READ THESE FIRST — before anything else
1. `HANDOFF.md` — full project state, active bug detail, gotchas
2. `MEMORY.md` — quick-reference facts, credentials locations
3. `CURRENT-BUG.md` — the #1 priority bug you must fix first
4. `docs/roku-v2/PLAN-NEXT.md` — step-by-step next-session plan

## What this is
Premium live finance TV channel for **Amazon Fire TV** and **Roku**.
Glassmorphism "Midnight" design. 8-page multi-section nav. Bottom chyron.
Live stocks, crypto, AI newswire (Benzinga), Fear & Greed, Earnings Calendar.

**Local folder:** `C:\Users\Armyg\marketpulse-tv-claude-code.zip`
This IS a real directory despite `.zip` in the name. Do NOT try to unzip it.

## Stack
- **Backend:** Node.js 20 + Express → `services/api/`, deployed on Vercel
- **Roku:** BrightScript + SceneGraph → `apps/roku/` (PRIMARY focus now)
- **Fire TV:** React Native + TS → `apps/firetv/` (code complete, no APK yet)
- **Shared types:** `shared/src/types/index.ts`
- **Data providers:** Alpaca (stocks), CoinGecko (crypto), Benzinga (news+calendar),
  Alternative.me (sentiment), Gemini (AI fallback)

## Live backend
https://marketpulse-tv.vercel.app
Endpoints: `/api/health` `/api/stocks` `/api/crypto` `/api/movers`
           `/api/news` `/api/sentiment` `/api/calendar` `/privacy`

## Roku dev device
IP: `192.168.1.80` · user: `rokudev` · pass: `2789`
ECP port: 8060 · Console port: 8085 · Dev server port: 80
Current build: `00007` (has section-nav bug — see `CURRENT-BUG.md`)

## Node path on this machine
```bash
export PATH="/c/Users/Armyg/AppData/Local/nvm/v24.11.1:/c/Users/Armyg/AppData/Roaming/npm:$PATH"
export NODE_BIN="/c/Users/Armyg/AppData/Local/nvm/v24.11.1/node.exe"
```
Node is NOT on git-bash PATH by default. Always export first.

## Key commands
```bash
# Package Roku channel (manifest at zip root)
python3 scripts/package-roku.py

# Sideload + launch + console
curl.exe -s -S --user "rokudev:2789" --digest \
  -F "mysubmit=Replace" -F "archive=@dist/marketpulse-roku.zip" \
  "http://192.168.1.80/plugin_install"
curl.exe -s -d "" "http://192.168.1.80:8060/launch/dev"
timeout 16 curl.exe -s "telnet://192.168.1.80:8085"   # BrightScript console

# Backend typecheck
"$NODE_BIN" node_modules/typescript/bin/tsc -p services/api/tsconfig.json --noEmit

# Deploy backend
export VERCEL_TOKEN="<ask user or see chat history>"
vercel.cmd --prod --yes

# Typecheck all workspaces
npm run typecheck --workspaces
```

## Absolute rules
- NEVER hardcode secrets — `.env` only (gitignored). Verify with `git status`.
- ALWAYS verify on the actual Roku device before calling done.
- ADD features, never remove existing ones.
- Bump `build_version` in `apps/roku/manifest` before EVERY sideload.
- `roUrlTransfer` is MAIN|TASK-thread-only — Roku network ONLY in `DataFetcher.brs`.
- Focus boolean fields on Roku components MUST have `alwaysNotify="true"`.
- `git pull --rebase` before work, `git push` after.
- Never trust BrighterScript alone — always sideload + check console + user confirms.

## Repository
https://github.com/Army161/marketpulse-tv (private, Army161)
Three collaborators: user + Claude Code + Cowork. See `CONTRIBUTING.md`.

## Key references
- `HANDOFF.md` — full context (read first)
- `MEMORY.md` — durable facts
- `CURRENT-BUG.md` — active bug
- `docs/roku-v2/PLAN-NEXT.md` — next steps
- `docs/architecture.md` — system design
- `docs/roku-submission/` — store prep docs
- `API-KEYS.md` — what providers are wired (no secret values)
