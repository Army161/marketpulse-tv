# DESIGN.md — MarketPulse TV v1.1 "Cinematic" Direction

The brief from the owner: **make it cinematic, premium, "4K/8K," looks-amazing** —
while keeping every feature. This doc is the creative north star.

---

## 0. The honest truth about "4K/cinematic" on Roku (read first)

Roku UI (SceneGraph) renders in a **1920×1080 design space**, downscaled to the
device. You **cannot** get a literal 4K/8K *UI layer*. Chasing that is a dead end.
But you CAN make it feel genuinely cinematic with three real levers:

1. **4K-generated stills, baked down.** Generate backgrounds/textures at 4K (via
   `nano_banana_pro`), then downsample to 1920×1080 PNG. Result: razor-crisp,
   premium, no aliasing. (See `ASSETS.md`.)
2. **Ambient motion via a background `Video` node.** A slow looping clip (subtle
   gold-glow drift / candlestick parallax) behind the UI reads as "alive/cinematic."
   ⚠️ Roku docs: keep the *background* loop **low-res** (720p, low bitrate) — 4K
   backgrounds cause load delays. Real 4K is reserved for the **foreground anchor
   video** (HeyGen segment, Phase 3b), full-screen on a `Video` node.
3. **Motion design via `Animation` nodes** — fades, focus scale + glow, gauge fills,
   parallax. Stillness → motion is 80% of the "cinematic" perception jump.

**Bottom line:** crisp 4K-baked stills + a tasteful low-res motion background + real
animation + the true-4K anchor video = cinematic. Not a literal-4K UI.

---

## 1. The core problem to fix (what's wrong today)

Your splash/icon brand art is **deep-black, gold-glow, candlestick** = premium
broadcast. But the live dashboard renders on a **brighter cool-blue gradient**
(`bg_gradient_fhd.png`) that breaks that mood. `Theme.brs` *base* color is already
the right deep navy (`0x070B12FF`) — it's the background **image** that's off-brand.
**Fixing the background is the single highest-impact change.** Everything else is
refinement on top.

---

## 2. Palette (refined, not reinvented)

Keep the disciplined identity; deepen and grade it.

| Token | Current | v1.1 | Use |
|---|---|---|---|
| `bg` | `#070B12` | `#070B12` (keep) | base |
| `bgGlow` | — (new) | `#1A1305` warm | radial glow center |
| `panel` | `#111A2BCC` | `#0E1726E6` (deeper, more frost) | glass cards |
| `panelStroke` | `#1E293B` | `#F7C94833` (faint gold hairline) | card top accent |
| `text` | `#F8FAFC` | keep | primary |
| `textMuted` | `#94A3B8` | keep | secondary |
| `accent` | `#F7C948` | `#F7C948` (keep — signature gold) | focus, headers, brand |
| `accentWarm` | — (new) | `#FFB020` | glow gradient stop |
| `up` | `#34D399` | `#22C55E` (match candle green) | gains |
| `down` | `#F43F5E` | `#F43F5E` (keep) | losses |

Rule: **one gold, one green, one red, a slate ramp.** Resist adding hues.

---

## 3. Typography (the biggest "premium" lever after the bg)

Today: Roku **system fonts** — functional but generic. v1.1: **bundle a custom
TrueType font** (Roku `Font` node loads `.ttf` from `pkg:/`).

- **Headers / brand:** a confident grotesk — **Sora**, **Archivo**, or **Space
  Grotesk** (SemiBold/Bold). Open-license (SIL OFL).
- **Numbers / prices:** a font with **tabular figures** so columns align and digits
  don't jitter on refresh — **IBM Plex Mono**, **Inter** (with `tnum`), or **Roboto
  Mono**. Tabular figures on a finance app is a *huge* perceived-quality win.
- **Body:** Inter / system is fine.

TV legibility: min ~28px body in 1080 space, generous letter-spacing on labels
(uppercase headers like "TOP GAINERS" get +2 tracking), high contrast. Test at 10ft.

⚠️ Custom fonts are the **highest-risk** change (load path, fallback, perf). Do it
on its own commit and re-verify on device. If it misbehaves, fall back to system
fonts — don't block the whole pass on it.

---

## 4. Background (do this first — highest impact, lowest risk)

Replace `bg_gradient_fhd.png` with a brand-matched deep-black hero:
- Near-black `#070B12` base, warm **gold radial glow** upper-center, faint
  translucent **candlestick** silhouettes lower third, thin grid lines, vignette
  edges, bokeh particles. Generous dark negative space upper-left/center where the
  data panels sit (keep it calm behind text).
- Generate at 4K (`nano_banana_pro`), bake to `1920×1080`. Concepts already started
  in `docs/roku-v2/v1.1-design/concepts/`. See `ASSETS.md` for the exact prompt + dims.
- **Optional Phase 2:** add a `Video` node *behind* the UI playing a 12–20s seamless
  loop of that scene with slow drift (low-res 720p). Gives live cinematic motion.

---

## 5. Components

- **Glass cards** (`glass_panel.9.png`): deepen frost, add a 2px **gold top hairline**,
  soft outer shadow/glow, slightly more corner radius. Add the brand **gold
  corner-bracket** motif (from the splash) to hero panels (Sentiment/Settings/Upgrade).
- **Focus state:** today it's a gold side-bar. Upgrade to **gold glow ring + subtle
  scale (1.0→1.04) + brighten** via `Animation` node. Make focus *obvious and
  luxurious* — it's the soul of a 10-ft remote UI.
- **Nav sidebar:** add small section glyphs (▲ markets, ◆ crypto, ▦ calendar…),
  active item gets a gold pill + glow.
- **Chyron:** deepen its background, add a subtle top hairline, keep the smooth scroll.
- **Gauge (Fear & Greed):** animate the needle/fill on data update; add a soft glow
  at the current value.
- **Movers / lists:** tabular figures, right-aligned percentages, green/red with a
  faint pill background instead of bare text.

---

## 6. Motion (cinematic = motion)

Use `Animation` + interpolator nodes (see `ROKU.md` for the API):
- **Section change:** cross-fade + 8px rise of the incoming group (200ms ease-out).
- **Focus:** scale 1.0→1.04 + glow ramp (120ms).
- **Gauge:** animate value on refresh.
- **Background:** slow parallax/particle drift (or the looping Video node).
- **Daily Brief overlay:** fade+scale in; subtle equalizer bars while audio plays.
Keep it *subtle and fast* — TV motion should feel premium, never sluggish.

---

## 7. Per-page polish notes
- **Home:** the showcase. Brand-matched bg, animated gauge, glowing focusable "▶ Daily
  Brief" CTA, tabular movers.
- **Crypto/Stocks:** tabular price columns, green/red pills, refined row focus glow.
- **News:** the card spacing fix from 00010 stays; deepen card frost, crisper thumbs.
- **Calendar:** tabular EPS column, before/after-market chips.
- **Sentiment:** big animated gauge + gold corner-bracket hero panel.
- **Settings/Upgrade:** gold corner-bracket panels; Upgrade cards get the premium
  glass + gold treatment (and the 00010 spacing fix stays).

---

## 8. TV / accessibility discipline (non-negotiable for store + UX)
- **Overscan safe zone:** keep all content within ~5% margins (≈ `[96,54]` inset in
  1080 space). Roku design guidelines.
- **10-ft readability:** large type, high contrast, no thin 1px text.
- **Focus always visible:** every focusable element has an unmistakable focused state.
- **Performance:** background video low-res; don't over-animate; keep it 60fps-smooth
  on a Roku Express (the test device is a low-end model — if it's smooth there, it's
  smooth everywhere).

---

## 9. References (Roku official)
- Design: https://developer.roku.com/dev/docs/design
- TV UI philosophy: https://developer.roku.com/dev/docs/general-tv-ui-philosophy
- Graphics specs: https://developer.roku.com/docs/specs/graphics.md
- Animation: https://developer.roku.com/docs/references/scenegraph/animation-nodes/animation.md
- Video (background loops): https://developer.roku.com/docs/references/scenegraph/media-playback-nodes/video.md
- OTT design best practices (GlobalLogic): https://www.globallogic.com/best-practices-for-ott/
