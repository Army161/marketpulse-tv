# MIDJOURNEY-PROMPTS.md — v1.1 cinematic asset prompts (MJ v7)

Owner generates these in Midjourney, picks the best variant, **Upscales**, downloads,
and hands the PNGs back. Claude Code bakes them to slot dimensions and wires them in.

## How to get a COHESIVE set (important)
1. Generate **Prompt 1** and **Prompt 2** first. Pick the dashboard background you love
   (darkest / most negative space wins for readability).
2. Once you have a favorite, copy its **`--sref` style code** (or its image URL) and
   append `--sref <code>` to the other prompts so the whole set shares one look.
3. Keep `--style raw --v 7` on everything. Upscale before downloading.
4. Priorities: **#1 and #2 are must-haves** (dashboard bg). #6 is a great bonus for the
   future AI anchor. #4/#5 are helpers.

---

### 1 — Hero dashboard background (signature) ★ must-have
```
cinematic premium financial television background, ultra-dark near-black slate navy base, warm golden volumetric god-rays from the upper center, faint translucent candlestick chart silhouettes in emerald green and rose red along the lower third, delicate thin grid lines receding in perspective, soft floating bokeh particles, dark vignette edges, vast dark negative space across the upper-left and center for UI, luxury fintech broadcast aesthetic, moody, elegant, depth, ultra detailed --ar 16:9 --style raw --v 7 --stylize 200 --no text, words, letters, logos, watermark, ui, numbers
```

### 2 — Hero dashboard background (subtle / minimal) ★ must-have
```
minimalist dark financial background, near-black slate navy, a single soft warm gold glow in the upper-center fading into pure black, extremely subtle candlestick silhouettes barely visible along the very bottom edge, faint grid, mostly empty dark space for text overlay, calm, premium, cinematic, refined --ar 16:9 --style raw --v 7 --stylize 100 --no text, words, letters, logos, watermark, clutter, bright colors, ui
```

### 3 — Hero background (alt: dynamic / energy)
```
cinematic abstract financial markets background, dark navy black, streaks of golden light and gentle motion blur, ghosted candlestick and line-chart forms, drifting particles, dramatic volumetric lighting, deep depth of field, premium broadcast graphics, dark negative space top-left --ar 16:9 --style raw --v 7 --stylize 300 --no text, words, logos, watermark, ui, faces
```

### 4 — Gold radial glow element (composite over the bg in code)
```
soft warm golden radial light glow, smooth gradient from a luminous gold center to pure black edges, volumetric haze, abstract lighting element, no objects, centered --ar 16:9 --style raw --v 7 --no text, logos, shapes, objects, watermark
```
> Use black-as-transparent (screen blend) when compositing. Optional — the bg prompts
> already include the glow.

### 5 — Frosted glass card texture (reference for the panels)
```
frosted dark glass panel, semi-transparent charcoal-navy, subtle gaussian blur, a thin luminous gold highlight along the top edge, soft inner shadow, premium glassmorphism UI card, clean flat front view, centered on black --ar 1:1 --style raw --v 7 --no text, logos, content, icons, watermark
```
> This is a *look reference*; the real Roku card is a 9-patch (`glass_panel.9.png`) —
> we slice a flat region or rebuild it in code from this style.

### 6 — AI Anchor studio backdrop (Phase 3b bonus — behind the HeyGen avatar)
```
empty modern financial news television studio set, dark navy and black, glowing gold accent lighting, a large softly-blurred video wall of abstract market charts in the background, sleek minimal anchor desk silhouette, cinematic depth of field, premium broadcast look, bokeh, no people --ar 16:9 --style raw --v 7 --stylize 250 --no text, words, logos, watermark, people, faces
```

### 7 — Splash/boot background refresh (optional, NO text — we overlay the logo)
```
cinematic dark financial brand splash background, near-black slate navy, central warm gold glow, elegant candlestick motif along the bottom, subtle gold corner-bracket framing, premium, minimal, generous centered negative space for a logo --ar 16:9 --style raw --v 7 --stylize 150 --no text, words, letters, logos, watermark
```

---

## When you bring them back
Drop the PNGs in chat (or into the repo). Tell me which is the chosen dashboard bg.
Claude Code will: downsample to exact slot dims (e.g. 1920×1080), place in
`apps/roku/images/`, refine the palette to match, sideload to the TV, and you eyeball it.
