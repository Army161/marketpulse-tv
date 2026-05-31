# MarketPulse TV — Roku v2 "Real Channel" Rebuild

## Vision
Transform the Roku channel from a functional-but-flat dashboard into a
broadcast-grade live finance channel: premium visual design, a real navigable
dashboard with selectable sections, a continuous multi-asset ticker, a striking
Fear & Greed gauge, and (phased) an AI anchor that reads live market briefs.

## Honest platform constraints (so we build on truth, not hype)
- **Roku UI renders at 1920×1080 (FHD).** The device upscales to 4K TVs. All
  Roku channels (Netflix, YouTube) author UI at 1080p. We make the UI
  pixel-perfect FHD. TRUE 4K applies only to VIDEO content (the AI-anchor
  segments can be 4K via the Video node).
- **No CSS/gradients-by-code.** Roku visual richness comes from: Poster nodes
  with image assets (gradients, glows, graphics we generate as PNGs),
  Rectangle for solid fills, LayoutGroup/Group for structure, and a disciplined
  type+color system. We generate premium graphic assets programmatically.
- **Network I/O must stay on the Task thread** (roUrlTransfer is MAIN|TASK-only).
- **D-pad only.** Every interactive element needs an explicit focus chain.

## Phases

### Phase 1 — Backend support (this session) ✅ target
- `/api/sentiment` — Fear & Greed (alternative.me, free, no key) + optional CMC.
- Expand `/api/crypto` and `/api/stocks` defaults to top 20.
- Shared types: `SentimentResponse`.

### Phase 2 — Visual system + core UX (this session) ✅ target
- `Theme.brs`: real palette (depth, semantic colors), type scale, spacing.
- Generated graphic assets: gradient backdrop, gauge arc, panel glows, logo.
- **Ticker fix**: continuous scroll of TOP 20 CRYPTO → TOP 20 STOCKS → rotate.
- **SELECT fix**: selecting any ticker/coin opens a detail overlay.
- **Dashboard nav**: D-pad-navigable sidebar sections (Dashboard / Crypto /
  Stocks / News / Sentiment), SELECT switches the content area.
- **Fear & Greed gauge**: color-zoned gauge (Extreme Fear→Extreme Greed) with
  numeric readout — visually the centerpiece.
- Typography + color overhaul across all panels (kill the flat white text).

### Phase 3 — AI Market Anchor (audio) — roadmap, specced
- Backend `/api/brief`: compose a market-brief script from live data + AI
  (Gemini, already wired) → Google Cloud TTS → cached MP3 in storage.
- Roku Audio node plays the brief; "▶ Daily Brief" selectable on dashboard.
- Cost: Google TTS 1M chars/mo free; generate once/refresh, cache the audio.

### Phase 4 — AI Avatar Anchor (video, HeyGen) — roadmap, specced
- Backend calls HeyGen API with the brief script → avatar video (4K) → URL.
- Pre-generate (e.g., daily/hourly market brief) to absorb generation latency.
- Roku Video node plays it full-screen as the "live anchor" segment.
- User has HeyGen + Google Cloud accounts; keys go in Vercel env + .env.

## Success criteria
- Channel looks like a real finance network, not a data dump.
- Ticker streams 40 assets (20 crypto + 20 stocks), rotating, smooth.
- SELECT opens detail overlays; sidebar nav switches sections — all D-pad.
- Fear & Greed gauge live from alternative.me.
- Clean BrightScript console, sideloaded + verified on device (192.168.1.80).
- Phases 3–4 specced with concrete endpoints, data flow, and account wiring.

## Non-negotiables
- Verify every change on the physical Roku before calling it done.
- Keep network I/O on the Task thread.
- No secrets in the repo. No fake "done" — ship real increments, roadmap the rest.
