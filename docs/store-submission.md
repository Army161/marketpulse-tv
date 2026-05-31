# MarketPulse TV — Store Submission Checklist

## Amazon Appstore (Fire TV)

### Required Assets
- [ ] App icon: 114×114 PNG, transparent background
- [ ] Small icon: 96×96 PNG
- [ ] Feature graphic: 1920×1080 PNG (replaces older 1024×500 spec — confirm in current dashboard)
- [ ] Screenshots: ≥ 3, each 1920×1080
- [ ] Promotional video: optional, MP4 ≤ 90 s
- [ ] Privacy policy URL (publicly hosted)
- [ ] Content rating questionnaire answers (Finance — Everyone)
- [ ] Long description (≤ 4000 chars)
- [ ] Short description (≤ 1200 chars)
- [ ] Keywords (≤ 50 chars total)

### Technical
- [ ] APK signed with **production** keystore (not debug)
- [ ] Targets Android API ≥ 24 (Fire TV minimum)
- [ ] Manifest declares `android.hardware.touchscreen` as `not required`
- [ ] Manifest declares `android.software.leanback` as `required`
- [ ] D-pad navigation verified end-to-end without touch
- [ ] Amazon IAP integrated (both SKUs registered and tested in sandbox)
- [ ] In-app purchase flow tested with App Tester

### Listing copy (starter — edit before submission)
> **MarketPulse TV** — Your AI-powered financial dashboard for the big screen.
> Live stock prices, real-time crypto, and AI-summarized news. Built for
> investors who want their portfolio visible at a glance, hands-free.

## Roku Channel Store

### Required Assets
- [ ] Channel poster (HD): 540×405 PNG
- [ ] Channel poster (FHD): 1280×720 PNG
- [ ] Channel icon focus (HD): 336×210 PNG
- [ ] Channel icon focus (FHD): 504×284 PNG
- [ ] Splash screen (HD): 1280×720 PNG
- [ ] Splash screen (FHD): 1920×1080 PNG
- [ ] Screenshots: ≥ 3
- [ ] Channel description (≤ 500 chars)
- [ ] Privacy policy URL

### Technical
- [ ] `manifest` complete with all required keys (see `apps/roku/manifest`)
- [ ] Roku Billing integration with `marketpulse_premium_monthly` SKU created in dashboard
- [ ] RAF integrated for ad insertion (free tier)
- [ ] Channel published as **Private** for closed testing first
- [ ] Pass Roku Channel Quality Review (checks: launch ≤ 30 s, BACK exits cleanly, no fatal scripts)

### Submission Tips
- Submit Private first → get the access code → install on the test
  Roku → run the QA checklist (`docs/qa-checklist.md`) → only then
  promote to Public.
- Roku reviewers may take 7–14 days for a first submission.

## Both Stores
- [ ] Privacy policy hosted at a stable URL
- [ ] Support email reachable
- [ ] No mention of competitors in copy or screenshots
- [ ] No misleading capability claims (e.g. don't say "real-time tick
  data" — we serve 30s-cached snapshots)
