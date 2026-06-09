# MarketPulse TV — v1.1 "Cinematic" Design Handoff (FOR CLAUDE-DESIGN)

> **Owner:** this kit is for **Claude-design** (the design/UI agent) — NOT Cowork.
> Claude-design owns the Roku visual build described here.

> **You are picking up a working, shipped app and making it look spectacular —
> WITHOUT changing how it works.** v1.0 (build 00010) is already submitted to the
> Roku Private/Beta channel. This is a **visual-only glow-up.**

## The one golden rule
**ADD and POLISH visuals. NEVER remove a feature, rename a node id, or alter the
navigation/focus flow.** This app had a P0 nav bug (empty pages) caused by exactly
that kind of structural change — see `ROKU.md` § "The nav-bug lesson." If you touch
`Dashboard.brs`/`Dashboard.xml`, keep every `findNode` id and the focus routing
identical. Restyle; don't rewire.

## What MarketPulse TV is (30 seconds)
Premium live-finance TV channel for Roku (BrightScript + SceneGraph). 8 sections:
Home, Crypto, Stocks, News, Calendar, Sentiment, Settings, Upgrade. Bottom chyron.
Live data from a Node/Express backend on Vercel. Full context in `PROJECT.md`.

## Current state
- **v1.0 build 00010** = submitted store build (nav fix + card-overlap polish, fully
  device-verified). Don't touch it.
- **main @ build 00011** = adds `/api/brief` AI anchor backend + a Roku "▶ Daily Brief"
  button (gated; audio off until TTS creds set).
- **This branch `v1.1-design`** = the cinematic visual pass. Branched from main.

## Start here (read in this order)
1. `DESIGN.md` — the creative direction (palette, type, background, motion, components, the honest "cinematic on Roku" strategy). **The centerpiece.**
2. `ROKU.md` — hard platform constraints + gotchas. Read before touching code.
3. `ASSETS.md` — the asset pipeline (what to generate at 4K, exact prompts, dims, bake-down).
4. `TASKS.md` — the actionable checklist, phased.
5. `CAPABILITIES.md` — every tool / skill / MCP / plugin / connector available to you for this build, and what each is good for.
6. `BUILD.md` — package / sideload / verify commands (device is at `192.168.1.80`).
7. `PLAN.md` — phasing + sequencing rationale.
8. `MEMORY.md` / `PROJECT.md` — durable facts and project map.

## Your file map (what the user asked for → where it lives)
The user requested many docs; here's the canonical mapping (consolidated to avoid
redundant stubs — same coverage, less noise):
| Requested | Lives in |
|---|---|
| handoff.md | **this file** |
| design.md | `DESIGN.md` |
| plan.md | `PLAN.md` |
| build.md | `BUILD.md` |
| roku.md | `ROKU.md` |
| tasks.md | `TASKS.md` |
| tools.md / skills.md / plugins.md / mcps.md / connectors.md / commands.md | `CAPABILITIES.md` (one coherent inventory) |
| code.md / app.md / project.md | `PROJECT.md` |
| memory.md | `MEMORY.md` (+ repo-root `MEMORY.md`) |
| update.md | `PLAN.md` § "Changelog / update log" |
| assets (new) | `ASSETS.md` |

## How to work
- Work **only on branch `v1.1-design`.** `git pull --rebase` before, `git push` after.
- **Verify on the real device** before claiming anything done — sideload to
  `192.168.1.80`, check the BrightScript console (port 8085) is clean, and have the
  user eyeball it on the TV. BrighterScript passing ≠ done. (See `BUILD.md`.)
- Bump `apps/roku/manifest` `build_version` before EVERY sideload.
- Multiple agents share this repo (user, Claude Code, Claude-design, Cowork).
  **Claude-design owns this v1.1 visual work.** Coordinate via git; `git pull --rebase`
  before, `git push` after. Work only on branch `v1.1-design`.

## What "done" looks like for v1.1
All 8 sections still navigate perfectly (RIGHT/SELECT/BACK), chyron scrolls, console
clean — AND it looks cinematic: deep-black brand-matched background, refined glass
panels, premium typography, motion on focus/section-change, gold-accent polish. The
user's bar: "cinematic, looks amazing." Ship it to the same Beta channel as a v1.1
update (same signing key — see `BUILD.md`).
