# MarketPulse TV — HANDOFF (read this FIRST in a new session)

_Last updated: 2026-06-02 (build 00007 / v2.2)_

This doc + `MEMORY.md` + `docs/roku-v2/PLAN-NEXT.md` carry full context across
sessions. Read all three before touching anything.

---

## 🔴 TOP PRIORITY BUG (fix this first) — Section navigation shows empty pages

### Symptom (confirmed on device, build 00007)
- Home page renders correctly on launch (gainers/losers, gauge, headlines, chyron).
- Pressing the nav buttons (Crypto / Stocks / News / Calendar / Sentiment /
  Settings / Upgrade): the sidebar highlight moves fine, SELECT registers, Home
  content disappears — **but the target page shows EMPTY BLUE** (not even the
  static section title label like "CRYPTO • TOP 20" appears).
- Pressing **Home / BACK does nothing** — content never returns. User must exit
  the channel and relaunch to get Home data back.

### Diagnosis (strong hypothesis — verify with console)
- The fact that even the **static title Label** doesn't render means the target
  page **Group never becomes `visible=true`** — so it's NOT a data/list problem,
  it's the **section router** (`Dashboard.brs > onSectionChange`).
- Most likely: a **runtime error inside `onSectionChange`** aborts the handler on
  the first navigation (after hiding Home but before/while showing the target),
  and breaks further observer processing → Home can't restore either.
- Suspect lines in `onSectionChange` / `refocusContent`:
  - The visibility loop: `for each key in m.groups : m.groups[key].visible = (key = name)`
  - `callFunc("setListFocus", ...)` / `rowsFocus = true` on a node that may be
    `invalid` (e.g. `m.calendarList`, `m.newsPanel`) — calling on invalid throws.
  - Possible itemComponent error (NewsRow/CalendarRow/AssetRow) that cascades.

### EXACT diagnostic step for next session (do this FIRST)
1. Relaunch app: `curl -d "" http://192.168.1.80:8060/launch/dev`
2. Open console: `timeout 30 curl -s "telnet://192.168.1.80:8085"` (run in background)
3. Have user press a nav button (or note: you cannot press the remote — ask the
   user to navigate while you capture, OR add temporary `print` lines in
   `onSectionChange` and re-sideload).
4. The BrightScript runtime error (file + line) is the smoking gun.

### Likely fix (apply defensively even before console)
In `apps/roku/components/Dashboard.brs`:
- Guard every node before use: `if m.calendarList <> invalid then m.calendarList.callFunc(...)`.
- Wrap the visibility loop so it always completes (set target visible explicitly
  AFTER the loop too): after the for-each, add
  `if m.groups[name] <> invalid then m.groups[name].visible = true`.
- Verify all `m.top.findNode(...)` ids in `init()` actually match Dashboard.xml
  ids (a typo'd id returns invalid → callFunc throws). Check: `calendarList`,
  `newsPanel`, `cryptoList`, `stocksList`, `gauge2`, `sentExplain`,
  `settingsRows`, `pricingCards`.
- Ensure `setListFocus`/`rowsFocus`/`navFocus` targets exist for EVERY branch.
- After fix: BrighterScript validate → package → sideload → **have user test ALL
  8 sections + BACK + Home**. Do not call done until user confirms on device.

### Also fix in the same pass
- **BACK / Home must restore reliably** from any section without losing data.
- Confirm the v2.1 freeze fix (alwaysNotify on navFocus/rowsFocus) still holds.

---

## Project snapshot

**What it is:** MarketPulse TV — premium live finance channel for **Roku**
(primary focus now) + Fire TV (code complete, no native build yet). Live stocks,
crypto, AI/wire news, Fear & Greed sentiment, earnings calendar.

**Repo:** https://github.com/Army161/marketpulse-tv (private). Local working
dir: `C:\Users\Armyg\marketpulse-tv-claude-code.zip` (it IS a real directory
despite the `.zip` name — do NOT try to unzip it).

**Backend (LIVE):** https://marketpulse-tv.vercel.app
Endpoints: `/api/health`, `/api/stocks`, `/api/crypto`, `/api/movers`,
`/api/news`, `/api/sentiment`, `/api/calendar`, `/privacy`.
Vercel project: `jeremy-gepharts-projects/marketpulse-tv`
(id `prj_Qo0fBj4RMdeBkpH8gHZKIHCwTIxF`, team `team_jyck86vLRB9EjYteV05GheRR`).

**Roku dev device:** IP `192.168.1.80`, user `rokudev`, dev password `2789`.
Renders UI at **720p** (1280×720) — design in FHD (1920×1080), ship ≤720p source assets.

---

## Status by surface

| Surface | State |
|---|---|
| Backend (Vercel) | ✅ LIVE — all endpoints, real data, cached |
| Roku channel | ⚠️ v2.2 build 00007 sideloaded; **section-nav bug (above)** |
| Fire TV (RN/TS) | ✅ Code complete, typechecks; NO native APK yet |
| Shared types | ✅ Single source in `shared/src/types` |

### Data providers (all wired in backend, keys in `.env` + Vercel env vars)
- **Alpaca** — stocks (20 tickers). Live keys.
- **CoinGecko** — crypto (demo key).
- **NewsAPI + Gemini** — news FALLBACK only now.
- **Benzinga** — PRIMARY news (`/api/v2/news`) + earnings calendar
  (`/api/v2.1/calendar/earnings`). Key format gotcha: prefix is `bz.` NOT `bz_.`
  (the underscore breaks auth). Also has Quotes/Movers/Dividends available on the
  same key (not yet wired). Benzinga MCP exists (docs.benzinga.com/mcp) — dev
  discovery only, NOT part of shipped app.
- **Alternative.me** — Fear & Greed sentiment (free, no key).
- **Google Cloud TTS + HeyGen** — user HAS accounts; for Phase 3 (not started).

> SECURITY: real API key VALUES live in `.env` (gitignored) and Vercel env vars.
> Do NOT paste secret values into committed docs. They are already set in Vercel.

---

## Roku app architecture (apps/roku/)

**One Scene (`Dashboard`), many page Groups, nav-driven router.** Network I/O is
ONLY in the `DataFetcher` Task node (roUrlTransfer is MAIN|TASK-thread-only — never
on render thread).

**Components (components/):**
- `Dashboard.xml/.brs` — scene orchestrator: header, nav, 8 page groups, chyron,
  overlay, router (`onSectionChange`), BACK choreography, clock, 30s refresh.
- `DataFetcher.xml/.brs` — Task: fetches crypto/stocks/movers/news/sentiment/earnings,
  writes to observed fields.
- `NavSidebar.xml/.brs` + `NavItem.xml/.brs` — 8-section nav (glass focus).
  Sections: Home, Crypto, Stocks, News, Calendar, Sentiment, Settings, Upgrade.
- `AssetList`/`AssetRow` — selectable crypto/stocks lists → DetailOverlay.
- `NewsPanel`/`NewsRow` — rich news cards (thumb + headline + ticker chips).
- `CalendarList`/`CalendarRow` — earnings list (date/ticker/company/EPS/timing).
- `FearGreedGauge` — gauge (used on Home + Sentiment page).
- `DetailOverlay` — glass detail card on SELECT.
- `TickerRow` — bottom chyron, 20 crypto → 20 stocks → loop (marquee dup trick).
- `CryptoGrid` — LEGACY, unused (safe to ignore/delete).

**source/:** `main.brs`, `Config.brs` (apiBaseUrl = prod), `HttpClient.brs`
(roUrlTransfer + peer/host verify), `Theme.brs` (Midnight palette + format
helpers), `Raf.brs` (RAF ads stub), `Billing.brs` (Roku Billing stub).

**images/:** generated assets — `bg_gradient_fhd.png` (720p, radial glow+vignette),
`glass_panel.9.png` / `glass_focus.9.png` (frosted 9-patch), `glow_gold.png`,
`gauge_bar.png`, `chyron_bg.png`, `accent_line.png`, icons/splashes.

**Design system (Theme.brs "Midnight"):** bg `0x070B12`, gold accent `0xF7C948`,
emerald up `0x34D399`, rose down `0xF43F5E`, slate text ramp. All components use it.

---

## Build / deploy / test commands

```bash
# Node is via nvm — NOT on git-bash PATH by default:
export PATH="/c/Users/Armyg/AppData/Local/nvm/v24.11.1:/c/Users/Armyg/AppData/Roaming/npm:$PATH"
NODE_BIN="/c/Users/Armyg/AppData/Local/nvm/v24.11.1/node.exe"

# Typecheck backend
"$NODE_BIN" node_modules/typescript/bin/tsc -p services/api/tsconfig.json --noEmit

# Package Roku channel (manifest at zip root; excludes bsconfig/out)
python3 scripts/package-roku.py

# Sideload + launch + console (Roku)
curl.exe -s -S --user "rokudev:2789" --digest -F "mysubmit=Replace" \
  -F "archive=@dist/marketpulse-roku.zip" "http://192.168.1.80/plugin_install"
curl.exe -s -d "" "http://192.168.1.80:8060/launch/dev"
timeout 16 curl.exe -s "telnet://192.168.1.80:8085"   # BrightScript console

# Deploy backend (needs VERCEL_TOKEN; CLI = vercel.cmd on this machine)
export VERCEL_TOKEN="<in chat history / user>"
vercel.cmd --prod --yes

# BrighterScript static analysis (catches most BRS errors; MISSES some XML)
cd apps/roku && "$NODE_BIN" <npm> exec --yes brighterscript@latest -- --project ./bsconfig.json
```

Always bump `apps/roku/manifest` build_version before sideloading. Currently 00007.

---

## Hard-won gotchas (DON'T regress)
1. **roUrlTransfer is Task-thread-only** — all Roku network in DataFetcher. Render-thread = fatal crash.
2. **Focus-toggle fields need `alwaysNotify="true"`** (navFocus/rowsFocus) or the 2nd focus set silently no-ops → frozen D-pad.
3. **BrighterScript misses XML tag mismatches** — Roku's parser is stricter. ALWAYS sideload + check console; never trust local validate alone.
4. **`<Poster>` vs `</Rectangle>` tag mismatches** = compile fail. Match open/close tags.
5. **MarkupList needs a custom itemComponent** to render rows; LabelList renders `title` only.
6. **9-patch (`.9.png`) for stretchable frosted panels**; design FHD but ship ≤720p source PNGs (device is 720p).
7. **git-bash MSYS path-conversion** mangles `/api/...` inside curl `-w` strings — cosmetic; data is fine. Use `MSYS_NO_PATHCONV=1` if needed.
8. **`.env` is gitignored** — verify `git status` never lists it before committing.
9. **On-device verification is mandatory** — "validated locally" ≠ "works". User's eyes/remote find the real bugs (freeze, empty pages).

---

## What's DONE
- Full backend (7 data endpoints + privacy), live on Vercel, cached, mock fallbacks.
- Benzinga primary news (tickers/images/categories) + earnings calendar — LIVE.
- Fear & Greed sentiment endpoint + gauge.
- Roku v2: premium Midnight design system, gradient bg, glass nav, bottom chyron
  (40-asset marquee), selectable asset lists + detail overlay, multi-page nav,
  rich news cards, calendar page, Sentiment/Settings/Upgrade pages, 720p assets.
- GitHub repo, CONTRIBUTING.md, SECURITY.md, packaging script, BrighterScript config.

## What's NEXT (after the nav bug)
1. **FIX the section-nav empty-page bug** (top of this doc) — #1 priority.
2. **#3 AI Anchor** (user wants this): Google Cloud TTS reads an AI-composed
   market brief; then HeyGen avatar video anchor (true 4K via Roku Video node).
   User has both accounts. Backend `/api/brief` (compose script from live data +
   Gemini → TTS audio URL); Roku Audio/Video playback. See PLAN-NEXT.md.
3. Render ticker chips/thumbnails polish; Benzinga Movers/Dividends pages.
4. Roku store submission (real icon art 248×140/290×218/540×405, genkey/package —
   device-bound, human-only). See docs/roku-submission/.
5. Fire TV native scaffold + Amazon IAP (PEM staged at apps/firetv/assets/).

## Collaboration
Three collaborators (user + Claude Code + Cowork) share GitHub `main`.
Protocol: `git pull --rebase` before work, `git push` after. See CONTRIBUTING.md.
