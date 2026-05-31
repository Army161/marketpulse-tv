# Roku v2.1 — Multi-Page App + Glassmorphism

## Goal
Turn the single dashboard into a real multi-page app with a premium
glassmorphism UI: frosted translucent panels, rounded corners, glowing focus,
popup-style cards.

## Pages (routed by the nav sidebar)
1. **Home** — overview: top movers, Fear & Greed gauge, latest headlines
2. **Crypto** — selectable top-20 list → detail overlay
3. **Stocks** — selectable top-20 list → detail overlay
4. **News** — scrollable AI-summarized headlines
5. **Sentiment** — full Fear & Greed gauge + plain-English explanation
6. **Settings** — refresh rate, default page, feature toggles, about (folds in
   the "Customize" ask)
7. **Upgrade** — Free / Premium / Pro glass pricing cards (selectable)

## Glassmorphism approach (honest about Roku limits)
- Roku has NO runtime backdrop blur. We bake the frosted look into assets:
  - `glass_panel.9.png` — translucent rounded panel, light top rim (9-patch,
    stretches to any card/row size)
  - `glass_focus.9.png` — focused variant: brighter fill + gold rim
  - `glow.png` — soft radial glow behind focused buttons
- Applied to: nav items (focused = frosted highlight), Upgrade pricing cards,
  Settings rows, the detail overlay, the gauge panel.

## Architecture
- One Scene (`Dashboard`), N page Groups, nav-driven router (already in place).
- New components: `GlassButton` (reusable frosted button), `SettingsPage`,
  `UpgradePage`, `SentimentPage`.
- Settings persist via `roRegistry` (Roku's on-device key/value store).

## Honest constraints
- Device must be powered on + on WiFi to sideload + visually verify.
- True 4K applies only to video (Phase 4 HeyGen avatar), not UI.
- A dedicated design pass (e.g. Claude Design) could further refine palette and
  spacing — this build delivers a strong, cohesive glass system to start from.

## Verification
- BrighterScript clean, sideload Install Success, on-device visual confirm.
