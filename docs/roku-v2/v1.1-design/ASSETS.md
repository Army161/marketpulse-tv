# ASSETS.md — Asset pipeline & generation prompts

## Pipeline (every asset) — **Midjourney → Canva → Roku**
1. **Midjourney = raw imagery** (owner runs it; best cinematic quality). Generate from
   `MIDJOURNEY-PROMPTS.md` → pick best of 4 → **Upscale** → download highest-res.
   (`nano_banana_pro` is the fallback generator only if MJ is unavailable.)
2. **Canva = finish + assemble** (owner's tool). Import the MJ raw, compose overlays
   (gold corner-brackets, extra glow, vignette), set the canvas to the **exact slot
   size** (e.g. 1920×1080), and **export PNG**. Canva also produces the **store
   screenshots + channel poster**. Claude Code can drive Canva via its MCP, or the
   owner assembles — decide per asset.
   - *No-Canva fallback (Claude Code, PIL):*
     `python3 -c "from PIL import Image; Image.open('src.png').resize((1920,1080), Image.LANCZOS).save('bg_gradient_fhd.png')"`
3. **Hand finished PNGs to Claude Code** → placed in `apps/roku/images/` at exact slot
   dims, palette tuned to match, `manifest` bumped, `package-roku.py`, sideload, verify
   on the TV. (Keep working files in `docs/roku-v2/v1.1-design/concepts/`, NOT in
   `apps/roku/images/` — that dir gets packaged into the channel.)

## Image slots (current → keep these exact dimensions)
| File | Dimensions | Role |
|---|---|---|
| `bg_gradient_fhd.png` | 1920×1080 | **main dashboard background ← replace first** |
| `splash_fhd/hd/sd.png` | 1920×1080 / 1280×720 / 720×480 | boot splash (already on-brand — keep) |
| `icon_focus_fhd/hd/sd.png` | 540×405 / 290×218 / 248×140 | channel icons (on-brand — keep) |
| `glass_panel.9.png` | 9-patch | frosted card — refine frost + gold hairline |
| `glass_focus.9.png` | 9-patch | focused card state |
| `focus_ring.9.png` | 9-patch | focus ring — upgrade to gold glow |
| `glow_gold.png` | ~1140×760 | soft gold glow behind cards — reuse/enhance |
| `gauge_bar.png` | — | Fear & Greed gauge track |
| `chyron_bg.png` | — | bottom ticker background — deepen |
| `accent_line.png` | 1590×4 | header underline |

## New assets to create
| New file | Dims | Prompt seed |
|---|---|---|
| `bg_gradient_fhd.png` (replace) | 1920×1080 | hero bg — see Prompt A |
| `bg_loop.mp4` (optional Phase 2) | 1280×720, 12–20s seamless | Prompt B (video) |
| `corner_bracket.png` | ~600×400, transparent | Prompt C |
| section glyphs (8) | ~48×48 each, gold | simple line icons: markets ▲, crypto ◆, stocks ▦, news ▤, calendar ▦, sentiment ◐, settings ⚙, upgrade ★ |

### Prompt A — hero background — MIDJOURNEY (primary)
**Midjourney v7 command:**
```
cinematic premium financial television background, ultra-dark near-black slate navy, warm golden volumetric light rays from upper center, faint translucent candlestick chart silhouettes in emerald green and rose red along the lower third, thin grid lines, soft bokeh light particles, dark vignette edges, generous dark negative space across upper-left and center for UI overlay, luxury fintech broadcast aesthetic, depth, ultra detailed --ar 16:9 --style raw --v 7 --stylize 250 --no text, logos, watermark, ui
```
Generate → pick best of the 4 → **Upscale** → download highest-res → bake → 1920×1080.
Tip: `--style raw` keeps it controlled (good for a UI background); nudge `--stylize`
50–400 for less/more artistic. Variations for subtlety: add `darker, more minimal,
candles barely visible` if it competes with overlaid text.

**Fallback (`nano_banana_pro`) prose prompt** — 2 concepts already generated this way
in `concepts/`:
> Cinematic premium financial-television background. Ultra-dark slate-navy near-black
> (#070B12) base, subtle warm golden radial glow from upper-center, faint translucent
> candlestick silhouettes (muted emerald/rose) along the lower third, thin grid lines,
> soft volumetric light, gentle vignette, bokeh particles, generous dark negative space
> upper-left/center for UI overlay. Luxury fintech broadcast aesthetic. No text/logos/UI.
> `aspect_ratio:16:9`, generate 4K, bake → 1920×1080.

### Prompt B — ambient motion loop (low-res video)
> Slow, seamless, hypnotic loop of the Prompt-A scene: gold glow gently breathing,
> candlestick silhouettes drifting almost imperceptibly, faint particle float. Very
> subtle, dark, calm — a background, not a focal point. 12–20s seamless loop, muted.
> Render modest res; downscale to 720p low-bitrate for Roku background.

### Prompt C — gold corner bracket motif
> A single elegant thin gold (#F7C948) broadcast corner-bracket framing element on a
> transparent background, top-left orientation, subtle outer glow, premium minimal.
> PNG with alpha. (Mirror in code for the other 3 corners.)

## Fonts (bundle under `apps/roku/fonts/`, SIL OFL only)
- Headers: **Sora** or **Space Grotesk** Bold → `Sora-Bold.ttf`
- Numbers (tabular): **IBM Plex Mono** or **Inter** → `IBMPlexMono-Medium.ttf`
- Source: fonts.google.com (download .ttf). Verify `package-roku.py` ships `fonts/`.

## Concepts generated this session
- 2× hero-bg concepts generated via `nano_banana_pro` (16:9, 1376×768):
  `docs/roku-v2/v1.1-design/concepts/hero-bg-concept-1.png` and `-2.png`. Pick one,
  regen at higher res if desired, then bake to `bg_gradient_fhd.png` (1920×1080).
