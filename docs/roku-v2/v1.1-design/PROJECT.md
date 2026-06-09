# PROJECT.md — MarketPulse TV map (code / app / project)

## What it is
Premium live-finance TV channel for **Roku** (primary) and **Fire TV** (code-complete,
no APK). Glassmorphism "Midnight" theme, 8-section nav, bottom chyron. Live stocks,
crypto, AI news, Fear & Greed, earnings calendar.

## Stack
- **Backend:** Node 20 + Express → `services/api/`, deployed on Vercel
  (`https://marketpulse-tv.vercel.app`). Endpoints: `/api/health|stocks|crypto|movers|
  news|sentiment|calendar|brief` + `/privacy`.
- **Roku:** BrightScript + SceneGraph → `apps/roku/` (**design target for v1.1**).
- **Fire TV:** React Native + TS → `apps/firetv/`.
- **Shared types:** `shared/src/types/index.ts` (built to `dist/`, consumed as
  `@marketpulse/shared`).
- **Data:** Alpaca (stocks), CoinGecko (crypto), Benzinga (news+calendar),
  Alternative.me (sentiment), Gemini (AI script/summaries), Google TTS + Vercel Blob
  (anchor audio, gated).

## Roku app structure (what you'll edit for v1.1)
```
apps/roku/
  manifest                      # build_version, splash/icon refs, ui_resolutions=fhd
  source/
    Theme.brs                   # ← PALETTE + fonts live here (edit for v1.1)
    Config.brs                  # apiBaseUrl
    HttpClient.brs              # roUrlTransfer wrapper (task-thread)
  components/
    Dashboard.xml / .brs        # scene: nav, sections, focus, overlays (RESTYLE ONLY)
    NavSidebar.* / NavItem.*    # left nav
    AssetList.* / AssetRow.*    # crypto/stocks lists
    CalendarList.* / CalendarRow.*
    NewsPanel.* / NewsRow.*     # news cards (00010 spacing fix — keep)
    FearGreedGauge.*            # sentiment gauge (animate in v1.1)
    DetailOverlay.*             # ticker detail
    BriefOverlay.*              # AI Daily Brief reader + Audio (on main/00011)
    TickerRow.*                 # chyron
    DataFetcher.* (Task)        # all network fetches
  images/                       # ← ASSETS live here (swap bg first)
  fonts/                        # ← create for v1.1 custom fonts
```

## Build identity
- Current store build: **00010** (submitted, frozen). `main` HEAD: **00011**.
- Signing: genkey done once. DevID `ec81ec69fdd9f5b3ec0b8892e7a7fd1c8965bddc`.
  **Re-use the same key for all updates** (password in owner's password manager).

## Absolute rules (repo-wide)
- Secrets in `.env` only (gitignored). Never commit keys.
- ADD features, never remove. Restyle, never rewire the nav.
- Verify on the real device before "done." Bump build before every sideload.
- `git pull --rebase` before work, `git push` after. Three collaborators share the repo.
