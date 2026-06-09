# ROKU.md — Platform constraints & gotchas (read before touching code)

## Rendering & layout
- **Design space = 1920×1080 (FHD)**, declared in `manifest` (`ui_resolutions=fhd`),
  auto-downscaled to the device. There is NO 4K UI layer. (See `DESIGN.md` §0.)
- **Overscan:** keep content inside ~5% margins (≈ `[96,54]`). Don't put critical
  text/edges at the extremes.
- Test device is a **Roku Express (low-end)** at `192.168.1.80` ("War and Rock",
  firmware 15.2.4). If it's smooth/crisp there, it's fine everywhere.

## BrightScript / SceneGraph rules (from repo `.claude/rules/roku.md`)
- **No globals** — use `m.` scope only.
- **Network is TASK-thread only.** `roUrlTransfer` cannot run on the render thread —
  all fetches live in `DataFetcher.brs`. Add the brief etc. there, write to an
  observed output field.
- **Focus boolean fields MUST have `alwaysNotify="true"`** or focus won't re-fire.
- Define the focus chain explicitly; every SceneGraph component owns its focus.

## ⚠️ The nav-bug lesson (do NOT reintroduce)
A P0 bug made every section render an empty page. Two root causes — avoid both:
1. **`for each key in someAssocArray` iterates VALUES, not keys** in BrightScript.
   The visibility loop indexed the AA by node refs → invalid → all hidden. Fix in
   `Dashboard.brs` `onSectionChange` is **explicit per-section** `visible =` lines.
   Keep that pattern. Don't "clean it up" into a loop.
2. **`callFunc` on an `invalid` node is fatal** and aborts the handler mid-run. Every
   `callFunc`/field-set on a list/overlay is guarded with `<> invalid`. Keep the guards.
**For v1.1: restyle, never rewire.** Don't rename node ids, don't change the focus
routing, don't touch `onSectionChange`/`onKeyEvent` logic. Change colors, fonts,
images, add `Animation` nodes — that's it.

## Animation nodes (the cinematic motion API)
```xml
<Animation id="fadeIn" duration="0.2" repeat="false" easeFunction="outQuad">
  <FloatFieldInterpolator key="[0,1]" keyValue="[0,1]"
                          fieldToInterp="targetGroup.opacity" />
</Animation>
```
- Trigger: `m.fadeIn.control = "start"`.
- Interpolators: `FloatFieldInterpolator` (opacity/scale), `Vector2DFieldInterpolator`
  (translation/scale-xy), `ColorFieldInterpolator` (color).
- `easeFunction`: `linear|inQuad|outQuad|inOutQuad|inExpo|outExpo|...`
- Keep durations 120–250ms for UI; slow (10s+) for ambient background drift.

## Custom fonts (highest-risk change — isolate + verify)
```xml
<Font id="hdr" uri="pkg:/fonts/Sora-Bold.ttf" size="44" />
```
Reference via `font="font:..."` won't work for custom — set the node's `font` field to
the `Font` node (or use `<Font role="font" .../>` child). Bundle `.ttf` under
`apps/roku/fonts/`, ensure `package-roku.py` includes it. Use **SIL OFL** fonts only
(Sora, Inter, IBM Plex, Space Grotesk, Archivo). Fall back to system fonts if flaky.

## Background `Video` node (ambient motion)
- Put a `Video` node behind the UI; ContentNode `url` → looping clip, `streamFormat`.
- Set `loop=true` (or playlist loop). **Use low-res (720p, low bitrate)** for the
  background — Roku docs warn 4K backgrounds cause load delays. Mute it.
- Don't block first paint on it; let UI render, video fades in.

## Build / verify (full commands in `BUILD.md`)
- Device IP `192.168.1.80`; dev web server port 80 (digest `rokudev:2789`);
  ECP `8060`; BrightScript console `8085`; dev telnet/genkey `8080`.
- **Bump `manifest` `build_version` before every sideload.**
- **Never trust BrighterScript validation alone** — sideload, watch console (8085) for
  errors, have the user confirm on the TV. This is a hard repo rule.
