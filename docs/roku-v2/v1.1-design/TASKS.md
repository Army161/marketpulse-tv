# TASKS.md — v1.1 Cinematic checklist (phased, low-risk → high-risk)

Work top-to-bottom. Each phase: edit → bump build → sideload → console clean → user
eyeballs TV → commit on `v1.1-design`. **Restyle, never rewire** (see `ROKU.md`).

## Phase 1 — Background + palette (highest impact, lowest risk)
- [ ] Pick a hero-bg concept (`docs/roku-v2/v1.1-design/concepts/`); regen at higher res if desired.
- [ ] Bake to `bg_gradient_fhd.png` (1920×1080) and replace.
- [ ] `Theme.brs`: apply refined palette (DESIGN.md §2) — deeper panel, candle-green,
      warm glow tokens. (Colors only; no structure.)
- [ ] Sideload → verify all 8 sections still render + read clearly on TV.

## Phase 2 — Component polish (low risk)
- [ ] `glass_panel.9.png` / `glass_focus.9.png`: deeper frost + 2px gold top hairline.
- [ ] Focus state → gold glow ring + 1.04 scale (Animation node).
- [ ] `corner_bracket.png` on hero panels (Sentiment/Settings/Upgrade).
- [ ] Chyron bg deepen; gauge glow; mover rows → green/red pills, right-aligned %.
- [ ] Nav: active-item gold pill + glow; (optional) section glyphs.
- [ ] Verify on TV.

## Phase 3 — Motion (medium risk)
- [ ] Section-change cross-fade + rise (Animation nodes; do NOT touch `onSectionChange`
      logic — only add an animation trigger).
- [ ] Focus scale/glow ramp.
- [ ] Animate Fear & Greed gauge on data update.
- [ ] (Optional) ambient `bg_loop.mp4` on a background Video node (720p, muted, loop).
- [ ] Verify perf is smooth on the Roku Express; verify on TV.

## Phase 4 — Typography (highest risk — isolate)
- [ ] Bundle `Sora-Bold.ttf` (headers) + `IBMPlexMono-Medium.ttf` (numbers) under
      `apps/roku/fonts/`; confirm `package-roku.py` ships them.
- [ ] Swap header + numeric fonts via `Font` nodes; tabular figures on all prices.
- [ ] Heavy device verify (load path/perf). If flaky → revert to system fonts, don't block.

## Phase 5 — Ship v1.1
- [ ] Full 8-section nav regression on the remote (RIGHT/SELECT/BACK, chyron, overlay).
- [ ] Console clean; BrighterScript clean.
- [ ] `/code-review` the diff.
- [ ] Bump build, package, **sign with the SAME genkey key** (DevID `ec81ec69…`), upload
      as a v1.1 update to the existing Beta channel. (See `BUILD.md` for why same key.)
- [ ] Update root `MEMORY.md`, `CURRENT-BUG.md`/changelog.

## Guardrails (every phase)
- Don't rename node ids or change focus routing.
- Bump `build_version` before every sideload.
- Keep the 00010 card-spacing fix and the nav fix intact.
- The submitted store build (00010) is frozen — v1.1 is a separate update.
