# MarketPulse TV — Roku Submission Readiness Report

_Generated 2026-06-03. Build 00009. Pair with `packaging-runbook.md` for step-by-step._

---

## TL;DR

**Code & assets are submission-ready for Private (Beta) channel publish today.**
For Public certification, a designer pass on the icons is recommended but not
strictly required to pass technical review.

The four remaining steps (genkey, package, portal upload, screenshots) are
**device- or human-bound** and cannot be done from a shell — see "Your Steps"
section below for the copy-paste sequence.

---

## Verified ready ✅

| Area | Evidence |
|---|---|
| Backend endpoints | All 7 + /privacy returning 200 (verified 2026-06-03) |
| Privacy policy URL | https://marketpulse-tv.vercel.app/privacy (200) |
| Roku build sideloaded | 00009 installed clean (269 KB), 889ms launch, console = 0 errors |
| Section-nav bug | Fixed in 00008 (commit 1ee1301), polished in 00009 |
| BrighterScript validation | Pass — 0 errors, 0 warnings |
| Manifest dimensions | All 3 focus icons + all 3 splash screens at Roku-spec sizes |
| Channel art | Brand-styled (Midnight palette + gold wordmark + candle accents) |
| Channel metadata | Updated for v2.2 features in `store-metadata.md` |
| Data providers | Alpaca (stocks), CoinGecko (crypto), Benzinga (news+calendar), Alternative.me (sentiment) — all live |
| Eight pages | Home, Crypto, Stocks, News, Calendar, Sentiment, Settings, Upgrade |
| Glassmorphism design | Premium "Midnight" theme, gradient bg, glass focus rings |

## Your verification (real remote, 5 min)

Before signing, walk these on the actual TV remote:

- [ ] Home loads (gainers, losers, gauge, headlines, chyron all visible)
- [ ] Home → Crypto → data visible → BACK → Home restored
- [ ] Home → Stocks → SELECT a row → glass detail overlay → BACK → BACK → Home
- [ ] Home → News → Benzinga cards with thumbnail + ticker chips
- [ ] Home → Calendar → earnings rows (date / ticker / company / EPS / timing)
- [ ] Home → Sentiment → gauge visible with explainer text
- [ ] Home → Settings → glass info rows (version reads "1.0 (build 00009)")
- [ ] Home → Upgrade → 3 glass pricing cards (FREE / PREMIUM $9.99 / PRO $14.99)
- [ ] Chyron scrolls smoothly throughout
- [ ] BrightScript console clean during nav (`telnet 192.168.1.80 8085`)

If all 10 pass → the channel is functionally ready for submission.

---

## Your steps (HUMAN-only, ~30 min total)

### 1. Genkey on device (one-time, RECORD THE OUTPUT)
```bash
telnet 192.168.1.80 8080
# at the prompt:
genkey
```
Save the **dev-id** + **password** to a password manager. Re-running genkey
invalidates any previously-signed channel — you cannot recover these values.

### 2. Package the signed .pkg
1. Open http://192.168.1.80/ in a browser (auth `rokudev` / `2789`).
2. Click **Packager** tab.
3. App Name: `MarketPulseTV-1.0`
4. Password: (paste from step 1)
5. Click **Package** → download the `.pkg` file.

### 3. Create Roku developer account
- https://developer.roku.com
- Reachable support email required (Roku will use it for review correspondence).

### 4. Channel listing (Manage My Channels → Add Channel)
**Recommended first publish: Private (Beta) Channel** → instant install code, no
public review. Lets you (and beta testers) install permanently on any Roku.

Fill from `store-metadata.md`:
- Channel Name: **MarketPulse TV**
- Short Description (≤60 chars): _"Live markets, crypto & AI news for your TV."_
- Long Description: (copy block from store-metadata.md)
- Category: **News & Weather** (alternate: Lifestyle)
- Keywords: (copy block from store-metadata.md)
- Privacy Policy URL: **https://marketpulse-tv.vercel.app/privacy**
- Content rating: General audience, no objectionable content

### 5. Upload artwork (in portal, not in the .pkg)
| Asset | Source | Spec |
|---|---|---|
| Channel poster HD | designer or repurpose splash_hd.png | 540 × 405 |
| Channel poster FHD | designer or repurpose splash_fhd.png | 1280 × 720 |
| Screenshots ×3+ | capture from device (see method below) | 1920 × 1080 |

### 6. Capture screenshots (3+ required)
Best method — directly from the dev console while channel is running:
1. Channel running on device.
2. Open http://192.168.1.80/ → look for a **Screenshot** or **Utilities** button.
   (Available on most Roku firmware; the exact UI varies.)
3. Capture: (a) Home, (b) News page, (c) Crypto page, (d) Calendar page.

If your firmware doesn't expose a screenshot button, a clean 1080p phone photo
of the TV is acceptable for Private channels; designer-grade screenshots are
recommended for Public certification.

### 7. Submit
- **Private Beta:** publish → install code appears instantly → install via
  my.roku.com → Add channel with a code. Permanently linked to your Roku account.
- **Public Certification:** submit → Roku review typically 7–14 business days
  for a first-time channel. Address any review feedback by re-packaging with the
  **same** signing key and re-uploading.

---

## Optional polish before Public review

These are not blockers, but materially improve Public-cert pass rate:

1. **Designer-grade channel art** — drop new branded PNGs over the auto-generated
   ones (same filenames, same dims) and repackage. Auto-gen art uses the brand
   palette + wordmark but a designer's logotype + custom illustration will score
   higher with Roku's quality reviewer.

2. **Benzinga Movers/Dividends pages** — same API key, adapter pattern already
   proven. ~1-2 hours each. Adds two more pages to the nav.

3. **AI Anchor (Phase 3)** — Google Cloud TTS market brief + HeyGen avatar.
   See `docs/roku-v2/PLAN-NEXT.md`. Needs user-provided GOOGLE_APPLICATION_CREDENTIALS_JSON
   and HEYGEN_API_KEY. Adds a unique differentiator — there is no other Roku
   channel doing live AI anchor.

4. **Roku Billing integration** — actual subscription paywall. Free tier ships
   today; Premium/Pro SKUs need to be registered in the Roku portal Billing
   tab before they appear on-device.

---

## Out of scope for this submission

- **Fire TV native APK** — code is complete, no native Android build yet.
  Separate platform, separate store.
- **AI Anchor** — Phase 3 feature, optional.
- **Public cert pass** — requires the polish items above + 7–14 day Roku queue.

---

## Files referenced

- `apps/roku/manifest` — build_version 00009
- `apps/roku/images/icon_focus_*.png` — Roku-spec dimensions, brand-styled
- `apps/roku/images/splash_*.png` — Roku-spec dimensions
- `dist/marketpulse-roku.zip` — sideload-ready, 269 KB
- `scripts/generate-roku-icons.py` — re-runnable icon generator
- `docs/roku-submission/packaging-runbook.md` — step-by-step
- `docs/roku-submission/store-metadata.md` — portal copy
- `docs/roku-submission/asset-checklist.md` — art spec
