# MarketPulse TV — TV UX Rules

These rules apply to **every** screen, on Fire TV and Roku. Treat them
as enforceable: if a PR violates one, the PR is not ready.

## Viewing Distance
Designed for **10-foot viewing**. If you can read it at 18 inches but
not from a couch, it's too small.

## Typography
| Use | Minimum size |
|---|---|
| Section / screen headers | 48 px |
| Body text | 32 px |
| Labels / metadata | 24 px |
| Ticker | 36 px |

Always use system fonts where available — they're hinted for the
device's display pipeline.

## Color
- Always dark background (`theme.colors.bg = #0A0E14`).
- Text contrast ≥ 7:1 on the background (WCAG AAA at distance).
- Use semantic colors:
  - `up` (green) `#00D88A` for positive change
  - `down` (red) `#FF5860` for negative change
  - `accent` (gold) `#FFB800` for focus rings and CTAs

## Navigation
- **D-pad only.** No touch assumptions. No mouse hover state.
- Every interactive element must have either `hasTVPreferredFocus`
  (Fire TV) or be inside an explicit focus chain (Roku SceneGraph).
- A user must be able to traverse the entire screen with UP / DOWN /
  LEFT / RIGHT / SELECT / BACK only.

## Focus Affordance
- 3 px solid accent-colored border around the focused element.
- Subtle 1.05× scale to reinforce focus on motion-sensitive TVs.
- No focus ring on non-interactive elements (the ticker, headers).

## Modals
- **None.** Use full-screen overlays instead. Modals are easy to lose
  focus to with a D-pad and frustrate the lean-back experience.
- The Paywall is a full-screen overlay, not a modal — it consumes the
  whole content area and the back button returns to the previous tab.

## Loading & Error States
- Every data-driven component must render a `LoadingState` on first
  load and an `ErrorState` (with a focusable Retry button) on failure.
- Subsequent refreshes should NOT show the loading state if cached
  data is present — flickering is worse than slightly stale data.

## Spacing
The grid scale is 8/12/20/32/48/80 (`theme.spacing.xs…xxl`). Always
use the scale — never raw pixel values.

## Animations
- Cap motion at 60s for the ambient ticker and at 250ms for focus
  transitions. Long, snappy, or distracting animations are out of
  place on a TV.
