# Roku Submission — Asset Checklist

Owner: 👤 (a designer/tool must produce the branded artwork; current files are
solid-color placeholders that will fail Roku's quality review).

## Channel Focus Icons (REQUIRED)
Roku's focus-icon dimensions — **these correct the wrong values that were in
the original `docs/store-submission.md`**:

| Manifest key | Resolution | Correct size | Current placeholder | Status |
|---|---|---|---|---|
| `mm_icon_focus_sd`  | SD  | **248 × 140** | 540 × 405 | ❌ wrong size + placeholder |
| `mm_icon_focus_hd`  | HD  | **290 × 218** | 336 × 210 | ❌ wrong size + placeholder |
| `mm_icon_focus_fhd` | FHD | **540 × 405** | 504 × 284 | ❌ wrong size + placeholder |

Format: PNG, no transparency required, full-bleed branded artwork.

## Splash Screens (REQUIRED) — already correct size
| Manifest key | Size | Current | Status |
|---|---|---|---|
| `splash_screen_sd`  | 720 × 480   | 720 × 480   | ✅ size OK (re-skin art if desired) |
| `splash_screen_hd`  | 1280 × 720  | 1280 × 720  | ✅ size OK |
| `splash_screen_fhd` | 1920 × 1080 | 1920 × 1080 | ✅ size OK |

## Store Listing Art (uploaded in portal, not in the .pkg)
| Asset | Size | Notes |
|---|---|---|
| Channel poster (HD) | 540 × 405 | shown in channel store grid |
| Channel poster (FHD) | 1280 × 720 | larger store surfaces |
| Screenshots | 1920 × 1080, ≥ 3 | see capture method below |

## Screenshot capture (👤, but easy)
Instead of phone photos of the TV, capture clean 1080p frames from the device:
- Roku dev console (`http://<roku-ip>/`) has a **"Utilities → Screenshot"** /
  capture-screen option that saves a PNG of the current channel frame.
- Or via ECP: some Roku models expose a screenshot through the dev web UI's
  "Screenshot" button after enabling it in the dev console.
Capture: (1) full dashboard, (2) crypto panel, (3) news panel in focus.

## Files to replace (same filenames, in `apps/roku/images/`)
```
icon_focus_sd.png   → 248 × 140 branded
icon_focus_hd.png   → 290 × 218 branded
icon_focus_fhd.png  → 540 × 405 branded
splash_sd.png       → 720 × 480 branded (optional re-skin)
splash_hd.png       → 1280 × 720 branded (optional re-skin)
splash_fhd.png      → 1920 × 1080 branded (optional re-skin)
```
Keeping the filenames means no manifest edits are needed — just drop in the new
art and repackage.
