# MEMORY.md — v1.1 durable facts (pairs with repo-root MEMORY.md)

## Status snapshot (2026-06-09)
- v1.0 **build 00010** signed, packaged (`dist/MarketPulseTV-1.0.pkg`), and being
  submitted to Roku **Private/Beta**. FROZEN.
- `main` @ **00011** = AI anchor backend (`/api/brief`) + Roku "▶ Daily Brief" button
  (gated; needs Google TTS + Vercel Blob creds for audio + a backend deploy).
- This branch **`v1.1-design`** = cinematic visual glow-up. Branched from main.

## Signing (critical)
- genkey run ONCE. DevID `ec81ec69fdd9f5b3ec0b8892e7a7fd1c8965bddc`.
- Password is in the owner's password manager — NOT in the repo.
- **Never run `genkey` again** — it orphans the published channel. Re-use same key for
  all updates (including v1.1).

## Design intent
- Owner wants **cinematic / premium**. Honest ceiling: no literal-4K UI on Roku; achieve
  cinematic via 4K-baked stills + low-res ambient bg video + Animation motion + the
  true-4K HeyGen anchor video (later).
- #1 fix: replace the cool-blue `bg_gradient_fhd.png` with a deep-black, gold-glow,
  candlestick background matching the splash/icon brand art.
- Keep the disciplined palette (one gold #F7C948, candle green, rose red, slate ramp).

## Hard constraints (don't relearn the hard way)
- Restyle, never rewire. Don't rename node ids or change focus/nav routing
  (`onSectionChange`/`onKeyEvent`) — that caused the P0 empty-page bug.
- `for each key in AA` → VALUES not keys. `callFunc` on `invalid` is fatal — keep guards.
- Network is task-thread only (`DataFetcher.brs`). Focus bools need `alwaysNotify="true"`.
- Test device = low-end Roku Express @ 192.168.1.80 — if smooth there, smooth everywhere.

## Tooling
- Best asset tool live: Higgsfield `nano_banana_pro` (4K stills) + `generate_video`
  (motion). Figma for design-system specs. See `CAPABILITIES.md`.
- MCP servers connect/disconnect mid-session; ToolSearch to (re)load by keyword.

## Open decisions for owner
- Approve a hero-bg concept (2 generated this session).
- Ambient bg video loop? Custom fonts? How far before shipping v1.1 (Phase 1–2 is safe).
