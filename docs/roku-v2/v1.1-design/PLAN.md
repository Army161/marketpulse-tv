# PLAN.md — v1.1 phasing, rationale & update log

## Why this order (impact ÷ risk)
1. **Background + palette first** — ~80% of the perceived "premium" jump, near-zero
   risk (asset swap + color tokens). Fixes the exact brand mismatch the owner flagged.
2. **Component polish** — glass/focus/chyron/gauge. Low risk, high payoff.
3. **Motion** — Animation nodes. Medium risk (timing/perf); big "cinematic" gain.
4. **Typography** — custom fonts. Highest risk (load path/perf); do last, isolate,
   be ready to revert to system fonts.
5. **Ship** as a v1.1 update to the existing Beta channel (same signing key).

Rationale: each phase is independently shippable and independently revertable. If the
owner loves it after Phase 2, you can ship there. Never let the risky font phase block
the safe wins.

## Sequencing with the rest of the project
- v1.0 (build 00010) is **submitted and frozen** — don't touch it.
- v1.1 lives on branch `v1.1-design`, becomes a **channel update** (same key).
- The **AI Anchor** (`/api/brief` + Daily Brief button) is on `main` (build 00011),
  gated off until TTS creds. v1.1 design should **style** the Daily Brief button +
  `BriefOverlay` (they exist on main; rebase or cherry-pick if designing them).
- Phase 3b (HeyGen 4K avatar video) is the *true* 4K cinematic moment — separate effort.

## Decision points for the owner
- **Ambient background video loop?** (Phase 3) — adds real motion but uses a Video node
  + a generated clip. Recommend yes, low-res, subtle. Owner to approve the look.
- **Custom fonts?** (Phase 4) — big premium gain, highest risk. Owner to approve after
  seeing it on the TV.
- **How far before shipping v1.1?** — Phases 1–2 alone are a dramatic upgrade and safe.

## Update log (append as you go)
- 2026-06-09 — Branch `v1.1-design` created from `main`. Handoff kit written. 2× hero-bg
  concepts generated (`nano_banana_pro`, 16:9). Direction set: deep-black brand-matched
  bg + refined glass + motion + tabular type. Background-first.
- (next) — …
